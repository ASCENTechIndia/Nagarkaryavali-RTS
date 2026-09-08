const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmHearingProccess.service");

exports.getHearingList = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.body;
  const ulbId = req.user?.ulbId || req.body.ulbId;

  if (!fromDate) {
    return fail(res, "From Date is required");
  }

  if (!toDate) {
    return fail(res, "To Date is required");
  }

  const result = await service.getHearingListService({
    fromDate,
    toDate,
    ulbId
  });

  return ok(res, result, "Hearing list fetched successfully");
});

exports.getAppealTypes = asyncHandler(async (req, res) => {
  const result = await service.getAppealTypesService();

  return ok(res, result, "Appeal types fetched successfully");
});

exports.getHearingData = asyncHandler(async (req, res) => {
  const { appno, appealno, appealid } = req.body;

  if (!appno) {
    return fail(res, "Application Number is required");
  }

  if (!appealno) {
    return fail(res, "Appeal Number is required");
  }

  if (!appealid) {
    return fail(res, "Appeal ID is required");
  }

  const result = await service.getHearingDataService({
    appno,
    appealno,
    appealid
  });

  if (!result.success) {
    return fail(res, result.message || "Record Not Found");
  }

  return ok(res, result, "Hearing data fetched successfully");
});

exports.submitAppealHearing = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.body.userId;
  const ulbId = req.user?.ulbId || req.body.ulbId;

  const {
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
  } = req.body;

  if (!userId) {
    return fail(res, "User ID is required");
  }

  if (!appealNo) {
    return fail(res, "Appeal Number is required");
  }

  if (!appealDate) {
    return fail(res, "Appeal Date is required");
  }

  if (!appliNo) {
    return fail(res, "Application Number is required");
  }

  if (!appealType) {
    return fail(res, "Appeal Type is required");
  }

  if (!appealTypeId) {
    return fail(res, "Appeal Type ID is required");
  }

  if (!briefDescr) {
    return fail(res, "Brief Description is required");
  }

  if (!presents) {
    return fail(res, "Presents flag is required");
  }

  if (!status) {
    return fail(res, "Appeal status is required");
  }

  const result = await service.submitAppealHearingService({
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
    corpId: ulbId,
  });

  if (!result.success) {
    return fail(res, result.message || "Hearing submission failed");
  }

  return ok(res, result, result.message);
});

exports.uploadHearingDocument = asyncHandler(async (req, res) => {
  const ulbId = req.user?.ulbId || req.body.ulbId;
  const fileBuffer = req.file?.buffer; 

  const {
    appNo,
    appealNo,
    docType,
    appealTypeId,
    serviceId,
  } = req.body;

  if (!appNo) {
    return fail(res, "Application Number is required");
  }

  if (!appealNo) {
    return fail(res, "Appeal Number is required");
  }

  if (!docType) {
    return fail(res, "Document Type is required");
  }

  if (!appealTypeId) {
    return fail(res, "Appeal Type ID is required");
  }

  if (!fileBuffer) { 
    return fail(res, "Document file is required");
  }

  const result = await service.uploadHearingDocumentService({
    corpId: Number(ulbId),
    serviceId: Number(serviceId),
    appNo: String(appNo),
    appealNo: String(appealNo),
    docType: String(docType),
    docImage: fileBuffer,  
    appealTypeId: Number(appealTypeId),
  });

  if (!result.success) {
    return fail(res, result.message || "Document upload failed");
  }

  return ok(res, result, result.message);
});
