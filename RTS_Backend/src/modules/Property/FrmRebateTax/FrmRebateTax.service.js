const repo = require("./FrmRebateTax.repo");
const { AppError } = require("../../../libs/errors");

async function getRebateTypesService() {
  const result = await repo.getRebateTypes();
  if (!result.success) {
    throw new AppError(result.error, 500);
  }
  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getTaxNamesService() {
  const result = await repo.getTaxNames();
  if (!result.success) {
    throw new AppError(result.error, 500);
  }
  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function submitTaxExemptionApplicationService(payload) {
  const {
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
    appSource,
  } = payload;

  const appResult = await repo.insertTaxExemptionApplication({
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode: subCode || "",
    landHolder: landHolder || "",
    structHolder: structHolder || "",
    ownName: ownName || "",
    address: address || "",
    appliname,
    mobile,
    email,
    aadhar: aadhar || 0,
    pincode,
    exempType: exempType || 0,
    remark,
    taxStr: taxStr || "",
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

  const parts = appResult.out_ErrMsg.split("$");
  const message = parts[0] || "Application submitted successfully";

  return {
    success: true,
    errorCode: appResult.out_errcode,
    message: message,
    applicationNo: applicationNo,
  };
}

module.exports = {
  getRebateTypesService,
  getTaxNamesService,
  submitTaxExemptionApplicationService,
};