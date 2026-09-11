const repo = require("./FrmLicenseTypeList.repo");
const { AppError } = require("../../../libs/errors");

const PROC_SUCCESS_CODE = 9999;

// ============================================
// GET LICENSE TYPE LIST
// ============================================

async function getLicenseTypeListService(payload) {
  console.log(" Service: Fetch License Type List", payload);

  if (!payload.ulbId) {
    throw new AppError("ulbId is required", 400);
  }

  const data = await repo.getLicenseTypeListRepo({
    ulbid: payload.ulbId,
  });

  return {
    success: true,
    count: data.length,
    data,
  };
}

// ============================================
// GET LICENSE TYPE BY ID
// ============================================

async function getLicenseTypeByIdService(payload) {
  console.log("Service: Fetch License Type By ID", payload);

  const data = await repo.getLicenseTypeByIdRepo(payload);

  return {
    success: true,
    count: data.length,
    data,
  };
}

// ============================================
// SAVE LICENSE TYPE
// ============================================

async function saveLicenseTypeService(licenseTypeData) {
  const mode = licenseTypeData.mode || 1;

  if (mode !== 3 && !licenseTypeData.licenseTypeName) {
    throw new AppError("License Type Name is required", 400);
  }

  if (mode !== 1 && !licenseTypeData.licenseTypeId) {
    throw new AppError("License Type Id is required", 400);
  }

  if (!licenseTypeData.userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!licenseTypeData.ulbId) {
    throw new AppError("ULB ID is required", 400);
  }

  const result = await repo.insertLicenseTypeRepo({
    userId: licenseTypeData.userId,
    licenseTypeId: licenseTypeData.licenseTypeId || null,
    licenseTypeName: licenseTypeData.licenseTypeName || null,
    ulbId: licenseTypeData.ulbId,
    mode: mode,
    ipAddress: licenseTypeData.ipAddress || null,
    ipSource: licenseTypeData.ipSource || null,
  });

  console.log("Service insertLicenseTypeRepo Result:", result);

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  if (result.errorCode !== PROC_SUCCESS_CODE) {
    throw new AppError(result.errorMsg || "Failed to save license type", 500);
  }

  return {
    success: true,
    errorCode: result.errorCode,
    errorMsg: result.errorMsg,
    message: result.errorMsg,
  };
}

module.exports = {
  getLicenseTypeListService,
  getLicenseTypeByIdService,
  saveLicenseTypeService,
};