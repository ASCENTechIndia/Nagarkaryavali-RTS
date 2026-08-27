const repo = require("./FrmFirstAppealDocUpload.repo");
const { AppError } = require("../../libs/errors");

async function getAppealTypesService() {
  const result = await repo.getAppealTypes();

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch appeal types", 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getAppealAuthorityDetailsService(params) {
  const { appNo } = params;

  if (!appNo) {
    throw new AppError("Application Number is required", 400);
  }

  const result = await repo.getAppealAuthorityDetails({
    appNo,
  });

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to fetch appeal authority details",
      500,
    );
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getApplicationDetailsService(appNo) {
  if (!appNo) {
    throw new AppError("Application Number is required", 400);
  }

  const result = await repo.getApplicationDetails(appNo);

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to fetch application details",
      500,
    );
  }

  if (result.rows.length === 0) {
    return {
      success: false,
      message: "Application details not found",
      data: null,
    };
  }

  return {
    success: true,
    rowCount: result.rows.length,
    data: result.rows[0],
  };
}

async function uploadAppealDocumentService(params) {
  const {
    corpId,
    serviceId,
    appNo,
    appealNo,
    docType,
    documentId,
    appealTypeId,
    fileBuffer,
  } = params;

  if (!corpId) {
    throw new AppError("Corp ID is required", 400);
  }

  if (!serviceId) {
    throw new AppError("Service ID is required", 400);
  }

  if (!appNo) {
    throw new AppError("Application Number is required", 400);
  }

  if (!appealNo) {
    throw new AppError("Appeal Number is required", 400);
  }

  if (!docType) {
    throw new AppError("Document Type is required", 400);
  }

  if (!documentId) {
    throw new AppError("Document ID is required", 400);
  }

  if (!appealTypeId) {
    throw new AppError("Appeal Type ID is required", 400);
  }

  if (!fileBuffer || fileBuffer.length === 0) {
    throw new AppError("Document file is required", 400);
  }

  if (fileBuffer.length > 5 * 1024 * 1024) {
    throw new AppError("Document size should be less than 5MB", 400);
  }

  const result = await repo.insertAppealDocument({
    corpId,
    serviceId,
    appNo,
    appealNo,
    docType,
    documentId,
    appealTypeId,
    docBuffer: fileBuffer,
  });

  if (!result.success) {
    throw new AppError(result.error || "Appeal document upload failed", 500);
  }

  return {
    success: true,
    rowsAffected: result.rowsAffected,
    message: "Appeal document uploaded successfully",
  };
}


async function submitAppealService(params) {
  const {
    appUserId,
    ulbId,  
    app1stAppAuthDesi,
    app1stAppAuthOffAdd,

    nameEligPerson,
    addEligPerson,

    nameDesiOfficer,
    addDesiOfficer,

    appealType,
    appNo,

    dtAProduceBefDesiOffiProvisRvi,
    dtAcknowegmt,
    dtProdDoc,

    detPubServiceReq,
    descIsionDesiOffi,
    stipTimeLimit,

    dtIntiRejAppliRecieEligPer,

    reliefSought,
    firstOtherInfo,

    name1stAppealAuth,
    add1stAppealAuth,

    appealNo,

    dtAppliDesiOffi,
    desi1stAppealAuth,

    dt1stAppeal,
    dtReciOrder1stAppealAuth,

    secondOtherInfo,
    hearingDt,

    refAppealType,
    mode,
  } = params;

  if (!appUserId) {
    throw new AppError("User ID is required", 400);
  }

  if (!ulbId) {
    throw new AppError("ULB ID is required", 400);
  }

  if (!appealType) {
    throw new AppError("Appeal Type is required", 400);
  }

  if (!appNo) {
    throw new AppError("Application Number is required", 400);
  }

  if (!mode) {
    throw new AppError("Mode is required", 400);
  }

  const result = await repo.insertAppeal({
    appUserId,
    ulbId,

    app1stAppAuthDesi,
    app1stAppAuthOffAdd,

    nameEligPerson,
    addEligPerson,

    nameDesiOfficer,
    addDesiOfficer,

    appealType,
    appNo,

    dtAProduceBefDesiOffiProvisRvi,
    dtAcknowegmt,
    dtProdDoc,

    detPubServiceReq,
    descIsionDesiOffi,
    stipTimeLimit,

    dtIntiRejAppliRecieEligPer,

    reliefSought,
    firstOtherInfo,

    name1stAppealAuth,
    add1stAppealAuth,

    appealNo,

    dtAppliDesiOffi,
    desi1stAppealAuth,

    dt1stAppeal,
    dtReciOrder1stAppealAuth,

    secondOtherInfo,
    hearingDt,

    refAppealType,
    mode,
  });

  console.log("result", result);

  if (!result.success) {
    return {
      success: false,
      message:
        result.out_ErrMsg ||
        result.error ||
        "Appeal submission failed",
      errorCode: result.out_errcode,
    };
  }

  if (Number(result.out_errcode) !== 9999) {
    return {
      success: false,
      errorCode: result.out_errcode,
      message:
        result.out_ErrMsg ||
        "Appeal submission failed",
    };
  }

  return {
    success: true,
    errorCode: result.out_errcode,
    message: result.out_ErrMsg || "Success",
    appealNo: result.out_appeal || null,
  };
}

module.exports = {
  getAppealTypesService,
  getAppealAuthorityDetailsService,
  getApplicationDetailsService,
  uploadAppealDocumentService,
  submitAppealService
};
