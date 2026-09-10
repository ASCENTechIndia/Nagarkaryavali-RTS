const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

async function insertMeatShopNOCApplication(params) {
  const {
    userId,
    applicantName,
    mobileNo,
    emailId,
    aadhaarNo,
    residentialAddress,
    panCardNo,
    orgName,
    orgAddress,
    businessType,
    businessDescription,
    propertyNo,
    businessAddress,
    waterConnectionNo,
    constructionPermissionNo,
    occupancyCertificateNo,
    appSource,
  } = params;

  console.log("Insert Meat Shop NOC Application:", {
    userId,
    applicantName,
    mobileNo,
    emailId,
    aadhaarNo,
    residentialAddress,
    panCardNo,
    orgName,
    orgAddress,
    businessType,
    businessDescription,
    propertyNo,
    businessAddress,
    waterConnectionNo,
    constructionPermissionNo,
    occupancyCertificateNo,
    appSource,
  });

  const sql = `
    BEGIN
      AORTS_MEATSHOP_INS(
        :IN_USERID,
        :IN_APPLICANTNAME,
        :IN_MOBILENO,
        :IN_EMAILID,
        :IN_AADHAARNO,
        :IN_RESIDENTIALADDRESS,
        :IN_PANCARDNO,
        :IN_ORGNAME,
        :IN_ORGADDRESS,
        :IN_BUSINESSTYPE,
        :IN_BUSINESSDESCRIPTION,
        :IN_PROPERTYNO,
        :IN_BUSINESSADDRESS,
        :IN_WATERCONNECTIONNO,
        :IN_CONSTRUCTIONPERMISSIONNO,
        :IN_OCCUPANCYCERTIFICATENO,
        :IN_SOURCE,
        :OUT_ERRCODE,
        :OUT_ERRMSG,
        :OUT_MEATSHOP_ID
      );
    END;
  `;

  const binds = {
    IN_USERID:                   userId,
    IN_APPLICANTNAME:            applicantName,
    IN_MOBILENO:                 mobileNo,
    IN_EMAILID:                  emailId,
    IN_AADHAARNO:                aadhaarNo,
    IN_RESIDENTIALADDRESS:       residentialAddress,
    IN_PANCARDNO:                panCardNo || null,
    IN_ORGNAME:                  orgName || null,
    IN_ORGADDRESS:               orgAddress || null,
    IN_BUSINESSTYPE:             businessType != null && businessType !== ""
                                   ? Number(businessType)
                                   : null,
    IN_BUSINESSDESCRIPTION:      businessDescription || null,
    IN_PROPERTYNO:               propertyNo,
    IN_BUSINESSADDRESS:          businessAddress,
    IN_WATERCONNECTIONNO:        waterConnectionNo || null,
    IN_CONSTRUCTIONPERMISSIONNO: constructionPermissionNo || null,
    IN_OCCUPANCYCERTIFICATENO:   occupancyCertificateNo || null,
    IN_SOURCE:                   appSource || "WEB",

    OUT_ERRCODE: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
    OUT_ERRMSG: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 4000,
    },
    OUT_MEATSHOP_ID: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
  };

  const result = await executeProcedureTMC({ sql, binds });

  if (!result.success) {
    throw new Error(result.error);
  }

  console.log("Meat Shop NOC Application Insert Result:", result);

  return result.outBinds;
}

module.exports = {
  insertMeatShopNOCApplication,
};