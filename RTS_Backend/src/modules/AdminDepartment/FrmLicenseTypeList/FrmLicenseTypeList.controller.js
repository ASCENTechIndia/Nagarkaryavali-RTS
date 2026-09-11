const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./FrmLicenseTypeList.service");
const { AppError } = require("../../../libs/errors");

// ============================================
// GET LICENSE TYPE LIST
// ============================================

exports.getLicenseTypeList = asyncHandler(async (req, res) => {
  const ulbId = req.query.ulbId || req.body?.ulbId;

  if (!ulbId) {
    throw new AppError("ulbId is required", 400);
  }

  const data = await service.getLicenseTypeListService({ ulbId });

  return ok(res, data, "License type list fetched successfully");
});

// ============================================
// GET LICENSE TYPE BY ID
// ============================================

exports.getLicenseTypeDetails = asyncHandler(async (req, res) => {
  const { licensetypeid } = req.body;

  if (!licensetypeid) {
    throw new AppError("licensetypeid is required", 400);
  }

  const payload = { licensetypeid };

  const data = await service.getLicenseTypeByIdService(payload);

  return ok(res, data, "License type fetched successfully");
});

// ============================================
// SAVE LICENSE TYPE
// ============================================

exports.saveLicenseType = asyncHandler(async (req, res) => {
  const licenseTypeData = req.body;

  const data = await service.saveLicenseTypeService(licenseTypeData);

  return ok(res, data, data.message);
});