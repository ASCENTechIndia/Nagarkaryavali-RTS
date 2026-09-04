const repo = require("./frmTradeCategoryConfig.repo");

// ============================================================
// GET TRADE CATEGORY CONFIG LIST
// ============================================================
const getTradeCategoryConfigListService = async () => {
  const result = await repo.getTradeCategoryConfigListRepo();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch trade category config list.");
  }

  return {
    success:  true,
    rows:     result.rows,
    rowCount: result.rows.length,
  };
};

// ============================================================
// GET BUSINESS CATEGORY LIST (dropdown)
// ============================================================
const getBusinessCategoryListService = async () => {
  const result = await repo.getBusinessCategoryListRepo();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch business category list.");
  }

  return {
    success:  true,
    rows:     result.rows,
    rowCount: result.rows.length,
  };
};

// ============================================================
// SAVE TRADE CATEGORY CONFIG (Add or Edit)
// ============================================================
const saveTradeCategoryConfigService = async ({
  tradeCatId,
  businessCategoryId,
  type,
  inflammable,
  status,
  mode,
}) => {
  if (!businessCategoryId) {
    throw new Error("businessCategoryId is required.");
  }

  if (!type) {
    throw new Error("type is required.");
  }

  const result = await repo.saveTradeCategoryConfigRepo({
    tradeCatId,
    businessCategoryId,
    type,
    inflammable: inflammable || "Yes",
    status:      status      || "Yes",
    mode:        mode        || "1",
  });

  if (!result.success) {
    throw new Error(result.error || "Failed to save trade category config.");
  }

  return {
    success:      true,
    rowsAffected: result.rowsAffected,
    operation:    result.operation,
  };
};

module.exports = {
  getTradeCategoryConfigListService,
  getBusinessCategoryListService,
  saveTradeCategoryConfigService,
};
