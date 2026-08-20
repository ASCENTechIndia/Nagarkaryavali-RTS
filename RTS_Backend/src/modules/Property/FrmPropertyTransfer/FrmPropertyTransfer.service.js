const repo = require("./FrmPropertyTransfer.repo");
const assessmentRepo = require("../FrmAssessmentCerti/FrmAssessmentCerti.repo");
const { AppError } = require("../../../libs/errors");

async function getTransferTypesService() {
  const result = await repo.getTransferTypes();

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function submitPropertyTransferApplicationService(payload) {
  const {
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
  } = payload;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!zoneId) {
    throw new AppError("Zone ID is required", 400);
  }

  if (!serviceId) {
    throw new AppError("Service ID is required", 400);
  }

  if (!propNo) {
    throw new AppError("Property Number is required", 400);
  }

  if (!newOwnName) {
    throw new AppError("New Owner Name is required", 400);
  }

  if (!appliEmail) {
    throw new AppError("Email is required", 400);
  }

  const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  if (!emailRegex.test(appliEmail)) {
    throw new AppError("Invalid Email Address", 400);
  }

  if (!appliAddr) {
    throw new AppError("Address is required", 400);
  }

  if (!appliMobile) {
    throw new AppError("Mobile Number is required", 400);
  }

  if (String(appliMobile).length !== 10) {
    throw new AppError("Mobile Number must be 10 digits", 400);
  }

  if (appliAadhar && String(appliAadhar).length !== 12) {
    throw new AppError("Aadhar Number must be 12 digits", 400);
  }

  const appResult = await repo.insertPropertyTransferApplication({
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode: subCode || "",
    landHolder: landHolder || "",
    structOwner: structOwner || "",
    oldOwnName: oldOwnName || "",
    newOwnName,
    occupName: occupName || "",
    legalStat: legalStat || "",
    address: address || "",
    propType: propType || "",
    areaofProp: areaofProp || "",
    transType,
    consttype: consttype || "",
    appliEmail,
    appliAddr,
    appliMobile,
    appliAadhar: appliAadhar || 0,
    appSource: appSource || "WEB",
  });

  if (Number(appResult.out_errcode) !== 9999) {
    return {
      success: false,
      errorCode: appResult.out_errcode,
      message: appResult.out_ErrMsg,
    };
  }

  const applicationNo = appResult.out_applino;

  const paymentFlagResult = await assessmentRepo.getServicePaymentFlag(serviceId);
  let payFlag = "N";
  if (paymentFlagResult.success && paymentFlagResult.rows.length > 0) {
    payFlag = paymentFlagResult.rows[0].VAR_SERVICE_PAYFLAG || "N";
  }

  const parts = appResult.out_ErrMsg.split("$");
  const message = parts[0] || "Application submitted successfully";

  return {
    success: true,
    errorCode: appResult.out_errcode,
    message: message,
    applicationNo: applicationNo,
    payFlag: payFlag,
    redirectTo: payFlag === "N" ? "FrmPropertyTransfer" : "FrmAppliFee",
  };
}

async function getPropertyTransferApplicationService(appNo) {
  if (!appNo) {
    throw new AppError("Application Number is required", 400);
  }

  const result = await repo.getPropertyTransferApplication(appNo);

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  if (result.rows.length === 0) {
    return {
      success: false,
      message: "Application not found",
      data: null,
    };
  }

  const row = result.rows[0];

  return {
    success: true,
    data: {
      applicationNo: row.VAR_PROPTRANS_APPNO || "",
      areaofProp: row.VAR_PROPTRANS_AREAOFPROP || "",
      legalStatus: row.VAR_PROPTRANS_LEGALSTATUS || "",
      propType: row.VAR_PROPTRANS_PROPTYPE || "",
      constType: row.VAR_PROPTRANS_CONSTTYPE || "",
    },
  };
}

async function getTransferRateConfigService(params) {
  const { serviceId, slum, area } = params;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400);
  }

  if (area === undefined || area === null) {
    throw new AppError("Area is required", 400);
  }

  let fromArea = 0;
  let toArea = 0;
  const slumValue = slum || "N";

  if (serviceId == 4) {
    if (area >= 1 && area <= 500 && slumValue === "N") {
      fromArea = 1;
      toArea = 500;
    } else if (area > 500 && area <= 1000 && slumValue === "N") {
      fromArea = 500;
      toArea = 1000;
    } else if (area >= 1000 && slumValue === "N") {
      fromArea = 1000;
      toArea = 10000000;
    } else if (area >= 1 && area <= 300 && slumValue === "Y") {
      fromArea = 1;
      toArea = 300;
    } else if (area > 300 && slumValue === "Y") {
      fromArea = 300;
      toArea = 10000000;
    }
  } else {
    if (area >= 1 && area <= 500 && slumValue === "N") {
      fromArea = 1;
      toArea = 500;
    } else if (area > 500 && area <= 1000 && slumValue === "N") {
      fromArea = 500;
      toArea = 1000;
    } else if (area >= 1000 && slumValue === "N") {
      fromArea = 1000;
      toArea = 10000000;
    }
  }

  const result = await repo.getTransferRateConfig({
    serviceId,
    slum: slumValue,
    fromArea,
    toArea,
  });

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  if (result.rows.length === 0) {
    return {
      success: false,
      message: "Rate configuration not found",
      data: null,
    };
  }

  const row = result.rows[0];

  return {
    success: true,
    data: {
      resleg: row.RESLEG || 0,
      nonresleg: row.NONRESLEG || 0,
      resilleg: row.RESILLEG || 0,
      nonresilleg: row.NONRESILLEG || 0,
    },
  };
}

module.exports = {
  getTransferTypesService,
  submitPropertyTransferApplicationService,
  getPropertyTransferApplicationService,
  getTransferRateConfigService,
};