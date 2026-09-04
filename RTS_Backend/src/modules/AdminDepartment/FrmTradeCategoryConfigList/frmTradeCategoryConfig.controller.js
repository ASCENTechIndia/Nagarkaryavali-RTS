const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");

const service = require("./frmTradeCategoryConfig.service");

// ============================================================
// GET TRADE CATEGORY CONFIG LIST
// GET /api/FrmTradeCategoryConfig/list
// ============================================================
const getTradeCategoryConfigList = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get Trade Category Config List");
  console.log("================================================");

  const result = await service.getTradeCategoryConfigListService();

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch list.", 500);
  }

  return ok(res, {
    message:  "Trade category config list fetched successfully.",
    rowCount: result.rowCount,
    data:     result.rows,
  });
});

// ============================================================
// GET BUSINESS CATEGORY LIST  (for dropdown in master form)
// GET /api/FrmTradeCategoryConfig/business-category-list
// ============================================================
const getBusinessCategoryList = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get Business Category List");
  console.log("================================================");

  const result = await service.getBusinessCategoryListService();

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch business category list.", 500);
  }

  return ok(res, {
    message:  "Business category list fetched successfully.",
    rowCount: result.rowCount,
    data:     result.rows,
  });
});

// ============================================================
// SAVE TRADE CATEGORY CONFIG  (Add New or Edit)
// POST /api/FrmTradeCategoryConfig/save
// Body: { businessCategoryId, type, inflammable, status, tradeCatId? }
// ============================================================
const saveTradeCategoryConfig = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Save Trade Category Config");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const {
    tradeCatId,
    businessCategoryId,
    type,
    inflammable,
    status,
  } = req.body;

  if (!businessCategoryId) {
    throw new AppError("businessCategoryId is required.", 400);
  }

  if (!type) {
    throw new AppError("type is required.", 400);
  }

  // mode "2" = Edit (tradeCatId present), mode "1" = Add
  const mode = tradeCatId ? "2" : "1";

  const result = await service.saveTradeCategoryConfigService({
    tradeCatId,
    businessCategoryId,
    type,
    inflammable: inflammable || "Yes",
    status:      status      || "Yes",
    mode,
  });

  if (!result.success) {
    throw new AppError(result.error || "Failed to save trade category config.", 500);
  }

  return ok(res, {
    message:      result.operation === "UPDATE"
      ? "Trade category updated successfully."
      : "Trade category added successfully.",
    operation:    result.operation,
    rowsAffected: result.rowsAffected,
  });
});

module.exports = {
  getTradeCategoryConfigList,
  getBusinessCategoryList,
  saveTradeCategoryConfig,
};
