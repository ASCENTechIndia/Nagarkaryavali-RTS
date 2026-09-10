const { executeQueryTMC } = require("../../../db/queryExecutor");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

/**
 * Fetch hospital records from AORTS_HOSPITAL_MAS
 * @param {Object} filters
 * @returns {Promise<{success: boolean, rows?: Array, error?: string}>}
 */
const getAllHospitalsRepo = async (filters = {}) => {
  try {
    let query = `
      SELECT 
        num_hospital_id AS HOSPITAL_ID,
        var_hospital_applicantname AS APPLICANT_NAME,
        var_hospital_mobileno AS MOBILE_NO,
        var_hospital_emailid AS EMAIL_ID,
        var_hospital_aadhaarno AS AADHAAR_NO,
        var_hospital_residentialaddress AS RESIDENTIAL_ADDRESS,
        var_hospital_pancardno AS PANCARD_NO,
        var_hospital_orgname AS ORG_NAME,
        var_hospital_orgaddress AS ORG_ADDRESS,
        num_hospital_businesstype AS BUSINESS_TYPE,
        var_hospital_businessdescription AS BUSINESS_DESCRIPTION,
        var_hospital_propertyno AS PROPERTY_NO,
        var_hospital_businessaddress AS BUSINESS_ADDRESS,
        var_hospital_waterconnectionno AS WATER_CONNECTION_NO,
        var_hospital_constructionpermissionno AS CONSTRUCTION_PERMISSION_NO,
        var_hospital_occupancycertificateno AS OCCUPANCY_CERTIFICATE_NO,
        var_hospital_hospitalname AS HOSPITAL_NAME,
        var_hospital_insertby AS INSERT_BY,
        TO_CHAR(date_hospital_insertdate, 'YYYY-MM-DD HH24:MI:SS') AS INSERT_DATE,
        var_hospital_updateby AS UPDATE_BY,
        TO_CHAR(date_hospital_updatedate, 'YYYY-MM-DD HH24:MI:SS') AS UPDATE_DATE
      FROM aorts_hospital_mas
      WHERE 1=1
    `;

    const binds = {};

    if (filters.hospitalId) {
      query += ` AND num_hospital_id = :hospitalId`;
      binds.hospitalId = Number(filters.hospitalId);
    }

    if (filters.mobileNo) {
      query += ` AND var_hospital_mobileno = :mobileNo`;
      binds.mobileNo = String(filters.mobileNo).trim();
    }

    if (filters.propertyNo) {
      query += ` AND UPPER(var_hospital_propertyno) = UPPER(:propertyNo)`;
      binds.propertyNo = String(filters.propertyNo).trim();
    }

    if (filters.search) {
      query += ` AND (
        UPPER(var_hospital_hospitalname) LIKE '%' || UPPER(:search) || '%'
        OR UPPER(var_hospital_applicantname) LIKE '%' || UPPER(:search) || '%'
        OR UPPER(var_hospital_propertyno) LIKE '%' || UPPER(:search) || '%'
        OR var_hospital_mobileno LIKE '%' || :search || '%'
      )`;
      binds.search = String(filters.search).trim();
    }

    query += ` ORDER BY num_hospital_id DESC`;

    const result = await executeQueryTMC(query, binds);

    return {
      success: true,
      rows: result.rows || [],
    };
  } catch (error) {
    console.error("GET ALL HOSPITALS REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch a single hospital record by ID
 * @param {number|string} hospitalId
 * @returns {Promise<{success: boolean, row?: Object, error?: string}>}
 */
const getHospitalByIdRepo = async (hospitalId) => {
  try {
    const query = `
      SELECT 
        num_hospital_id AS HOSPITAL_ID,
        var_hospital_applicantname AS APPLICANT_NAME,
        var_hospital_mobileno AS MOBILE_NO,
        var_hospital_emailid AS EMAIL_ID,
        var_hospital_aadhaarno AS AADHAAR_NO,
        var_hospital_residentialaddress AS RESIDENTIAL_ADDRESS,
        var_hospital_pancardno AS PANCARD_NO,
        var_hospital_orgname AS ORG_NAME,
        var_hospital_orgaddress AS ORG_ADDRESS,
        num_hospital_businesstype AS BUSINESS_TYPE,
        var_hospital_businessdescription AS BUSINESS_DESCRIPTION,
        var_hospital_propertyno AS PROPERTY_NO,
        var_hospital_businessaddress AS BUSINESS_ADDRESS,
        var_hospital_waterconnectionno AS WATER_CONNECTION_NO,
        var_hospital_constructionpermissionno AS CONSTRUCTION_PERMISSION_NO,
        var_hospital_occupancycertificateno AS OCCUPANCY_CERTIFICATE_NO,
        var_hospital_hospitalname AS HOSPITAL_NAME,
        var_hospital_insertby AS INSERT_BY,
        TO_CHAR(date_hospital_insertdate, 'YYYY-MM-DD HH24:MI:SS') AS INSERT_DATE,
        var_hospital_updateby AS UPDATE_BY,
        TO_CHAR(date_hospital_updatedate, 'YYYY-MM-DD HH24:MI:SS') AS UPDATE_DATE
      FROM aorts_hospital_mas
      WHERE num_hospital_id = :hospitalId
    `;

    const result = await executeQueryTMC(query, {
      hospitalId: Number(hospitalId),
    });

    return {
      success: true,
      row: (result.rows && result.rows[0]) || null,
    };
  } catch (error) {
    console.error("GET HOSPITAL BY ID REPO ERROR:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Call stored procedure AORTS_HOSPITAL_INS to insert hospital details
 * @param {Object} params
 * @returns {Promise<Object>} outBinds
 */
const insertHospitalRepo = async (params) => {
  const sql = `
    BEGIN
      AORTS_HOSPITAL_INS(
        :in_userid,
        :in_applicantname,
        :in_mobileno,
        :in_emailid,
        :in_aadhaarno,
        :in_residentialaddress,
        :in_pancardno,
        :in_orgname,
        :in_orgaddress,
        :in_businesstype,
        :in_businessdescription,
        :in_propertyno,
        :in_businessaddress,
        :in_waterconnectionno,
        :in_constructionpermissionno,
        :in_occupancycertificateno,
        :in_hospitalname,
        :in_source,
        :out_errcode,
        :out_errmsg,
        :out_hospital_id
      );
    END;
  `;

  const binds = {
    in_userid: String(params.userId || "1"),
    in_applicantname: String(params.applicantName || "").trim(),
    in_mobileno: String(params.mobileNo || "").trim(),
    in_emailid: String(params.emailId || "").trim(),
    in_aadhaarno: String(params.aadhaarNo || "").trim(),
    in_residentialaddress: String(params.residentialAddress || "").trim(),
    in_pancardno: String(params.panCardNo || "").trim(),
    in_orgname: String(params.orgName || "").trim(),
    in_orgaddress: String(params.orgAddress || "").trim(),
    in_businesstype: Number(params.businessType) || 1,
    in_businessdescription: String(params.businessDescription || "").trim(),
    in_propertyno: String(params.propertyNo || "").trim(),
    in_businessaddress: String(params.businessAddress || "").trim(),
    in_waterconnectionno: String(params.waterConnectionNo || "").trim(),
    in_constructionpermissionno: String(params.constructionPermissionNo || "").trim(),
    in_occupancycertificateno: String(params.occupancyCertificateNo || "").trim(),
    in_hospitalname: String(params.hospitalName || "").trim(),
    in_source: String(params.source || "WEB").trim(),
    out_errcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_errmsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
    out_hospital_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  };

  const result = await executeProcedureTMC({ sql, binds });

  if (!result.success) {
    throw new Error(result.error || "Execution of AORTS_HOSPITAL_INS procedure failed.");
  }

  return result.outBinds;
};

module.exports = {
  getAllHospitalsRepo,
  getHospitalByIdRepo,
  insertHospitalRepo,
};
