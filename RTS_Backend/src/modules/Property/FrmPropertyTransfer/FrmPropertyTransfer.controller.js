const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmPropertyTransfer.service");

exports.getTransferTypes = asyncHandler(async (req, res) => {
  const result = await service.getTransferTypesService();

  return ok(res, result, "Transfer types fetched successfully");
});

exports.submitApplication = asyncHandler(async (req, res) => {
  const {
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
  } = req.body;

  const userId = req.user?.userId || req.body.userId;
  const zoneId = req.user?.zoneId || req.body.zoneId;
  const serviceId = req.body.serviceId;

  if (!userId) {
    return fail(res, "User ID is required");
  }

  if (!zoneId) {
    return fail(res, "Zone ID is required");
  }

  if (!serviceId) {
    return fail(res, "Service ID is required");
  }

  if (!propNo) {
    return fail(res, "Property Number is required");
  }

  if (!newOwnName) {
    return fail(res, "New Owner Name is required");
  }

  if (!appliEmail) {
    return fail(res, "Email is required");
  }

  const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(appliEmail)) {
    return fail(res, "Invalid Email Address");
  }

  if (!appliAddr) {
    return fail(res, "Address is required");
  }

  if (!appliMobile) {
    return fail(res, "Mobile Number is required");
  }

  if (String(appliMobile).length !== 10) {
    return fail(res, "Mobile Number must be 10 digits");
  }

  if (appliAadhar && String(appliAadhar).length !== 12) {
    return fail(res, "Aadhar Number must be 12 digits");
  }

  const result = await service.submitPropertyTransferApplicationService({
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
  });

  if (!result.success) {
    return fail(res, result.message || "Application submission failed");
  }

  return ok(res, result, result.message || "Application submitted successfully");
});

exports.getPropertyTransferApplication = asyncHandler(async (req, res) => {
  const { appNo } = req.body;

  if (!appNo) {
    return fail(res, "Application Number is required");
  }

  const result = await service.getPropertyTransferApplicationService(appNo);

  if (!result.success) {
    return fail(res, result.message || "Application not found");
  }

  return ok(res, result, "Application details fetched successfully");
});

exports.getTransferRateConfig = asyncHandler(async (req, res) => {
  const { serviceId, slum, area } = req.body;

  if (!serviceId) {
    return fail(res, "Service ID is required");
  }

  if (area === undefined || area === null) {
    return fail(res, "Area is required");
  }

  const result = await service.getTransferRateConfigService({
    serviceId,
    slum,
    area,
  });

  if (!result.success) {
    return fail(res, result.message || "Rate configuration not found");
  }

  return ok(res, result, "Transfer rate configuration fetched successfully");
});
