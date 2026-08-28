  const asyncHandler = require("../../../libs/asyncHandler");
  const { ok, fail } = require("../../../libs/response");
  const service = require("./FrmAssessmentCerti.service");

  exports.getDocumentDefinitions = asyncHandler(async (req, res) => {
    const { serviceId, ulbId } = req.body;

    const result = await service.getDocumentDefinitionsService({
      serviceId,
      ulbId,
    });

    return ok(res, result, "Document definitions fetched successfully");
  });

  exports.getServicePaymentFlag = asyncHandler(async (req, res) => {
    const { serviceId } = req.body;

    const result = await service.getServicePaymentFlagService(serviceId);

    return ok(res, result, "Service payment flag fetched successfully");
  });

  exports.getMahaServiceId = asyncHandler(async (req, res) => {
    const { serviceId, mahaUlbId } = req.body;

    const result = await service.getMahaServiceIdService({
      serviceId,
      mahaUlbId,
    });

    return ok(res, result, "Maha service ID fetched successfully");
  });

  exports.uploadDocument = asyncHandler(async (req, res) => {
    const { corpId, serviceId, appNo, docType, documentId } = req.body;
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

    if (!docType) {
      return fail(res, "Document Type is required");
    }

    if (!documentId) {
      return fail(res, "Document ID is required");
    }

    if (!fileBuffer) {
      return fail(res, "Document file is required");
    }

    const result = await service.uploadDocumentService({
      corpId,
      serviceId,
      appNo,
      docType,
      documentId,
      fileBuffer,
    });

    if (!result.success) {
      return fail(res, result.message || "Document upload failed");
    }

    return ok(res, result, "Document uploaded successfully");
  });

exports.submitApplication = asyncHandler(async (req, res) => {
  const {
    ulbId,
    corpId,
    propNo,
    subCode,
    landHolder,
    structHolder,
    ownDetails,
    address,
    flatNo,
    structure,
    usageType,
    constType,
    area,
    lettingRate,
    rate,
    yearTax,
    assessmentYear,
    applicantName,
    mobile,
    email,
    appSource,
    documents,
    mahaData,
  } = req.body;

    const userId = req.user?.userId || req.body.userId;
    const zoneId = req.user?.zoneId || req.body.zoneId;
    const serviceId = req.body.serviceId;

    if (!ulbId) {
      return fail(res, "ULB ID is required");
    }

    if (!userId) {
      return fail(res, "User ID is required");
    }

    if (!zoneId) {
      return fail(res, "Zone ID is required");
    }

    if (!serviceId) {
      return fail(res, "Service ID is required");
    }

    if (!propNo) {
      return fail(res, "Property Number is required");
    }

    if (!applicantName) {
      return fail(res, "Applicant Name is required");
    }

    if (!mobile) {
      return fail(res, "Mobile Number is required");
    }

    if (String(mobile).length !== 10) {
      return fail(res, "Mobile Number must be 10 digits");
    }

    if (!email) {
      return fail(res, "Email ID is required");
    }

    const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
    if (!emailRegex.test(email)) {
      return fail(res, "Invalid Email Address");
    }

  const result = await service.submitAssessmentApplicationService({
    ulbId,
    corpId,
    userId,
    zoneId,
    serviceId,
    propNo,
    subCode,
    landHolder,
    structHolder,
    ownDetails,
    address,
    flatNo,
    structure,
    usageType,
    constType,
    area,
    lettingRate,
    rate,
    yearTax,
    assessmentYear,
    applicantName,
    mobile,
    email,
    appSource,
    documents,
    mahaData,
  });

    if (!result.success) {
      return fail(res, result.message || "Application submission failed");
    }

    return ok(res, result, result.message || "Application submitted successfully");
  });

  exports.checkPayment = asyncHandler(async (req, res) => {
    const { serviceId, applicationNo, message } = req.body;

    if (!serviceId) {
      return fail(res, "Service ID is required");
    }

    const result = await service.getServicePaymentFlagService(serviceId);

    let payFlag = "N";
    if (result.success && result.rows.length > 0) {
      payFlag = result.rows[0].VAR_SERVICE_PAYFLAG || "N";
    }

    return ok(res, {
      payFlag,
      redirectTo: payFlag === "N" ? "FrmAssessmentCerti.aspx" : "FrmAppliFee.aspx",
      message: message || "Application processed successfully",
      applicationNo,
    }, "Payment check completed");
  });

  exports.insertMahaOnlineFirstStep = asyncHandler(async (req, res) => {
    const { mahaData, applicationNo, serviceId } = req.body;

    if (!mahaData) {
      return fail(res, "Maha data is required");
    }

    if (!mahaData.ulbId) {
      return fail(res, "ULB ID is required in mahaData");
    }

    if (!mahaData.mahaUlbId) {
      return fail(res, "Maha ULB ID is required in mahaData");
    }

    if (!applicationNo) {
      return fail(res, "Application Number is required");
    }

    if (!serviceId) {
      return fail(res, "Service ID is required");
    }

    const result = await service.insertMahaOnlineFirstStepService({
      mahaData,
      applicationNo,
      serviceId,
    });

    return ok(res, result, "Maha online integration completed successfully");
  });