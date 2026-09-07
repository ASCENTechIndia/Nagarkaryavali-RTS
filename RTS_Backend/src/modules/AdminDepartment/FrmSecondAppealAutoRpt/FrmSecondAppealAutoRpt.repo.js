const { executeQueryTMC } = require("../../../db/queryExecutor");

async function fetchSecondAppealReport({ fromDate, toDate }) {
  const sql = `
    SELECT 
      var_appeal_applicationno AS appno,
      dat_appeal_updt AS receiptdate,
      dat_appeal_dtacknowegmt AS dtfirstappeal,
      var_appeal_nmeligperson || ' ' || var_appeal_addeligperson AS nameaddress,
      var_appeal_detpubservicereq AS pubservrqu,
      '' AS rejectdate,
      var_apealhring_fine AS fine
    FROM aorts_appeal_mas
    LEFT JOIN aorts_appealhearing_mas 
      ON var_appeal_applicationno = var_apealhring_applino
     AND num_appeal_appealtype = num_apealhring_appealtype  
     AND var_appeal_appealno = var_apealhring_appealno
    WHERE TRUNC(dat_appeal_updt) BETWEEN TO_DATE(:fromDate, 'DD-MON-YYYY') AND TO_DATE(:toDate, 'DD-MON-YYYY')
      AND num_appeal_refappealealtyp = '2'
  `;

  const binds = { fromDate, toDate };

  const result = await executeQueryTMC( sql, binds );
  return result;
}

module.exports = { fetchSecondAppealReport };
