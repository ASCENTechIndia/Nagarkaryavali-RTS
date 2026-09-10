const repo = require("./FrmToursTravels.repo");
const { AppError } = require("../../../libs/errors");

async function submitToursAndTravelsApplicationService(payload) {
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
  } = payload;

  if (!userId) throw new AppError("User ID is required", 400);
  if (!applicantName) throw new AppError("Applicant Name is required", 400);
  if (!mobileNo) throw new AppError("Mobile Number is required", 400);
  if (String(mobileNo).length !== 10) throw new AppError("Mobile Number must be 10 digits", 400);
  if (!emailId) throw new AppError("Email ID is required", 400);

  const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(emailId)) throw new AppError("Invalid Email Address", 400);

  if (!propertyNo) throw new AppError("Property Number is required", 400);
  if (!businessAddress) throw new AppError("Business Address is required", 400);

  if (aadhaarNo && String(aadhaarNo).length !== 12) {
    throw new AppError("Aadhar Number must be 12 digits", 400);
  }

  if (businessType) {
    const businessTypeNumber = Number(businessType);
    if (isNaN(businessTypeNumber)) {
      throw new AppError("Invalid Business Type", 400);
    }
  }

  const appResult = await repo.insertToursAndTravelsApplication({
    userId,
    applicantName,
    mobileNo,
    emailId,
    aadhaarNo: aadhaarNo,
    residentialAddress: residentialAddress,
    panCardNo: panCardNo,
    orgName: orgName,
    orgAddress: orgAddress,
    businessType: businessType,
    businessDescription: businessDescription,
    propertyNo,
    businessAddress,
    appSource: appSource,
  });

  if (Number(appResult.out_errcode) !== 9999) {
    return {
      success: false,
      errorCode: appResult.out_errcode,
      message: appResult.out_ErrMsg,
    };
  }

  const toursAndTravelsId = appResult.out_toursandtravelsid;
  const parts = appResult.out_ErrMsg.split("$");
  const message = parts[0] || "Tours and Travels application submitted successfully";

  return {
    success: true,
    errorCode: appResult.out_errcode,
    message: message,
    toursAndTravelsId: toursAndTravelsId,
  };
}

module.exports = {
  submitToursAndTravelsApplicationService,
};