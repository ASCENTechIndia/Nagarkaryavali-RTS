const asyncHandler = require("../../../libs/asyncHandler");
const service = require("./FrmTrackApplication.service");
const { ok, fail } = require("../../../libs/response");

// ============================================================
// GET APPLICATION DETAILS
// ============================================================
const getApplicationDetails = asyncHandler(async (req, res) => {
  const { userId, ulbId } = req.body;

  console.log("📥 Get Track Application Details", {
    userId,
    ulbId,
  });

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
      data: null,
    });
  }

  if (!ulbId) {
    return res.status(400).json({
      success: false,
      message: "ULB ID is required.",
      data: null,
    });
  }

  const result = await service.getApplicationDetailsService(userId, ulbId);

  return res.status(200).json({
    success: true,
    message: "Application details fetched successfully.",
    data: result.data,
  });
});

// ============================================================
// GET APPLICATION DOCUMENTS
// ============================================================
const getApplicationDocuments = asyncHandler(async (req, res) => {
  const { applino } = req.body;

  console.log("📥 Get Application Documents", {
    applino,
  });

  if (!applino) {
    return res.status(400).json({
      success: false,
      message: "Application Number is required.",
      data: null,
    });
  }

  const result = await service.getApplicationDocumentsService(applino);

  return res.status(200).json({
    success: true,
    message: "Application documents fetched successfully.",
    data: result.data,
  });
});

// ============================================================
// GET APPEAL DETAILS
// ============================================================
const getAppealDetails = asyncHandler(async (req, res) => {
  const { appno } = req.body;

  console.log("📥 Get Appeal Details", {
    appno,
  });

  if (!appno) {
    return res.status(400).json({
      success: false,
      message: "Application Number is required.",
      data: null,
    });
  }

  const result = await service.getAppealDetailsService(appno);

  return res.status(200).json({
    success: true,
    message: "Appeal details fetched successfully.",
    data: result.data,
  });
});

// ============================================================
// GET APPLICATION CERTIFICATE
// ============================================================

const getApplicationCertificate = asyncHandler(async (req, res) => {
  const { applino } = req.body;

  console.log("📥 Get Application Certificate", {
    applino,
  });

  const result = await service.getApplicationCertificateService(applino);

  if (!result.data || result.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Certificate not found",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Application certificate fetched successfully",
    data: result.data,
  });
});

// ============================================================
// GET PAYMENT FLAG
// ============================================================
const getPaymentFlag = asyncHandler(async (req, res) => {
  const result = await service.getPaymentFlagService();

  return res.status(200).json({
    success: true,
    message: "Payment flag fetched successfully.",
    data: result.data,
  });
});
// ============================================================
// CHECK PAYMENT
// ============================================================
const checkPayment = asyncHandler(async (req, res) => {
  const { applino, serviceId } = req.body;

  console.log("📥 Check Payment", {
    applino,
    serviceId,
  });

  if (!applino) {
    return res.status(400).json({
      success: false,
      message: "Application Number is required.",
    });
  }

  if (!serviceId) {
    return res.status(400).json({
      success: false,
      message: "Service ID is required.",
    });
  }

  const result = await service.checkPaymentService(applino, serviceId);

  return res.status(200).json({
    success: true,
    message: "Payment status checked successfully.",
    data: result.checkval,
  });
});

// ============================================================
// GET APPLICATION PAYMENT DETAILS
// ============================================================
const getApplicationPaymentDetails = asyncHandler(async (req, res) => {
  const { applino, serviceId } = req.body;

  console.log("📥 Get Application Payment Details", {
    applino,
    serviceId,
  });

  if (!applino) {
    return res.status(400).json({
      success: false,
      message: "Application Number is required.",
    });
  }

  if (!serviceId) {
    return res.status(400).json({
      success: false,
      message: "Service ID is required.",
    });
  }

  const result = await service.getApplicationPaymentDetailsService(applino, serviceId);

  if (!result.found) {
    return res.status(404).json({
      success: false,
      message: "Application payment details not found.",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Application payment details fetched successfully.",
    data: result.data,
  });
});

// ============================================================
// GET APPLICATION STEPS / TRACKING DETAILS
// ============================================================
const getApplicationSteps = asyncHandler(async (req, res) => {
  const { ulbId, applino, serviceId } = req.body;

  console.log("📥 Get Application Steps", {
    ulbId,
    applino,
    serviceId,
  });

  const data = await service.getApplicationStepsService(ulbId, applino, serviceId);

  return ok(res, data, "Application steps fetched successfully");
});

// ============================================================
// GET CERTIFICATE DATA
// ============================================================
const getCertificateData = async (req, res, next) => {
  try {
    const { serviceId, appNo, ulbId } = req.body;

    console.log("📥 Get Certificate Data", {
      serviceId,
      appNo,
      ulbId,
    });

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required.",
      });
    }

    if (!appNo) {
      return res.status(400).json({
        success: false,
        message: "Application Number is required.",
      });
    }

    if (!ulbId) {
      return res.status(400).json({
        success: false,
        message: "ULB ID is required.",
      });
    }

    const result = await service.getCertificateDataService(serviceId, appNo, ulbId);

    return res.status(200).json({
      success: true,
      message: "Certificate data fetched successfully.",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET RE-APPLY SERVICE DETAILS
// ============================================================
const getReApplyServiceDetails = asyncHandler(async (req, res) => {
  const { serviceId } = req.body;

  console.log("📥 Get Re-Apply Service Details", {
    serviceId,
  });

  const result = await service.getReApplyServiceDetailsService(serviceId);

  if (!result.found) {
    return res.status(404).json({
      success: false,
      message: result.message,
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Re-apply service details fetched successfully.",
    data: result.data,
  });
});

module.exports = {
  getApplicationDetails,
  getApplicationDocuments,
  getAppealDetails,
  getApplicationCertificate,
  getPaymentFlag,
  checkPayment,
  getApplicationPaymentDetails,
  getApplicationSteps,
  getCertificateData,
  getReApplyServiceDetails,
};
