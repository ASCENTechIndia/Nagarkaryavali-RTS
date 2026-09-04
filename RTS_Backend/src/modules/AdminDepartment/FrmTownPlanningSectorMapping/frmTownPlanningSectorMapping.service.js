const repo = require("./frmTownPlanningSectorMapping.repo");

// ============================================================
// GET USER LIST
// ============================================================
const getUserListService = async () => {
  const result = await repo.getUserListRepo();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch user list.");
  }

  return {
    success: true,
    rows: result.rows,
    rowCount: result.rows.length,
  };
};

// ============================================================
// GET SECTOR LIST WITH MAPPING FLAG
// ============================================================
const getSectorListWithMappingService = async ({ userId }) => {
  if (!userId) {
    throw new Error("userId is required.");
  }

  const result = await repo.getSectorListWithMappingRepo({ userId });

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch sector list.");
  }

  return {
    success: true,
    rows: result.rows,
    rowCount: result.rows.length,
  };
};

// ============================================================
// SAVE SECTOR MAPPING
// ============================================================
const saveSectorMappingService = async ({ userId, sectorIds }) => {
  if (!userId) {
    throw new Error("userId is required.");
  }

  // sectorIds can be empty array (means all unmapped)
  const ids = Array.isArray(sectorIds) ? sectorIds : [];

  const result = await repo.saveSectorMappingRepo({ userId, sectorIds: ids });

  if (!result.success) {
    throw new Error(result.error || "Failed to save sector mapping.");
  }

  return {
    success: true,
    deletedRows: result.deletedRows,
    insertedRows: result.insertedRows,
  };
};

module.exports = {
  getUserListService,
  getSectorListWithMappingService,
  saveSectorMappingService,
};
