const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

async function insertToursAndTravelsApplication(params) {
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
    appSource,
  } = params;

  console.log("Insert Tours and Travels Application:", {
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
    appSource,
  });

  const sql = `
    BEGIN
      aorts_toursandtravels_ins(
        :in_USERID,
        :in_APPLICANTNAME,
        :in_MOBILENO,
        :in_EMAILID,
        :in_AADHAARNO,
        :in_RESIDENTIALADDRESS,
        :in_PANCARDNO,
        :in_ORGNAME,
        :in_ORGADDRESS,
        :in_BUSINESSTYPE,
        :in_BUSINESSDESCRIPTION,
        :in_PROPERTYNO,
        :in_BUSINESSADDRESS,
        :in_SOURCE,
        :out_errcode,
        :out_ErrMsg,
        :out_toursandtravelsid
      );
    END;
  `;

  const binds = {
    in_USERID: userId,
    in_APPLICANTNAME: applicantName,
    in_MOBILENO: mobileNo,
    in_EMAILID: emailId,
    in_AADHAARNO: aadhaarNo,
    in_RESIDENTIALADDRESS: residentialAddress,
    in_PANCARDNO: panCardNo,
    in_ORGNAME: orgName,
    in_ORGADDRESS: orgAddress,
    in_BUSINESSTYPE: businessType,
    in_BUSINESSDESCRIPTION: businessDescription,
    in_PROPERTYNO: propertyNo,
    in_BUSINESSADDRESS: businessAddress,
    in_SOURCE: appSource,

    out_errcode: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
    out_ErrMsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 500,
    },
    out_toursandtravelsid: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
  };

  const result = await executeProcedureTMC({ sql, binds });

  if (!result.success) {
    throw new Error(result.error);
  }

  console.log("Tours and Travels Application Insert Result:", result);

  return result.outBinds;
}

module.exports = {
  insertToursAndTravelsApplication,
};