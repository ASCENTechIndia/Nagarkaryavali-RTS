const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmRebateTax.service");

exports.getRebateTypes = asyncHandler(async (req, res) => {
  const result = await service.getRebateTypesService();
  return ok(res, result, "Rebate types fetched successfully");
});

exports.getTaxNames = asyncHandler(async (req, res) => {
  const result = await service.getTaxNamesService();
  return ok(res, result, "Tax names fetched successfully");
});

exports.submitApplication = asyncHandler(async (req, res) => {
  const {
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
  } = req.body;

  const userId = req.user?.userId || req.body.userId;
  const zoneId = req.user?.zoneId || req.body.zoneId;
  const serviceId = req.body.serviceId;

  if (!userId) return fail(res, "User ID is required");
  if (!zoneId) return fail(res, "Zone ID is required");
  if (!serviceId) return fail(res, "Service ID is required");
  if (!propNo) return fail(res, "Property Number is required");
  if (!appliname) return fail(res, "Applicant Name is required");
  if (!mobile) return fail(res, "Mobile Number is required");
  if (String(mobile).length !== 10) return fail(res, "Mobile Number must be 10 digits");
  if (!email) return fail(res, "Email ID is required");
  
  const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(email)) return fail(res, "Invalid Email Address");
  
  if (aadhar && String(aadhar).length !== 12) return fail(res, "Aadhar Number must be 12 digits");
  if (!pincode) return fail(res, "Pincode is required");
  if (String(pincode).length !== 6) return fail(res, "Pincode must be 6 digits");
  if (!remark) return fail(res, "Remark is required");

  if (serviceId == 287) {
    if (!exempType || exempType == 0) return fail(res, "Rebate Type is required");
    if (exempType == 2 && (!taxStr || taxStr == "")) return fail(res, "Please select at least one tax");
  }

  const result = await service.submitTaxExemptionApplicationService({
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
    appSource: appSource || "",
  });

  if (!result.success) {
    return fail(res, result.message || "Application submission failed");
  }

  return ok(res, result, result.message || "Application submitted successfully");
});