const { executeQueryTMC } = require("../../../db/queryExecutor");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

/**
 * Get User Dropdown
 */
const getUserDropdownRepo = async () => {
    console.log("Repo: Fetch User Dropdown");

    const sql = `
        SELECT
            var_user_username AS USERNAME,
            num_user_userid AS USERID
        FROM admins.aoma_user_def
        ORDER BY var_user_username
    `;

    const result = await executeQueryTMC(sql);

    if (!result || !result.success) {
        throw new Error(
            result?.error || "Failed to fetch user dropdown"
        );
    }

    return result.rows;
};


/**
 * Get Ward / Zone Dropdown
 */
const getWardDropdownRepo = async ({ ulbid }) => {
    console.log("Repo: Fetch Ward Dropdown", { ulbid });

    const binds = { ulbid };

    const sql = `
        SELECT DISTINCT
            zonename AS WARDNAME,
            zoneid AS WARDID
        FROM prop.vw_zonemas
        WHERE ulbid = :ulbid
        ORDER BY wardid
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(
            result?.error || "Failed to fetch ward dropdown"
        );
    }

    return result.rows;
};


/**
 * Get Configured Wards for Selected User
 */
const getUserWardConfigRepo = async ({ userId }) => {
    console.log("Repo: Fetch User Ward Configuration", { userId });

    const binds = { userId };

    const sql = `
        SELECT
            num_prabhguser_id AS ID,
            var_prabhguser_userid AS USERID,
            num_prabhguser_prabhagid AS WARDID
        FROM aorts_prabhguser_config
        WHERE var_prabhguser_userid = :userId
        ORDER BY num_prabhguser_prabhagid
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(
            result?.error || "Failed to fetch user ward configuration"
        );
    }

    return result.rows;
};


/**
 * Save User Ward Configuration
 */
const saveUserWardConfigRepo = async ({
    loginUserId,
    ulbid,
    userId,
    blockConfigStr,
    ipAddress,
    source,
}) => {
    console.log("Repo: Save User Ward Configuration", {
        loginUserId,
        ulbid,
        userId,
        blockConfigStr,
    });

    const sql = `
        BEGIN
            aorts_prabhguserconfig_ins(
                :in_userid,
                :in_ulbid,
                :in_user,
                :in_blockconfigstr,
                :in_ipaddress,
                :in_source,
                :out_errorcode,
                :out_errormsg
            );
        END;
    `;

    const binds = {
        in_userid: loginUserId,
        in_ulbid: Number(ulbid),
        in_user: userId,
        in_blockconfigstr: blockConfigStr,
        in_ipaddress: ipAddress || null,
        in_source: source || null,

        out_errorcode: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER,
        },

        out_errormsg: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 4000,
        },
    };

    const result = await executeProcedureTMC({
        sql,
        binds,
    });

    if (!result || !result.success) {
        throw new Error(
            result?.error || "Failed to save user ward configuration"
        );
    }

    return result.outBinds;
};


module.exports = {
    getUserDropdownRepo,
    getWardDropdownRepo,
    getUserWardConfigRepo,
    saveUserWardConfigRepo,
};