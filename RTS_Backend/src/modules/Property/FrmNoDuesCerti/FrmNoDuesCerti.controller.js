const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmNoDuesCerti.service");

exports.submitApplication = asyncHandler(async (req, res) => {
  const {
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder,
    structHolder,
    ownDetails,
    address,
    appliname,
    mobile,
    email,
    taxAmount,
    aadharNo,
    appSource,
  } = req.body;

  // Validation
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

  if (!appliname) {
    return fail(res, "Applicant Name is required");
  }

  if (!mobile) {
    return fail(res, "Mobile Number is required");
  }

  if (String(mobile).length !== 10) {
    return fail(res, "Mobile Number must be 10 digits");
  }

  if (!email) {
    return fail(res, "Email ID is required");
  }

  const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(email)) {
    return fail(res, "Invalid Email Address");
  }

  if (aadharNo && String(aadharNo).length !== 12) {
    return fail(res, "Aadhar Number must be 12 digits");
  }

  const result = await service.submitNoDuesCertificateApplicationService({
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder,
    structHolder,
    ownDetails,
    address,
    appliname,
    mobile,
    email,
    taxAmount,
    aadharNo,
    appSource,
  });

  if (!result.success) {
    return fail(res, result.message || "Application submission failed");
  }

  return ok(res, result, result.message || "Application submitted successfully");
});