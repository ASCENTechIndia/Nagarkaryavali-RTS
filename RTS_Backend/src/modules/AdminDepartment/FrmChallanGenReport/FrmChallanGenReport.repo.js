const { executeQueryTMC } = require("../../../db/queryExecutor");

async function getPrabhagList(ulbId) {
  const query = `
    SELECT DISTINCT zonename AS wardname, zoneid AS wardid 
    FROM prop.vw_zonemas 
    WHERE ulbid = :ulbId 
    ORDER BY zonename
  `;

  const bindParams = {
    ulbId: Number(ulbId),
  };

  console.log("Get Prabhag List Query:", query);
  console.log("Bind Params:", bindParams);

  return await executeQueryTMC(query, bindParams);
}

async function getDepartmentList() {
  const query = `
    SELECT var_dept_engname AS deptname, num_dept_id AS deptid 
    FROM admins.aoms_dept_mas 
    WHERE num_dept_id IN (1, 7, 23, 25, 10, 24, 841, 26, 1041, 503, 1042, 725, 689, 683, 3) 
    ORDER BY var_dept_engname
  `;

  console.log("Get Department List Query:", query);

  return await executeQueryTMC(query, {});
}

async function getChallanReportData(params) {
  const { ulbId, fromDate, toDate, prabhagId, deptId } = params;

  let query = `
    SELECT 
      RECEIPTNO, 
      RECEIVEAMT, 
      RECEIPTDATE, 
      PRABHAGID, 
      PRABHAG, 
      SERVICENAME, 
      ULBID,
      var_chalan_number, 
      var_chalan_paymode
    FROM view_genrctchallan 
    INNER JOIN aorts_genrctchalan_mas 
      ON ulbid = num_chalan_ulbid 
      AND num_chalan_deptid = deptid
    WHERE TRUNC(receiptdate) >= TO_DATE(:fromDate, 'DD-MON-YYYY')
      AND TRUNC(receiptdate) <= TO_DATE(:toDate, 'DD-MON-YYYY')
      AND ulbid = :ulbId
  `;

  const bindParams = {
    fromDate: fromDate,
    toDate: toDate,
    ulbId: Number(ulbId),
  };

  if (prabhagId && prabhagId !== "-1" && prabhagId !== "0") {
    query += ` AND num_chalan_collcenterid = :prabhagId`;
    bindParams.prabhagId = Number(prabhagId);
  }

  if (deptId && deptId !== "-1" && deptId !== "0") {
    query += ` AND deptid = :deptId`;
    bindParams.deptId = Number(deptId);
  }

  console.log("Get Challan Report Query:", query);
  console.log("Bind Params:", bindParams);

  return await executeQueryTMC(query, bindParams);
}

module.exports = {
  getPrabhagList,
  getDepartmentList,
  getChallanReportData,
};
