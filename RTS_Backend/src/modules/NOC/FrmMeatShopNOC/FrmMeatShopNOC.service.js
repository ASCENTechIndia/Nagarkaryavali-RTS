const repo = require("./FrmMeatShopNOC.repo");
const { AppError } = require("../../../libs/errors");

async function submitMeatShopNOCApplicationService(payload) {
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
  } = payload;

  if (!userId)             throw new AppError("User ID is required", 400);
  if (!firstName?.trim())  throw new AppError("First Name is required", 400);
  if (!middleName?.trim()) throw new AppError("Middle Name is required", 400);
  if (!lastName?.trim())   throw new AppError("Last Name is required", 400);
  if (!mobileNo)           throw new AppError("Mobile Number is required", 400);

  if (String(mobileNo).length !== 10 || !/^\d+$/.test(String(mobileNo))) {
    throw new AppError("Mobile Number must be 10 digits", 400);
  }

  if (!emailId) throw new AppError("Email ID is required", 400);

  const emailRegex = /^([\w\.\-\+]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(emailId)) {
    throw new AppError("Invalid Email Address", 400);
  }

  if (!aadharNo) throw new AppError("Aadhar Number is required", 400);
  if (String(aadharNo).length !== 12) {
    throw new AppError("Aadhar Number must be 12 digits", 400);
  }

  if (!residentialAddress?.trim()) throw new AppError("Residential Address is required", 400);
  if (!businessType)               throw new AppError("Business Type is required", 400);
  if (!businessDescription?.trim()) throw new AppError("Business Description is required", 400);
  if (!propertyNumber?.trim())     throw new AppError("Property Number is required", 400);
  if (!businessAddress?.trim())    throw new AppError("Business Address is required", 400);

  if (isNaN(Number(businessType))) {
    throw new AppError("Invalid Business Type", 400);
  }

  const applicantName = [firstName, middleName, lastName]
    .map(s => (s || "").trim())
    .filter(Boolean)
    .join(" ");

  const appResult = await repo.insertMeatShopNOCApplication({
    userId,
    applicantName,
    mobileNo,
    emailId,
    aadhaarNo: aadharNo,
    residentialAddress,
    panCardNo: panCard,
    orgName: organizationName,
    orgAddress: organizationAddress,
    businessType,
    businessDescription,
    propertyNo: propertyNumber,
    businessAddress,
    waterConnectionNo,
    constructionPermissionNo: buildingPermitNo,
    occupancyCertificateNo,
    appSource: source,
  });

  const errCode = Number(appResult.OUT_ERRCODE);
  const errMsg  = appResult.OUT_ERRMSG || "";
  const meatShopId = appResult.OUT_MEATSHOP_ID;

  if (errCode !== 9999) {
    return {
      success: false,
      errorCode: errCode,
      message: errMsg || "Meat Shop NOC application submission failed",
    };
  }

  return {
    success: true,
    errorCode: errCode,
    message: errMsg,
    meatShopId: meatShopId,
    applicationNo: meatShopId != null ? String(meatShopId) : null,
  };
}

module.exports = {
  submitMeatShopNOCApplicationService,
};