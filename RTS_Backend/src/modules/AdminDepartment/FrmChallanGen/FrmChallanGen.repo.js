const { executeQueryTMC } = require("../../../db/queryExecutor");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

const getWardDropdownRepo = async ({ ulbid }) => {
    console.log("Repo: Fetch Ward Dropdown", { ulbid });
    const binds = { ulbid };

    const sql = `
        SELECT DISTINCT
            zonename AS WARDNAME,
            zoneid AS WARDID
        FROM prop.vw_zonemas
        WHERE ulbid = :ulbid
        ORDER BY zonename
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch ward dropdown");
    }
    return result.rows;
};

const getDepartmentDropdownRepo = async () => {
    console.log("Repo: Fetch Department Dropdown");

    const sql = `
        SELECT
            var_dept_engname AS DEPTNAME,
            num_dept_id AS DEPTID
        FROM admins.aoms_dept_mas
        WHERE num_dept_id IN (1, 7, 23, 25, 10, 24, 841, 26, 1041, 503, 1042, 725, 689, 683, 3)
        ORDER BY var_dept_engname
    `;

    const result = await executeQueryTMC(sql);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch department dropdown");
    }
    return result.rows;
};

const generateChallanRepo = async ({userName, challanDate, receiptFromDate, receiptToDate, wardId, payMode, deptId, ulbid}) =>{
    console.log("Repo: Generate Challan", {userName, challanDate, receiptFromDate, receiptToDate, wardId, payMode, deptId, ulbid});

    const sql = `
        BEGIN
            aorts_genrct_chalannumber_gen(
                :in_username,
                :in_chalandt,
                :in_Receiptfromdt,
                :in_Receipttodt,
                :in_prabhagid,
                :in_paymode,
                :in_deptid,
                :in_orgid,
                :OUT_ERRCODE,
                :OUT_ERRMESSAGE
            );
        END;
    `;

    const binds = {
        in_username: userName,
        in_chalandt: challanDate,
        in_Receiptfromdt: receiptFromDate,
        in_Receipttodt: receiptToDate,
        in_prabhagid: Number(wardId),
        in_paymode: Number(payMode),
        in_deptid: Number(deptId),
        in_orgid: Number(ulbid),
        OUT_ERRCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        OUT_ERRMESSAGE: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
    };

    const result = await executeProcedureTMC({ sql, binds });

    if (!result || !result.success) {
        throw new Error( result?.error || "Failed to generate challan" );
    }
    return result.outBinds;
};

module.exports = {
    getWardDropdownRepo,
    getDepartmentDropdownRepo,
    generateChallanRepo,
};