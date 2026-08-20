const getConnection = require("../../../config/db");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const { executeQueryTMC } = require("../../../db/queryExecutor");
const oracledb = require("oracledb");

async function getTransferTypes() {
  const query = `
    SELECT 
      var_transfertype_name, 
      num_transfertype_id 
    FROM prop.aoms_transfertype_mas
  `;

  console.log("Transfer Types Query:", query);

  return await executeQueryTMC(query, {});
}

async function insertPropertyTransferApplication(params) {
  const {
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder,
    structOwner,
    oldOwnName,
    newOwnName,
    occupName,
    legalStat,
    address,
    propType,
    areaofProp,
    transType,
    consttype,
    appliEmail,
    appliAddr,
    appliMobile,
    appliAadhar,
    appSource,
  } = params;

  console.log("Insert Property Transfer Application:", {
    userId,
    zoneId,
    serviceId,
    propNo,
    transType,
    appSource,
  });

  const sql = `
    BEGIN
      aorts_proptrans_ins(
        :in_UserId,
        :in_Zoneid,
        :in_Serviceid,
        :in_PropNo,
        :in_Subcode,
        :in_LandHolder,
        :in_StructOwner,
        :in_OldOwnName,
        :in_NewOwnName,
        :in_OccupName,
        :in_LegalStat,
        :in_Address,
        :in_PropType,
        :in_AreaofProp,
        :in_TransType,
        :in_Consttype,
        :in_AppliEmail,
        :in_AppliAddr,
        :in_AppliMobile,
        :in_AppliAadhar,
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
    in_StructOwner: structOwner || null,
    in_OldOwnName: oldOwnName || null,
    in_NewOwnName: newOwnName || null,
    in_OccupName: occupName || null,
    in_LegalStat: legalStat || null,
    in_Address: address || null,
    in_PropType: propType || null,
    in_AreaofProp: areaofProp || null,
    in_TransType: transType,
    in_Consttype: consttype || null,
    in_AppliEmail: appliEmail || null,
    in_AppliAddr: appliAddr || null,
    in_AppliMobile: appliMobile,
    in_AppliAadhar: appliAadhar || 0,
    in_source: appSource || "",

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

  const result = await executeProcedureTMC({ sql, binds });

  if (!result.success) {
    throw new Error(result.error);
  }

  console.log("Property Transfer Application Insert Result:", result.outBinds);

  return result.outBinds;
}

async function getPropertyTransferApplication(appNo) {
  const query = `
    SELECT 
      var_proptrans_appno,
      var_proptrans_areaofprop,
      var_proptrans_legalstatus,
      var_proptrans_proptype,
      var_proptrans_consttype
    FROM aorts_proptrans_mas 
    WHERE var_proptrans_appno = :appNo
  `;

  const bindParams = {
    appNo: String(appNo),
  };

  console.log("Property Transfer Application Query:", query);
  console.log("Bind Params:", bindParams);

  return await executeQueryTMC(query, bindParams);
}

async function getTransferRateConfig(params) {
  const { serviceId, slum, fromArea, toArea } = params;

  const query = `
    SELECT 
      num_transferrate_resleg AS resleg,
      num_transferrate_nonresleg AS nonresleg,
      num_transferrate_resilleg AS resilleg,
      num_transferrate_nonresilleg AS nonresilleg 
    FROM aorts_transferrate_config  
    WHERE num_transferrate_servid = :serviceId 
      AND var_transferrate_slum = :slum
      AND num_transferrate_frmarea = :fromArea 
      AND num_transferrate_toarea = :toArea
  `;

  const bindParams = {
    serviceId: Number(serviceId),
    slum: String(slum),
    fromArea: Number(fromArea),
    toArea: Number(toArea),
  };

  console.log("Transfer Rate Config Query:", query);
  console.log("Bind Params:", bindParams);

  return await executeQueryTMC(query, bindParams);
}

module.exports = {
  getTransferTypes,
  insertPropertyTransferApplication,
  getPropertyTransferApplication,
  getTransferRateConfig,
};