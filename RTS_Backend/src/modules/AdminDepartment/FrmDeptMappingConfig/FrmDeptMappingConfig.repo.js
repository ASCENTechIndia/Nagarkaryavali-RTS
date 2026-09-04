const { executeQueryTMC } = require("../../../db/queryExecutor");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

const getDepartmentDropdownRepo = async () => {
    console.log("Repo: Fetch Department Dropdown");

    const sql = `
        SELECT
            num_dept_id AS DEPTID,
            var_dept_engname AS DEPTNAME
        FROM admins.aoms_dept_mas
        ORDER BY var_dept_engname
    `;

    const result = await executeQueryTMC(sql);

    if (!result || !result.success) {
        throw new Error(
            result?.error || "Failed to fetch department dropdown"
        );
    }

    return result.rows;
};


const getUserDepartmentConfigRepo = async ({ userId }) => {
    console.log("Repo: Fetch User Department Configuration", {
        userId,
    });

    const binds = {
        userId: String(userId),
    };

    const sql = `
        SELECT
            num_deptuserconfig_id,
            var_deptuserconfig_userid,
            num_deptuserconfig_deptid AS DEPTID
        FROM aorts_deptuserconfig_mas
        WHERE var_deptuserconfig_userid = :userId
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(
            result?.error ||
            "Failed to fetch user department configuration"
        );
    }

    return result.rows;
};


const saveUserDepartmentConfigRepo = async ({
    loginUserId,
    ulbid,
    userId,
    deptConfigStr,
    ipAddress,
    source,
}) => {
    console.log("Repo: Save User Department Configuration", {
        loginUserId,
        ulbid,
        userId,
        deptConfigStr,
    });

    const sql = `
        BEGIN
            aorts_deptuserconfig_ins(
                :in_userid,
                :in_ulbid,
                :in_user,
                :in_deptconfigstr,
                :in_ipaddress,
                :in_source,
                :out_errorcode,
                :out_errormsg
            );
        END;
    `;

    const binds = {
        in_userid: String(loginUserId),
        in_ulbid: Number(ulbid),
        in_user: String(userId),
        in_deptconfigstr: String(deptConfigStr),
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
            result?.error ||
            "Failed to save user department configuration"
        );
    }

    return result.outBinds;
};


module.exports = {
    getDepartmentDropdownRepo,
    getUserDepartmentConfigRepo,
    saveUserDepartmentConfigRepo,
};