const repo = require("./frmAppAuth.repo");

// ============================================================
// GET USER PRABHAG LIST
// ============================================================
const getUserPrabhagListService = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return await repo.getUserPrabhagListRepo(userId);
};

// ============================================================
// GET USER DEPARTMENT LIST
// ============================================================
const getUserDeptListService = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return await repo.getUserDeptListRepo(userId);
};

// ============================================================
// GET USER SECTOR LIST
// ============================================================
const getUserSectorListService = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return await repo.getUserSectorListRepo(userId);
};

// ============================================================
// GET APPLICATION AUTHORIZATION LIST
// ============================================================
const getApplicationAuthListService = async (data) => {
  if (!data.userId) {
    throw new Error("User ID is required.");
  }

  if (!data.authMode) {
    throw new Error("Auth Mode is required.");
  }

  // ----------------------------------------------------------
  // Get user permissions
  // ----------------------------------------------------------

  const [prabhagResult, deptResult, sectorResult] = await Promise.all([repo.getUserPrabhagListRepo(data.userId), repo.getUserDeptListRepo(data.userId), repo.getUserSectorListRepo(data.userId)]);

  if (!prabhagResult.success) {
    throw new Error(prabhagResult.error || "Failed to get user prabhag list.");
  }

  if (!deptResult.success) {
    throw new Error(deptResult.error || "Failed to get user department list.");
  }

  if (!sectorResult.success) {
    throw new Error(sectorResult.error || "Failed to get user sector list.");
  }

  const prabhagList = prabhagResult.prabhagList || "";
  const deptList = deptResult.deptList || "";
  const sectorList = sectorResult.sectorList || "";

  // ----------------------------------------------------------
  // Get applications
  // ----------------------------------------------------------

  const applicationResult = await repo.getApplicationAuthListRepo({
    userId: data.userId,
    authMode: data.authMode,
    prabhagList,
    deptList,
    sectorList,
  });

  if (!applicationResult.success) {
    throw new Error(applicationResult.error || "Failed to get application authorization list.");
  }

  return {
    success: true,
    prabhagList,
    deptList,
    sectorList,
    rows: applicationResult.rows,
    rowCount: applicationResult.rowCount,
  };
};

const getHodClerkListService = async ({ zoneId }) => {
  if (!zoneId) {
    throw new Error("Zone ID is required.");
  }

  return await repo.getHodClerkListRepo({
    zoneId,
  });
};


const getApplicationDetailsService = async ({ serviceId, appNo }) => {
  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  if (!appNo) {
    throw new Error("Application number is required.");
  }

  return await repo.getApplicationDetailsRepo({
    serviceId,
    appNo,
  });
};




module.exports = {
  getUserPrabhagListService,
  getUserDeptListService,
  getUserSectorListService,
  getApplicationAuthListService,
  getHodClerkListService,
  getApplicationDetailsService
};
