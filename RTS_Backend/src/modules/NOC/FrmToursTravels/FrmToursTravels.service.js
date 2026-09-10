const repo = require("./FrmToursTravels.repo");
const { AppError } = require("../../../libs/errors");

async function submitNOCApplicationService(payload) {
  const {
    userId, ulbId, serviceId, deptId, zoneId,
    firstName, middleName, lastName, address,
    mobileNo, aadhaarNo, panCardNo, emailId,
    orgName, orgAddress,
    businessType, businessDescription,
    propertyNo, businessAddress,
    waterConnectionNo, permitFromDate, permitToDate,
    occupancyCertificateNo, roadType,
    roadLength, roadWidth, roadLengthWidth,
    excavationArea, excavationStartPoint, excavationEndPoint,
    latitude, longitude, hospitalName, healthAgencyNo,
    fixedArea, newHoarding, hoardingNumber,
    advertisingArea, numberOfDays,
    hoardingType, hoardingSubType,
  } = payload;

  if (!userId) throw new AppError("User ID is required", 400);
  if (!ulbId) throw new AppError("ULB ID is required", 400);
  if (!serviceId) throw new AppError("Service ID is required", 400);
  if (!deptId) throw new AppError("Department ID is required", 400);
  if (!mobileNo) throw new AppError("Mobile Number is required", 400);
  if (String(mobileNo).length !== 10) throw new AppError("Mobile Number must be 10 digits", 400);

  const appResult = await repo.insertNOCApplication({
    userId, ulbId, serviceId, deptId, zoneId,
    firstName, middleName, lastName, address,
    mobileNo, aadhaarNo, panCardNo, emailId,
    orgName, orgAddress,
    businessType, businessDescription,
    propertyNo, businessAddress,
    waterConnectionNo, permitFromDate, permitToDate,
    occupancyCertificateNo, roadType,
    roadLength, roadWidth, roadLengthWidth,
    excavationArea, excavationStartPoint, excavationEndPoint,
    latitude, longitude, hospitalName, healthAgencyNo,
    fixedArea, newHoarding, hoardingNumber,
    advertisingArea, numberOfDays,
    hoardingType, hoardingSubType,
  });

  if (Number(appResult.out_errcode) !== 9999) {
    return {
      success: false,
      errorCode: appResult.out_errcode,
      message: appResult.out_ErrMsg,
    };
  }

  return {
    success: true,
    errorCode: appResult.out_errcode,
    message: appResult.out_ErrMsg || "NOC application submitted successfully",
    applicationNo: appResult.out_applino,
  };
}

async function getServiceFieldsService({ serviceId, deptId, ulbId }) {
  if (!serviceId) throw new AppError("Service ID is required", 400);
  if (!deptId) throw new AppError("Department ID is required", 400);
  if (!ulbId) throw new AppError("ULB ID is required", 400);

  const fields = await repo.getServiceFields({ serviceId, deptId, ulbId });

  return {
    success: true,
    totalFields: fields.length,
    fields: fields,
  };
}

module.exports = {
  submitNOCApplicationService,
  getServiceFieldsService
};