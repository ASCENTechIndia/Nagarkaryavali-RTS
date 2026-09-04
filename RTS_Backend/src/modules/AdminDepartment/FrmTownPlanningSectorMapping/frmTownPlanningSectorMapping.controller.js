const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");

const service = require("./frmTownPlanningSectorMapping.service");

// ============================================================
// GET USER LIST
// GET /api/FrmTownPlanningSectorMapping/user-list
// ============================================================
const getUserList = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get User List for Town Planning Sector Mapping");
  console.log("================================================");

  const result = await service.getUserListService();

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch user list.", 500);
  }

  return ok(res, {
    message: "User list fetched successfully.",
    rowCount: result.rowCount,
    data: result.rows,
  });
});

// ============================================================
// GET SECTOR LIST WITH MAPPING FLAG
// GET /api/FrmTownPlanningSectorMapping/sector-list?userId=xxx
// ============================================================
const getSectorListWithMapping = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get Sector List with Mapping");
  console.log("Query Params:", req.query);
  console.log("================================================");

  const { userId } = req.query;

  if (!userId) {
    throw new AppError("userId is required.", 400);
  }

  const result = await service.getSectorListWithMappingService({ userId });

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch sector list.", 500);
  }

  return ok(res, {
    message: "Sector list fetched successfully.",
    userId,
    rowCount: result.rowCount,
    data: result.rows,
  });
});

// ============================================================
// SAVE SECTOR MAPPING
// POST /api/FrmTownPlanningSectorMapping/save-mapping
// Body: { userId, sectorIds: [1, 2, 3] }
// ============================================================
const saveSectorMapping = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Save Sector Mapping");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const { userId, sectorIds } = req.body;

  if (!userId) {
    throw new AppError("userId is required.", 400);
  }

  const result = await service.saveSectorMappingService({ userId, sectorIds });

  if (!result.success) {
    throw new AppError(result.error || "Failed to save sector mapping.", 500);
  }

  return ok(res, {
    message: "Sector mapping saved successfully.",
    userId,
    deletedRows: result.deletedRows,
    insertedRows: result.insertedRows,
  });
});

module.exports = {
  getUserList,
  getSectorListWithMapping,
  saveSectorMapping,
};
