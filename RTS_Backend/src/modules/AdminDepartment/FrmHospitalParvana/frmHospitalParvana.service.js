const repo = require("./frmHospitalParvana.repo");
const { AppError } = require("../../../libs/errors");

/**
 * Format a raw database row into clean camelCase
 */
const formatHospitalRow = (r) => {
  if (!r) return null;
  return {
    hospitalId: r.HOSPITAL_ID,
    applicantName: r.APPLICANT_NAME,
    mobileNo: r.MOBILE_NO,
    emailId: r.EMAIL_ID,
    aadhaarNo: r.AADHAAR_NO,
    residentialAddress: r.RESIDENTIAL_ADDRESS,
    panCardNo: r.PANCARD_NO,
    orgName: r.ORG_NAME,
    orgAddress: r.ORG_ADDRESS,
    businessType: r.BUSINESS_TYPE,
    businessDescription: r.BUSINESS_DESCRIPTION,
    propertyNo: r.PROPERTY_NO,
    businessAddress: r.BUSINESS_ADDRESS,
    waterConnectionNo: r.WATER_CONNECTION_NO,
    constructionPermissionNo: r.CONSTRUCTION_PERMISSION_NO,
    occupancyCertificateNo: r.OCCUPANCY_CERTIFICATE_NO,
    hospitalName: r.HOSPITAL_NAME,
    insertBy: r.INSERT_BY,
    insertDate: r.INSERT_DATE,
    updateBy: r.UPDATE_BY,
    updateDate: r.UPDATE_DATE,
  };
};

/**
 * Service to fetch all hospital records
 */
const getHospitalListService = async (filters = {}) => {
  const result = await repo.getAllHospitalsRepo(filters);

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch hospital records.", 500);
  }

  const rows = (result.rows || []).map(formatHospitalRow);

  return {
    success: true,
    rowCount: rows.length,
    rows,
  };
};

/**
 * Service to fetch a single hospital record by ID
 */
const getHospitalByIdService = async (hospitalId) => {
  if (!hospitalId) {
    throw new AppError("hospitalId is required.", 400);
  }

  const result = await repo.getHospitalByIdRepo(hospitalId);

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch hospital details.", 500);
  }

  if (!result.row) {
    throw new AppError(`Hospital with ID ${hospitalId} not found.`, 404);
  }

  return {
    success: true,
    data: formatHospitalRow(result.row),
  };
};

/**
 * Service to save hospital details via AORTS_HOSPITAL_INS procedure
 */
const saveHospitalService = async (payload, loggedInUser = null) => {
  const applicantName =
    (payload.applicantName && String(payload.applicantName).trim()) ||
    [payload.firstName, payload.middleName, payload.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    (payload.applicationName && String(payload.applicationName).trim()) ||
    "";

  const mobileNo = String(payload.mobileNo || payload.mobile || "").trim();
  const emailId = String(payload.emailId || payload.email || "").trim();
  const propertyNo = String(payload.propertyNo || "").trim();
  const businessAddress = String(payload.businessAddress || "").trim();
  const hospitalName = String(payload.hospitalName || "").trim();

  // Basic validation aligned with procedure's checks
  if (!applicantName) {
    throw new AppError("Applicant Name can not be blank", 400);
  }
  if (!mobileNo) {
    throw new AppError("Mobile Number can not be blank", 400);
  }
  if (!emailId) {
    throw new AppError("Email Id can not be blank", 400);
  }
  if (!propertyNo) {
    throw new AppError("Property Number can not be blank", 400);
  }
  if (!businessAddress) {
    throw new AppError("Business Address can not be blank", 400);
  }
  if (!hospitalName) {
    throw new AppError("Hospital Name can not be blank", 400);
  }

  const userId =
    String(payload.userId || loggedInUser?.id || loggedInUser?.userId || "1").trim() || "1";

  const businessType =
    payload.businessType !== undefined &&
    payload.businessType !== null &&
    payload.businessType !== ""
      ? Number(payload.businessType)
      : 1;

  const normalizedParams = {
    userId,
    applicantName,
    mobileNo,
    emailId,
    aadhaarNo: String(payload.aadhaarNo || payload.aadharNo || "").trim(),
    residentialAddress: String(payload.residentialAddress || payload.address || "").trim(),
    panCardNo: String(payload.panCardNo || payload.panCard || "").trim(),
    orgName: String(payload.orgName || payload.organizationName || "").trim(),
    orgAddress: String(payload.orgAddress || payload.organizationAddress || "").trim(),
    businessType,
    businessDescription: String(payload.businessDescription || "").trim(),
    propertyNo,
    businessAddress,
    waterConnectionNo: String(payload.waterConnectionNo || "").trim(),
    constructionPermissionNo: String(
      payload.constructionPermissionNo || payload.constructionPermissionProposalNo || ""
    ).trim(),
    occupancyCertificateNo: String(payload.occupancyCertificateNo || "").trim(),
    hospitalName,
    source: String(payload.source || "WEB").trim(),
  };

  const outBinds = await repo.insertHospitalRepo(normalizedParams);

  const errCode = outBinds.out_errcode ?? outBinds.OUT_ERRCODE;
  const errMsg = outBinds.out_errmsg ?? outBinds.OUT_ERRMSG;
  const hospitalId = outBinds.out_hospital_id ?? outBinds.OUT_HOSPITAL_ID;

  // OUT_ERRCODE = 9999 indicates successful execution in AORTS_HOSPITAL_INS
  const isSuccess = Number(errCode) === 9999;

  if (!isSuccess) {
    throw new AppError(errMsg || "Failed to insert hospital details.", 400);
  }

  return {
    success: true,
    errorCode: errCode,
    message: errMsg || "Hospital details successfully inserted.",
    hospitalId: hospitalId,
    applicationNo: `HOSP-${hospitalId}`,
  };
};

module.exports = {
  getHospitalListService,
  getHospitalByIdService,
  saveHospitalService,
};
