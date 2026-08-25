const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");
const { lobToBuffer } = require("../../Dashboard/Dashboard.repo");
const { getConnectionTMC } = require("../../../config/db");

const raiseAppealRepo = async ({ appId, citizenRemark, appealType, appealBy, userUniqueId, mode }) => {
    console.log("Repo: Raise Appeal", { appId, appealType, appealBy, mode });

    const sql = `
        BEGIN
            aorts_appealraise_ins(
                :in_appid,
                :in_citizenremark,
                :in_appealtype,
                :in_appealby,
                :in_useruniqueid,
                :in_mode,
                :out_errcode,
                :out_errmsg
            );
        END;
    `;

    const binds = {
        in_appid: appId,
        in_citizenremark: citizenRemark,
        in_appealtype: appealType,
        in_appealby: appealBy,
        in_useruniqueid: userUniqueId,
        in_mode: mode,
        out_errcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_errmsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
    };

    const result = await executeProcedureTMC({ sql, binds });

    if (!result.success) {
        throw new Error(result.error);
    }
    return result.outBinds;
};

const getApplicationDetailsRepo = async ({ appNo }) => {
    console.log("Repo: Get Application Details", { appNo });
    let connection;

    try {
        connection = await getConnectionTMC();

        const binds = {appNo};

        const sql = `
            SELECT
                num_application_noofcopy AS noofcopy,
                num_application_amount AS amount,
                var_appliaction_recieptno AS recieptno,
                CASE var_application_status
                    WHEN 'NW' THEN 'New'
                    WHEN 'AP' THEN 'Approved'
                    WHEN 'VP' THEN 'Verification Pending'
                    WHEN 'IP' THEN 'In Process'
                    WHEN 'DN' THEN 'Denied'
                    WHEN 'DL' THEN 'Deliverd'
                    WHEN 'PP' THEN 'Payment Pending'
                END AS status,
                blob_app_documentimg AS documentimg,
                VAR_APPLICATION_ISHDCOPYREQ AS IsHDCopyReq
            FROM aorts_application_det
            LEFT OUTER JOIN aorts_app_det
                ON num_app_corpid = num_application_deptid
                AND num_app_serviceid = num_application_serviceid
                AND var_app_appno = var_application_appno
            WHERE var_application_appno = :appNo
        `;

        const result = await connection.execute(sql, binds, {outFormat: oracledb.OUT_FORMAT_OBJECT});
        const rows = result.rows || [];

        for (const row of rows) {
            if (row.DOCUMENTIMG) {
                if (Buffer.isBuffer(row.DOCUMENTIMG)) {
                    row.DOCUMENTIMG = row.DOCUMENTIMG.toString("base64");
                } else {
                    const documentBuffer = await lobToBuffer(row.DOCUMENTIMG);
                    row.DOCUMENTIMG = documentBuffer.toString("base64");
                }
            }
        }

        return rows;
    } catch (err) {
        console.error("❌ Application Details Repo Error:", err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing application details connection:", err);
            }
        }
    }
};

module.exports = {
    raiseAppealRepo,
    getApplicationDetailsRepo,
};