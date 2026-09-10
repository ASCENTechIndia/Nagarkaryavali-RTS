const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmToursTravels.service");

exports.submitApplication = asyncHandler(async (req, res) => {
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
  } = req.body;

  if (!userId) {
    return fail(res, "User ID is required");
  }

  if (!applicantName) {
    return fail(res, "Applicant Name is required");
  }

  if (!mobileNo) {
    return fail(res, "Mobile Number is required");
  }

  if (String(mobileNo).length !== 10) {
    return fail(res, "Mobile Number must be 10 digits");
  }

  if (!emailId) {
    return fail(res, "Email ID is required");
  }

  const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(emailId)) {
    return fail(res, "Invalid Email Address");
  }

  if (!propertyNo) {
    return fail(res, "Property Number is required");
  }

  if (!businessAddress) {
    return fail(res, "Business Address is required");
  }

  if (aadhaarNo && String(aadhaarNo).length !== 12) {
    return fail(res, "Aadhar Number must be 12 digits");
  }

  const result = await service.submitToursAndTravelsApplicationService({
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

  if (!result.success) {
    return fail(res, result.message || "Application submission failed");
  }

  return ok(res, result, result.message || "Tours and Travels application submitted successfully");
});