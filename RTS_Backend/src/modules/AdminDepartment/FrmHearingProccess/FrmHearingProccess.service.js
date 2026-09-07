const repo = require("./FrmHearingProccess.repo");
const { AppError } = require("../../../libs/errors");

async function getHearingListService(params) {
  const { fromDate, toDate } = params;

  if (!fromDate) {
    throw new AppError("From Date is required", 400);
  }

  if (!toDate) {
    throw new AppError("To Date is required", 400);
  }

  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);
  const today = new Date();

  if (fromDateObj > toDateObj) {
    throw new AppError("To date should be greater than from date", 400);
  }

  if (fromDateObj > today) {
    throw new AppError("From Date cannot be greater than System Date", 400);
  }

  if (toDateObj > today) {
    throw new AppError("To Date cannot be greater than System Date", 400);
  }

  const result = await repo.getHearingList({ fromDate, toDate });

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch hearing list", 500);
  }

  return {
    success: true,
    rowCount: result.rowCount,
    rows: result.rows,
    message: "Hearing list fetched successfully"
  };
}

async function getAppealTypesService() {
  const result = await repo.getAppealTypes();

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch appeal types", 500);
  }

  return {
    success: true,
    rowCount: result.rowCount,
    rows: result.rows,
    message: "Appeal types fetched successfully"
  };
}

async function getHearingDataService(params) {
  const { appno, appealno, appealid } = params;

  if (!appno) {
    throw new AppError("Application Number is required", 400);
  }

  if (!appealno) {
    throw new AppError("Appeal Number is required", 400);
  }

  if (!appealid) {
    throw new AppError("Appeal ID is required", 400);
  }

  const result = await repo.getHearingData({ appno, appealno, appealid });

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch hearing data", 500);
  }

  if (result.rowCount === 0) {
    return {
      success: false,
      message: "Record Not Found",
      rows: []
    };
  }

  return {
    success: true,
    rowCount: result.rowCount,
    rows: result.rows,
    message: "Hearing data fetched successfully"
  };
}

async function submitAppealHearingService(params) {
  const {
    userId,
    appealhearId,  
    appealNo,
    appealDate,
    appliNo,
    appealType,
    appealDtls,
    presents,
    briefDescr,
    status,
    fine,
    mode,
    appealTypeId,
    corpId,
  } = params;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!appealNo) {
    throw new AppError("Appeal Number is required", 400);
  }

  if (!appealDate) {
    throw new AppError("Appeal Date is required", 400);
  }

  if (!appliNo) {
    throw new AppError("Application Number is required", 400);
  }

  if (!appealType) {
    throw new AppError("Appeal Type is required", 400);
  }

  if (!appealTypeId) {
    throw new AppError("Appeal Type ID is required", 400);
  }

  if (!briefDescr) {
    throw new AppError("Brief Description is required", 400);
  }

  if (!presents) {
    throw new AppError("Presents flag is required", 400);
  }

  if (!status) {
    throw new AppError("Appeal status is required", 400);
  }

  const hearingResult = await repo.insertAppealHearing({
    userId,
    appealhearId,  
    appealhearId,
    appealNo,
    appealDate,
    appliNo,
    appealType,
    appealDtls,
    presents,
    briefDescr,
    status,
    fine,
    mode,
    appealTypeId,
    corpId
  });

  if (!hearingResult.success) {
    throw new AppError(
      hearingResult.message || "Failed to submit appeal hearing",
      hearingResult.errorCode === 9999 ? 200 : 500
    );
  }

  return {
    success: true,
    message: hearingResult.message || "Appeal Hearing submitted successfully",
    errorCode: hearingResult.errorCode,
    applicationNo: appliNo,
    appealNo: appealNo
  };
}

async function uploadHearingDocumentService(params) {
  const {
    corpId,
    serviceId,
    appNo,
    appealNo,
    docType,
    docImage,
    appealTypeId,
  } = params;

  if (!corpId) {
    throw new AppError("Corp ID is required", 400);
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

  if (!appealTypeId) {
    throw new AppError("Appeal Type ID is required", 400);
  }

  if (!docImage || docImage.length === 0) {
    throw new AppError("Document file is required", 400);
  }

  if (docImage.length > 5 * 1024 * 1024) {
    throw new AppError("Document Size Should Be < 5 MB", 400);
  }

  const allowedExtensions = ['.PDF'];
  const ext = String(docType).toUpperCase();
  if (!allowedExtensions.includes(ext)) {
    throw new AppError("Document Should Be Acceptable In .pdf Format Only", 400);
  }

  const docResult = await repo.insertAppealHearingDocument({
    corpId: Number(corpId),
    serviceId: Number(serviceId) || 0,
    appNo: String(appNo),
    appealNo: String(appealNo),
    docType: String(docType),
    docImage: docImage,
    appealTypeId: Number(appealTypeId),
  });

  if (!docResult.success) {
    throw new AppError(docResult.error || "Document upload failed", 500);
  }

  return {
    success: true,
    message: "Document uploaded successfully",
    rowsAffected: docResult.rowsAffected,
    applicationNo: appNo,
    appealNo: appealNo,
  };
}

module.exports = {
  getHearingListService,
  getAppealTypesService,
  getHearingDataService,
  submitAppealHearingService,
  uploadHearingDocumentService
};