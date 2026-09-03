const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");

const service = require("./frmAppAuth.service");

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

module.exports = {
  getUserPrabhagList,
  getUserDeptList,
  getUserSectorList,
  getApplicationAuthList,
  getHodClerkList,
  getApplicationDetails,
};
