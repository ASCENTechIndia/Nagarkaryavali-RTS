const { executeQueryTMC } = require("../../../db/queryExecutor");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

const getPropertyDetailsRepo = async ({ appNo }) => {
    console.log("Repo: Get Property Details", { appNo });
    const binds = { appNo };

    const sql = `
        SELECT
            a.*,
            b.num_application_amount
        FROM aorts_proptrans_mas a
        INNER JOIN aorts_application_det b
            ON b.var_application_appno = a.var_proptrans_appno
        WHERE a.var_proptrans_appno = :appNo
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch property details");
    }
    return result.rows;
};

const getPropertyAssessmentRepo = async ({ appNo }) => {
    console.log("Repo: Get Property Assessment", { appNo });
    const binds = { appNo };

    const sql = `
        SELECT *
        FROM aorts_propassess_mas
        WHERE var_propassess_appno = :appNo
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch property assessment");
    }
    return result.rows;
};

const getApplicantDetailsRepo = async ({ appNo }) => {
    console.log("Repo: Get Applicant Details", { appNo });
    const binds = { appNo };

    const sql = `
        SELECT
            (var_appl_firstname || ' ' || var_appl_middlename || ' ' || var_appl_lastname) AS applicantname,
            var_appl_address,
            var_appl_mobno,
            var_appl_email
        FROM aorts_applicant_infodet
        WHERE var_appl_appno = :appNo
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch applicant details");
    }
    return result.rows;
};

const getApplicationDetailsRepo = async ({ appNo, serviceId }) => {
    console.log("Repo: Get Application Details", { appNo, serviceId });
    const binds = {appNo, serviceId: Number(serviceId)};

    const sql = `
        SELECT
            var_application_appno AS appno,
            num_application_noofcopy AS noofcopy,
            num_application_amount AS amount,
            var_application_recieptrefno AS recieptrefno,
            num_application_ulbid AS ulbid
        FROM aorts_application_det
        WHERE num_application_serviceid = :serviceId
          AND var_application_appno = :appNo
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch application details");
    }
    return result.rows;
};

const getApplicationSourceRepo = async ({ appNo, serviceId }) => {
    console.log("Repo: Get Application Source", { appNo, serviceId });

    const binds = {appNo, serviceId: Number(serviceId)};

    const sql = `
        SELECT
            var_appl_appsource AS appsource,
            var_appl_mahapay AS mahapay,
            var_appl_appno AS appno
        FROM aorts_applicant_infodet
        WHERE var_appl_appno = :appNo
          AND num_appl_serviceid = :serviceId
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch application source");
    }
    return result.rows;
};

const getUserDetailsRepo = async ({ userUniqueId }) => {
    console.log("Repo: Get User Details", { userUniqueId });

    const binds = {userUniqueId: Number(userUniqueId)};

    const sql = `
        SELECT
            num_user_mobileno AS mobileno,
            var_user_emailid AS emailid,
            var_user_fname AS username
        FROM aorts_user_def
        WHERE num_user_uniqueid = :userUniqueId
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch user details");
    }
    return result.rows;
};

const getMahaUserDetailsRepo = async ({ trackId }) => {
    console.log("Repo: Get MahaOnline User Details", { trackId });

    const binds = {trackId};

    const sql = `
        SELECT
            var_mahaonuser_mobileno AS mobileno,
            var_mahaonuser_fullname AS fullname
        FROM aorts_mahaonuser_def
        WHERE num_mahaonuser_trackid = :trackId
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch MahaOnline user details");
    }
    return result.rows;
};

const paymentSessionRepo = async ({ulbId, corpId, userUniqueId, username, userFullName, trackId, userIdMahaOnline, lastLogin, lastLogout, serviceId, service, marrageregis, step, appNo, paymentReq, amount}) => {
    console.log("Repo: Payment Session", {ulbId, corpId, userUniqueId, trackId, serviceId, appNo, amount});

    const sql = `
        BEGIN
            aorts_paysession_ins(
                :in_ulbID,
                :in_CorpId,
                :in_useruniqueid,
                :in_username,
                :in_userfullname,
                :in_trackid,
                :in_useridmahaonlin,
                :in_lastlogin,
                :in_lastlogout,
                :in_serviceid,
                :in_service,
                :in_marrageregis,
                :in_step,
                :in_appno,
                :in_paymentreq,
                :in_AMOUNT,
                :out_errcode,
                :out_ErrMsg
            );
        END;
    `;

    const binds = {
        in_ulbID: Number(ulbId),
        in_CorpId: Number(corpId),
        in_useruniqueid: Number(userUniqueId),
        in_username: username,
        in_userfullname: userFullName,
        in_trackid: trackId,
        in_useridmahaonlin: userIdMahaOnline,
        in_lastlogin: lastLogin,
        in_lastlogout: lastLogout,
        in_serviceid: Number(serviceId),
        in_service: service,
        in_marrageregis: marrageregis,
        in_step: String(step),
        in_appno: appNo,
        in_paymentreq: paymentReq,
        in_AMOUNT: Number(amount),
        out_errcode: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        out_ErrMsg: {dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000},
    };

    const result = await executeProcedureTMC({sql, binds});

    if (!result.success) {
        throw new Error(result.error);
    }
    return result.outBinds;
};

module.exports = {
    getPropertyDetailsRepo,
    getPropertyAssessmentRepo,
    getApplicantDetailsRepo,
    getApplicationDetailsRepo,
    getApplicationSourceRepo,
    getUserDetailsRepo,
    getMahaUserDetailsRepo,
    paymentSessionRepo,
};