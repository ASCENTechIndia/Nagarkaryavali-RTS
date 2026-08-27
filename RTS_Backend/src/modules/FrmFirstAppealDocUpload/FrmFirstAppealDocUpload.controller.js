const asyncHandler = require("../../libs/asyncHandler");
const { ok, fail } = require("../../libs/response");

const service = require("./FrmFirstAppealDocUpload.service");

exports.getAppealTypes = asyncHandler(async (req, res) => {
  const result = await service.getAppealTypesService();

  if (!result.success) {
    return fail(res, result.message || "Failed to fetch appeal types");
  }

  return ok(res, result, "Appeal types fetched successfully");
});

exports.getAppealAuthorityDetails = asyncHandler(async (req, res) => {
  const { appNo } = req.body;

  if (!appNo) {
    return fail(res, "Application Number is required");
  }

  const result = await service.getAppealAuthorityDetailsService({
    appNo,
  });

  if (!result.success) {
    return fail(
      res,
      result.message || "Failed to fetch appeal authority details",
    );
  }

  return ok(res, result, "Appeal authority details fetched successfully");
});

exports.getApplicationDetails = asyncHandler(async (req, res) => {
  const { appNo } = req.body;

  if (!appNo) {
    return fail(res, "Application Number is required");
  }

  const result = await service.getApplicationDetailsService(appNo);

  if (!result.success) {
    return fail(res, result.message || "Failed to fetch application details");
  }

  return ok(res, result, "Application details fetched successfully");
});

exports.uploadAppealDocument = asyncHandler(async (req, res) => {
  const {
    corpId,
    serviceId,
    appNo,
    appealNo,
    docType,
    documentId,
    appealTypeId,
  } = req.body;

  const fileBuffer = req.file?.buffer;

  if (!corpId) {
    return fail(res, "Corp ID is required");
  }

  if (!serviceId) {
    return fail(res, "Service ID is required");
  }

  if (!appNo) {
    return fail(res, "Application Number is required");
  }

  if (!appealNo) {
    return fail(res, "Appeal Number is required");
  }

  if (!docType) {
    return fail(res, "Document Type is required");
  }

  if (!documentId) {
    return fail(res, "Document ID is required");
  }

  if (!appealTypeId) {
    return fail(res, "Appeal Type ID is required");
  }

  if (!fileBuffer) {
    return fail(res, "Document file is required");
  }

  const result = await service.uploadAppealDocumentService({
    corpId,
    serviceId,
    appNo,
    appealNo,
    docType,
    documentId,
    appealTypeId,
    fileBuffer,
  });

  if (!result.success) {
    return fail(res, result.message || "Appeal document upload failed");
  }

  return ok(res, result, "Appeal document uploaded successfully");
});

exports.submitAppeal = asyncHandler(async (req, res) => {
  const {
    ulbId,
    appUserId,

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
  } = req.body;

  const userId =
    req.user?.userId ||
    req.body.userId ||
    appUserId;

  if (!userId) {
    return fail(res, "User ID is required");
  }

  if (!ulbId) {
    return fail(res, "ULB ID is required");
  }

  if (!appealType) {
    return fail(res, "Appeal Type is required");
  }

  if (!appNo) {
    return fail(res, "Application Number is required");
  }

  if (!mode) {
    return fail(res, "Mode is required");
  }

  const result = await service.submitAppealService({
    appUserId: userId,
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

  if (!result.success) {
    return fail(
      res,
      result.message || "Appeal submission failed"
    );
  }

  return ok(
    res,
    result,
    result.message || "Appeal submitted successfully"
  );
});
