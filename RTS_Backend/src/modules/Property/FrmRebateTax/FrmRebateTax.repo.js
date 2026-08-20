const { executeProcedure } = require("../../../db/procedureExecutor");
const { executeQuery } = require("../../../db/queryExecutor");
const oracledb = require("oracledb");

async function getRebateTypes() {
  const query = `
    SELECT 
      var_rebatetype_name AS VAR_REBATETYPE_NAME, 
      num_rebatetype_id AS NUM_REBATETYPE_ID 
    FROM aorts_rebatetype_mas
  `;
  return await executeQuery(query, {});
}

async function getTaxNames() {
  const query = `
    SELECT 
      num_taxname_id AS ID,
      var_taxname_name AS NAME 
    FROM aorts_taxname_def
  `;
  return await executeQuery(query, {});
}

async function insertTaxExemptionApplication(params) {
  const {
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder,
    structHolder,
    ownName,
    address,
    appliname,
    mobile,
    email,
    aadhar,
    pincode,
    exempType,
    remark,
    taxStr,
    appSource,
  } = params;

  console.log("Insert Rebate Tax Application:", {
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder,
    structHolder,
    ownName,
    address,
    appliname,
    mobile,
    email,
    aadhar,
    pincode,
    exempType,
    remark,
    taxStr,
    appSource,
  });

  const sql = `
    BEGIN
      aorts_TaxExemption_ins(
        :in_UserId,
        :in_Zoneid,
        :in_Serviceid,
        :in_PropNo,
        :in_Subcode,
        :in_LandHolder,
        :in_StructHolder,
        :in_OwnName,
        :in_Addr,
        :in_Appliname,
        :in_mobile,
        :in_email,
        :in_aadhar,
        :in_pincode,
        :in_ExempType,
        :in_Remark,
        :in_taxstr,
        :in_source,
        :out_errcode,
        :out_ErrMsg,
        :out_applino
      );
    END;
  `;

  const binds = {
    in_UserId: userId || null,
    in_Zoneid: zoneId,
    in_Serviceid: serviceId,
    in_PropNo: propNo,
    in_Subcode: subCode || null,
    in_LandHolder: landHolder || null,
    in_StructHolder: structHolder || null,
    in_OwnName: ownName || null,
    in_Addr: address || null,
    in_Appliname: appliname || null,
    in_mobile: mobile,
    in_email: email || null,
    in_aadhar: aadhar || 0,
    in_pincode: pincode,
    in_ExempType: exempType || 0,
    in_Remark: remark || null,
    in_taxstr: taxStr || null,
    in_source: appSource || "WEB",

    out_errcode: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
    out_ErrMsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 500,
    },
    out_applino: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 500,
    },
  };

  const result = await executeProcedure({ sql, binds });
  if (!result.success) {
    throw new Error(result.error);
  }
  console.log("Rebate Tax Application Insert Result:", result.outBinds);

  return result.outBinds;
}

module.exports = {
  getRebateTypes,
  getTaxNames,
  insertTaxExemptionApplication,
};