const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmMeatShopNOC.service");

exports.submitApplication = asyncHandler(async (req, res) => {
  const {
    userId,
    firstName,
    middleName,
    lastName,
    mobileNo,
    emailId,
    aadharNo,
    residentialAddress,
    panCard,
    organizationName,
    organizationAddress,
    businessType,
    businessDescription,
    propertyNumber,
    businessAddress,
    waterConnectionNo,
    buildingPermitNo,
    occupancyCertificateNo,
    serviceId,
    ulbId,
    source,
  } = req.body;

  // User ID validation
  if (!userId) {
    return fail(res, "User ID is required");
  }

  // ULB ID validation
  if (!ulbId) {
    return fail(res, "ULB ID is required");
  }

  // First Name validation
  if (!firstName || !firstName.trim()) {
    return fail(res, "First Name is required");
  }

  // Middle Name validation
  if (!middleName || !middleName.trim()) {
    return fail(res, "Middle Name is required");
  }

  // Last Name validation
  if (!lastName || !lastName.trim()) {
    return fail(res, "Last Name is required");
  }

  // Mobile Number validation
  if (!mobileNo) {
    return fail(res, "Mobile Number is required");
  }

  if (String(mobileNo).length !== 10 || !/^\d+$/.test(String(mobileNo))) {
    return fail(res, "Mobile Number must be 10 digits");
  }

  // Email validation
  if (!emailId || !emailId.trim()) {
    return fail(res, "Email ID is required");
  }

  const emailRegex = /^([\w\.\-\+]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(emailId)) {
    return fail(res, "Invalid Email Address");
  }

  // Aadhar validation
  if (!aadharNo || !aadharNo.trim()) {
    return fail(res, "Aadhar Number is required");
  }

  if (String(aadharNo).length !== 12 || !/^\d+$/.test(String(aadharNo))) {
    return fail(res, "Aadhar Number must be 12 digits");
  }

  // Residential Address validation
  if (!residentialAddress || !residentialAddress.trim()) {
    return fail(res, "Residential Address is required");
  }

  // Business Type validation
  if (!businessType) {
    return fail(res, "Business Type is required");
  }

  // Business Description validation
  if (!businessDescription || !businessDescription.trim()) {
    return fail(res, "Business Description is required");
  }

  // Property Number validation
  if (!propertyNumber || !propertyNumber.trim()) {
    return fail(res, "Property Number is required");
  }

  // Business Address validation
  if (!businessAddress || !businessAddress.trim()) {
    return fail(res, "Business Address is required");
  }

  const result = await service.submitMeatShopNOCApplicationService({
    userId,
    firstName,
    middleName,
    lastName,
    mobileNo,
    emailId,
    aadharNo,
    residentialAddress,
    panCard,
    organizationName,
    organizationAddress,
    businessType,
    businessDescription,
    propertyNumber,
    businessAddress,
    waterConnectionNo,
    buildingPermitNo,
    occupancyCertificateNo,
    serviceId,
    ulbId,
    source,
  });

  if (!result.success) {
    return fail(res, result.message || "Application submission failed");
  }

  return ok(res, result, result.message || "Meat Shop NOC application submitted successfully");
});