const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");

const service = require("./frmAppAuth.service");
const crypto = require("crypto");

const ENCRYPTION_KEY = "AS23N7E2H4V717DEAS23N7E2H4V717DE";
const IV_LENGTH = 16;

const encryptString = (plainText) => {
  try {
    const key = Buffer.from(ENCRYPTION_KEY, "utf8");
    const iv = Buffer.alloc(16, 0);
    
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    return encrypted.toUpperCase();
  } catch (error) {
    console.error("Encryption error:", error);
    return plainText;
  }
};

const generateTinyUrl = (applino) => {
  try {
    const encrypted = encryptString(applino);
    const longUrl = `https://nagarkaryavaliuat.com/TMCRTS_New/APP/FrmAppliFee.aspx?@=${encrypted}`;
    return longUrl;
  } catch (error) {
    console.error("TinyURL generation error:", error);
    return `https://nagarkaryavaliuat.com/TMCRTS_New/APP/FrmAppliFee.aspx?@=${applino}`;
  }
};

// ============================================================
// GET USER PRABHAG LIST
// ============================================================
const getUserPrabhagList = asyncHandler(async (req, res) => {
  console.log("Request: Get User Prabhag List");
  console.log("Request Body:", req.body);

  const { userId } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  const result = await service.getUserPrabhagListService(userId);

  if (!result.success) {
    throw new AppError(result.error || "Failed to get prabhag list.", 500);
  }

  return ok(res, {
    message: "User prabhag list fetched successfully.",
    userId,
    prabhagList: result.prabhagList,
  });
});

// ============================================================
// GET USER DEPARTMENT LIST
// ============================================================
const getUserDeptList = asyncHandler(async (req, res) => {
  console.log("Request: Get User Department List");
  console.log("Request Body:", req.body);

  const { userId } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  const result = await service.getUserDeptListService(userId);

  if (!result.success) {
    throw new AppError(result.error || "Failed to get department list.", 500);
  }

  return ok(res, {
    message: "User department list fetched successfully.",
    userId,
    deptList: result.deptList,
  });
});

// ============================================================
// GET USER SECTOR LIST
// ============================================================
const getUserSectorList = asyncHandler(async (req, res) => {
  console.log("Request: Get User Sector List");
  console.log("Request Body:", req.body);

  const { userId } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  const result = await service.getUserSectorListService(userId);

  if (!result.success) {
    throw new AppError(result.error || "Failed to get sector list.", 500);
  }

  return ok(res, {
    message: "User sector list fetched successfully.",
    userId,
    sectorList: result.sectorList,
  });
});

// ============================================================
// GET APPLICATION AUTHORIZATION LIST
// ============================================================
const getApplicationAuthList = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get Application Authorization List");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const { userId, authMode } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (!authMode) {
    throw new AppError("authMode is required", 400);
  }

  const result = await service.getApplicationAuthListService({
    userId,
    authMode,
  });

  if (!result.success) {
    throw new AppError(result.error || "Failed to get application authorization list.", 500);
  }

  return ok(res, {
    message: "Application authorization list fetched successfully.",

    userId,

    authMode,

    userPermissions: {
      prabhagList: result.prabhagList,
      deptList: result.deptList,
      sectorList: result.sectorList,
    },

    rowCount: result.rowCount,

    data: result.rows,
  });
});

const getHodClerkList = asyncHandler(async (req, res) => {
  const { zoneId } = req.body;

  if (!zoneId) {
    throw new AppError("zoneId is required", 400);
  }

  const result = await service.getHodClerkListService({
    zoneId,
  });

  return ok(res, {
    status: "SUCCESS",
    message: "HOD clerk list fetched successfully.",
    data: result.rows || [],
    rowCount: result.rowCount || 0,
  });
});

const getApplicationDetails = asyncHandler(async (req, res) => {
  const { serviceId, appNo } = req.body;

  if (!serviceId) {
    throw new AppError("serviceId is required", 400);
  }

  if (!appNo) {
    throw new AppError("appNo is required", 400);
  }

  const result = await service.getApplicationDetailsService({
    serviceId,
    appNo,
  });

  if (!result || !result.main || result.main.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No application details found.",
      data: null,
    });
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Application details fetched successfully.",
    data: result,
  });
});

const applicationAuth = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Application Authorization");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const {
    userId,
    applicationNo,
    status,
    reasonForReject,
    amount,
    mode,
    clerkId,
    tinyUrl,
  } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (!applicationNo) {
    throw new AppError("applicationNo is required", 400);
  }

  if (!status) {
    throw new AppError("status is required", 400);
  }

  if (!mode) {
    throw new AppError("mode is required", 400);
  }

  let finalTinyUrl = tinyUrl || "";
  if (mode === "CKV" && applicationNo) {
    try {
      finalTinyUrl = generateTinyUrl(applicationNo);
      console.log("Generated TinyURL for CKV mode:", finalTinyUrl);
    } catch (error) {
      console.error("Error generating TinyURL:", error);
      finalTinyUrl = "";
    }
  }

  const result = await service.applicationAuthService({
    userId,
    applicationNo,
    status,
    reasonForReject,
    amount,
    mode,
    clerkId,
    tinyUrl: finalTinyUrl,
  });

  if (!result.success) {
    throw new AppError(
      result.errorMsg || "Application authorization failed.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: result.errorMsg || "Application authorized successfully.",
    errorCode: result.errorCode,
    data: {
      ...result,
      tinyUrl: finalTinyUrl
    },
  });
});

const saveApplicationVerificationDocument = asyncHandler(
  async (req, res) => {
    console.log("================================================");
    console.log("Request: Save Application Verification Document");
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file?.originalname);
    console.log("================================================");

    const {
      ulbid,
      applino,
      userid,
      docname,
    } = req.body;

    const file = req.file;

  

    if (!ulbid) {
      throw new AppError("ulbid is required", 400);
    }

    if (!applino) {
      throw new AppError("applino is required", 400);
    }

    if (!userid) {
      throw new AppError("userid is required", 400);
    }

    if (!file) {
      throw new AppError("Document file is required", 400);
    }


    const result =
      await service.saveApplicationVerificationDocumentService({
        ulbid,
        applino,
        userid,
        docname: docname || "CertificateORG",
        docbyte: file.buffer,
      });

    if (!result.success) {
      throw new AppError(
        result.error ||
          "Failed to save application verification document.",
        500
      );
    }

    return ok(res, {
      status: "SUCCESS",
      message: result.message,
      data: {
        deletedRows: result.deletedRows,
        insertedRows: result.insertedRows,
      },
    });
  }
);

const getMenuDetails = asyncHandler(async (req, res) => {
  const { serviceId, appNo, authMode } = req.body;

  if (!serviceId) {
    throw new AppError("serviceId is required", 400);
  }

  if (!appNo) {
    throw new AppError("appNo is required", 400);
  }

  const result = await service.getMenuDetailsService({
    serviceId,
    appNo,
    authMode,
  });

  if (!result || result.status === "FAILED") {
    throw new AppError(result?.message || "Failed to fetch menu details", 500);
  }

  if (result.status === "NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "No record found",
    });
  }

  return ok(res, result);
});

const certificatePreview = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Certificate Preview");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const { userId, applino, serviceid, applidata } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (!applino) {
    throw new AppError("applino is required", 400);
  }

  if (!serviceid) {
    throw new AppError("serviceid is required", 400);
  }

  const result = await service.certificateDataService({
    userId,
    applino,
    serviceid,
    applidata: applidata || "",
  });

  if (!result.success) {
    throw new AppError(result.errorMsg || "Failed to generate certificate.", 500);
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Certificate generated successfully.",
    data: {
      certificateUrl: `/api/frmAppAuth/certificate-preview/${applino}`,
      ...result,
    },
  });
});

const tradeCertificate = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Trade Certificate");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const { userId, applino, serviceid, tradeType, tradeData } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (!applino) {
    throw new AppError("applino is required", 400);
  }

  if (!serviceid) {
    throw new AppError("serviceid is required", 400);
  }

  if (!tradeType) {
    throw new AppError("tradeType is required", 400);
  }

  let applidata = "";
  if (tradeType === "T") {
    applidata = [
      tradeType,
      tradeData.business || "",
      tradeData.fromDt || "",
      tradeData.toDt || "",
      tradeData.totalArea || "",
      tradeData.machineryCount || "",
      tradeData.employeeCount || "",
      tradeData.electricityApproval || "",
      tradeData.fireSafety || "",
      tradeData.firstAid || "",
      tradeData.licenseNo || "",
      tradeData.year || "",
      tradeData.renewalDt || "",
      tradeData.receiptNo || "",
      tradeData.amount || "",
    ].join("~");
  } else if (tradeType === "S") {
    applidata = [
      tradeType,
      tradeData.name || "",
      tradeData.buildingNo || "",
      tradeData.situated || "",
      tradeData.noOfArticles || "",
      tradeData.quantity || "",
    ].join("~");
  }

  const result = await service.certificateDataService({
    userId,
    applino,
    serviceid,
    applidata,
  });

  if (!result.success) {
    throw new AppError(result.errorMsg || "Failed to generate trade certificate.", 500);
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Trade certificate generated successfully.",
    data: result,
  });
});

const updateDocumentFlag = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Update Document Flag");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const { appNo, docId } = req.body;

  if (!appNo) {
    throw new AppError("appNo is required", 400);
  }

  if (!docId) {
    throw new AppError("docId is required", 400);
  }

  const result = await service.updateDocumentFlagService({
    appNo,
    docId,
  });

  if (!result.success) {
    throw new AppError(result.error || "Failed to update document flag.", 500);
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Document verified successfully.",
    data: {
      appNo,
      docId,
      vrfyFlag: "Y",
    },
  });
});

module.exports = {
  getUserPrabhagList,
  getUserDeptList,
  getUserSectorList,
  getApplicationAuthList,
  getHodClerkList,
  getApplicationDetails,
  applicationAuth,
  saveApplicationVerificationDocument,
  getMenuDetails,
  certificatePreview,
  tradeCertificate,
  updateDocumentFlag
};
