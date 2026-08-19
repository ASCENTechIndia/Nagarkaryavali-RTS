const { executeQuery } = require("../../db/queryExecutor");
const getConnection = require("../../config/db");
const oracledb = require("oracledb");

const lobToBuffer = async (lob) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        lob.on("data", (chunk) => chunks.push(chunk));
        lob.on("end", () => resolve(Buffer.concat(chunks)));
        lob.on("error", reject);
    });
};

const getCorporationDetailsRepo = async ({ corporationId }) => {
    console.log("Repo: Fetch Corporation Details", {corporationId});

    let connection;

    try {
        connection = await getConnection();
        const binds = {corporationId: Number(corporationId)};

        const corporationSql = `
            SELECT
                num_corporation_id,
                var_corporation_name
            FROM admins.aoma_corporation_mas
            WHERE num_corporation_id = :corporationId
        `;

        const logoSql = `
            SELECT
                blob_corporation_img
            FROM aorts_corporation_mas
            WHERE num_corporation_id = :corporationId
        `;

        const corporationResult = await connection.execute(
            corporationSql,
            binds,
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );

        const logoResult = await connection.execute(
            logoSql,
            binds,
            {outFormat: oracledb.OUT_FORMAT_OBJECT}
        );

        const corporation = corporationResult.rows?.[0] || null;

        const logoRow = logoResult.rows?.[0] || null;

        let logo = null;

        if (logoRow?.BLOB_CORPORATION_IMG) {
            if (Buffer.isBuffer(logoRow.BLOB_CORPORATION_IMG)) {
                logo = logoRow.BLOB_CORPORATION_IMG.toString("base64");
            } else {
                const logoBuffer = await lobToBuffer(logoRow.BLOB_CORPORATION_IMG);
                logo = logoBuffer.toString("base64");
            }
        }

        return { corporation, logo};

    } catch (err) {
        console.error( "❌ Corporation Details Repo Error:", err);
        throw err;
    } finally {
        if (connection) {
            try {await connection.close();} catch (e) {
                console.error("Error closing connection:",e);
            }
        }
    }
};


const getDepartmentMenuRepo = async ({ ulbid }) => {
    console.log("Repo: Fetch Department Menu", { ulbid });
    const binds = { ulbid: Number(ulbid) };

    const sql = `
        SELECT DISTINCT
            entryid,
            num_serv_ulbid AS ulbid,
            CASE
                WHEN num_deptdspy_type = 'B' THEN accormarname || '/' || accorname
                WHEN num_deptdspy_type = 'M'
                    THEN CASE
                        WHEN num_serv_ulbid = 1850 AND deptid = 18 THEN 'व्यवसाय परवाना विभाग' ELSE accormarname END
                        WHEN num_deptdspy_type = 'E' THEN accorname ELSE accorname END AS accorname,
            seqid,
            deptid,
            deptname,
            var_entry_status,
            var_entry_path
        FROM vw_accordbk
        INNER JOIN aorts_service_def
            ON num_service_deptid = deptid
        INNER JOIN aorts_service_config
            ON num_serv_deptid = deptid
           AND num_serv_servid = num_service_serviceid
        LEFT JOIN aorts_deptdspyconfig_det
            ON num_deptdspy_ulbid = num_serv_ulbid
        WHERE var_entry_status = 'Y'
          AND num_serv_ulbid = :ulbid
        ORDER BY deptid
    `;

    const result = await executeQuery(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch department menu");
    }
    return result.rows;
};

const getServicesByDeptIdRepo = async ({ ulbid, deptId }) => {
    console.log("Repo: Fetch Services By Department", { ulbid, deptId });

    const binds = { ulbid: Number(ulbid), deptId: Number(deptId) };

    let sql;

    if (Number(ulbid) === 2) {
        sql = `
            SELECT DISTINCT
                CASE
                    WHEN var_service_displayname IS NULL
                        THEN var_service_eng_name
                    ELSE var_service_displayname
                END AS displayname,
                num_service_serviceid,
                var_dept_engname,
                num_dept_id
            FROM aorts.aorts_service_def
            INNER JOIN admins.aoms_dept_mas
                ON num_dept_id = num_service_deptid
            INNER JOIN aorts_service_config
                ON num_serv_servid = num_service_serviceid
               AND num_serv_deptid = num_service_deptid
            WHERE num_service_deptid = :deptId
              AND var_service_active = 'Y'
              AND num_serv_ulbid = :ulbid
            ORDER BY num_service_serviceid
        `;
    } else {
        sql = `
            SELECT
                CASE
                    WHEN var_serv_dispname IS NULL
                        THEN var_service_eng_name
                    ELSE var_serv_dispname
                END AS displayname,
                num_service_serviceid,
                var_dept_engname,
                num_dept_id
            FROM aorts.aorts_service_def
            INNER JOIN admins.aoms_dept_mas
                ON num_dept_id = num_service_deptid
            INNER JOIN aorts_service_config
                ON num_serv_servid = num_service_serviceid
               AND num_serv_deptid = num_service_deptid
            WHERE num_service_deptid = :deptId
              AND var_service_active = 'Y'
              AND num_serv_ulbid = :ulbid
            ORDER BY num_service_serviceid
        `;
    }
    const result = await executeQuery(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch services by department");
    }

    return result.rows;
};

const getDocumentsForServiceRepo = async ({ serviceId, ulbid }) => {
    console.log("Repo: Fetch Documents For Service", { serviceId, ulbid });

    const binds = { serviceId: Number(serviceId), ulbid: Number(ulbid) };

    const sql = `
        SELECT
            var_doc_engname,
            num_serdoc_servid,
            num_serdoc_ulbid,
            CASE
                WHEN var_serv_dispname IS NULL
                    THEN var_service_eng_name
                ELSE var_serv_dispname
            END AS displayname,
            num_service_serviceid
        FROM aorts.aorts_serv_doc_config
        INNER JOIN aorts.aorts_service_def
            ON num_service_serviceid = num_serdoc_servid
        INNER JOIN aorts_service_config
            ON num_serv_servid = num_service_serviceid
           AND num_serv_deptid = num_service_deptid
           AND num_serv_ulbid = num_serdoc_ulbid
        INNER JOIN aorts.aorts_doc_def
            ON num_doc_id = num_serdoc_docid
           AND num_doc_serviceid = num_service_serviceid
        WHERE num_serdoc_servid = :serviceId
          AND var_service_active = 'Y'
          AND num_serdoc_ulbid = :ulbid
    `;

    const result = await executeQuery(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch service documents");
    }

    if (result.rows && result.rows.length > 0) {
        return result.rows;
    }

    const fallbackBinds = { serviceId: Number(serviceId), ulbid: Number(ulbid) };

    const fallbackSql = `
        SELECT
            NULL AS var_doc_engname,
            num_service_serviceid AS num_serdoc_servid,
            CASE
                WHEN var_serv_dispname IS NULL
                    THEN var_service_eng_name
                ELSE var_serv_dispname
            END AS displayname,
            num_service_serviceid
        FROM aorts.aorts_service_def
        INNER JOIN aorts_service_config
            ON num_serv_servid = num_service_serviceid
           AND num_serv_deptid = num_service_deptid
        WHERE num_service_serviceid = :serviceId
          AND var_service_active = 'Y'
          AND num_serv_ulbid = :ulbid
    `;

    const fallbackResult = await executeQuery(fallbackSql, fallbackBinds);

    if (!fallbackResult || !fallbackResult.success) {
        throw new Error(fallbackResult?.error || "Failed to fetch fallback service documents");
    }

    return fallbackResult.rows;
};

const getDownloadDocsRepo = async ({ serviceName, ulbid }) => {
    console.log("Repo: Fetch Download Documents", { serviceName, ulbid });

    const binds = { serviceName: String(serviceName), ulbid: Number(ulbid) };

    const sql = `
        SELECT
            num_downlaoddoc_docid AS DocId,
            var_downlaoddoc_docname AS DocName,
            var_downlaoddoc_servname,
            num_downlaoddoc_ulbid
        FROM aorts_downlaoddoc_mas
        WHERE var_downlaoddoc_servname = :serviceName
          AND num_downlaoddoc_ulbid = :ulbid
    `;

    const result = await executeQuery(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch download documents");
    }

    return result.rows;
};

module.exports = {
    getCorporationDetailsRepo,
    getDepartmentMenuRepo,
    getServicesByDeptIdRepo,
    getDocumentsForServiceRepo,
    getDownloadDocsRepo,
};