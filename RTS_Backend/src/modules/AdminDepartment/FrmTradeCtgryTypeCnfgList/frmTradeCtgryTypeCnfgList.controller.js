const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");
const service = require("./frmTradeCtgryTypeCnfgList.service");



const getTradeTypeConfigList = asyncHandler(async (req, res) => {

  const result = await service.getTradeTypeConfigListService();

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get trade type configuration.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Trade type configuration fetched successfully.",
    rowCount: result.rowCount,
    data: result.rows,
  });
});

const getTradeCategories = asyncHandler(async (req, res) => {

  const result = await service.getTradeCategoriesService();

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get trade categories.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Trade categories fetched successfully.",
    rowCount: result.rowCount,
    data: result.rows,
  });
});

const getCategoryTypeConfig = asyncHandler(async (req, res) => {

  const {
    categoryId,
    categoryTypeId,
  } = req.body;

  if (!categoryId) {
    throw new AppError("categoryId is required", 400);
  }

  if (!categoryTypeId) {
    throw new AppError("categoryTypeId is required", 400);
  }

  const result = await service.getCategoryTypeConfigService({
    categoryId,
    categoryTypeId,
  });

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get category type configuration.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Category type configuration fetched successfully.",
    categoryId,
    categoryTypeId,
    rowCount: result.rowCount,
    data: result.rows,
  });
});

const getTradeTypes = asyncHandler(async (req, res) => {

  const {
    categoryId,
  } = req.body;

  if (!categoryId) {
    throw new AppError("categoryId is required", 400);
  }

  const result = await service.getTradeTypesService(categoryId);

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get trade types.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Trade types fetched successfully.",
    categoryId,
    rowCount: result.rowCount,
    data: result.rows,
  });
});

const saveTradeTypeConfig = asyncHandler(async (req, res) => {

  const {
    userId,
    categoryTradeId,
    tradeTypeId,
    type,
    jwalan,
    status,
    mode,
  } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (!categoryTradeId) {
    throw new AppError("categoryTradeId is required", 400);
  }

  if (!tradeTypeId) {
    throw new AppError("tradeTypeId is required", 400);
  }

  if (mode === undefined || mode === null) {
    throw new AppError("mode is required", 400);
  }

  if (![1, 2].includes(Number(mode))) {
    throw new AppError("mode must be 1 or 2", 400);
  }

  if (!type) {
    throw new AppError("type is required", 400);
  }

  if (!status) {
    throw new AppError("status is required", 400);
  }

  const result = await service.saveTradeTypeConfigService({
    userId,
    categoryTradeId,
    tradeTypeId,
    type,
    jwalan: jwalan || "",
    status,
    mode: Number(mode),
  });

  if (!result.success) {
    throw new AppError(
      result.errorMsg || "Failed to save trade type configuration.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: result.errorMsg || "Trade type configuration saved successfully.",
    errorCode: result.errorCode,
    data: result,
  });
});

const getTradeCategoriesConfig = asyncHandler(async (req, res) => {
  const { ulbId } = req.body;

  if (!ulbId) {
    throw new AppError("ulbId is required", 400);
  }

  const result = await service.getTradeCategoriesConfigService(ulbId);

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get trade categories.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Trade categories fetched successfully.",
    ulbId,
    rowCount: result.rowCount,
    data: result.rows,
  });
});

const getTradeCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;

  if (!categoryId) {
    throw new AppError("categoryId is required", 400);
  }

  const result = await service.getTradeCategoryByIdService(categoryId);

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get trade category.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message: "Trade category fetched successfully.",
    categoryId,
    rowCount: result.rowCount,
    data: result.rows,
  });
});

const saveTradeCategory = asyncHandler(async (req, res) => {
  const {
    userId,
    categoryTradeId,
    category,
    status,
    ulbId,
    mode,
  } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (mode === undefined || mode === null) {
    throw new AppError("mode is required", 400);
  }

  if (![1, 2].includes(Number(mode))) {
    throw new AppError("mode must be 1 or 2", 400);
  }

  if (!category) {
    throw new AppError("category is required", 400);
  }

  if (!status) {
    throw new AppError("status is required", 400);
  }

  if (!ulbId) {
    throw new AppError("ulbId is required", 400);
  }

  if (Number(mode) === 2 && !categoryTradeId) {
    throw new AppError(
      "categoryTradeId is required for update",
      400
    );
  }

  const result = await service.saveTradeCategoryService({
    userId,
    categoryTradeId,
    category,
    status,
    ulbId,
    mode: Number(mode),
  });

  if (!result.success) {
    throw new AppError(
      result.errorMsg || "Failed to save trade category.",
      500
    );
  }

  return ok(res, {
    status: "SUCCESS",
    message:
      result.errorMsg ||
      "Trade category saved successfully.",
    errorCode: result.errorCode,
    data: result,
  });
});
module.exports = {

  getTradeTypeConfigList,
  getTradeCategories,
  getCategoryTypeConfig,
  getTradeTypes,
  saveTradeTypeConfig,
  getTradeCategoriesConfig,
  getTradeCategoryById,
  saveTradeCategory,
};