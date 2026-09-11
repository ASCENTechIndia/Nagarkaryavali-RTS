const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");
const service = require("./FrmNOCHordingType.service");

const getNOCHordingTypeList = asyncHandler(async (req, res) => {

  const {
    ulbId
  } = req.body;

  if (!ulbId) {
    throw new AppError("categoryId is required", 400);
  }

  const result = await service.getNOCHordingTypeListService({
    ulbId
  });

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get NOC Hording Type List.",
      500
    );
  }

  return ok(res, result, "NOC Hording Type List fetched successfully");
});

const getNOCHordingTypeById = asyncHandler(async (req, res) => {

  const {
    hordId,
  } = req.body;

  if (!hordId) {
    throw new AppError("hordId is required", 400);
  }

  const result = await service.getNOCHordingTypeByIdService(hordId);

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get noc hording type by id.",
      500
    );
  }

   return ok(res, result, "NOC hording type by id fetched successfully");
});

const saveNOCHordingType = asyncHandler(async (req, res) => {

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

  const result = await service.saveNOCHordingTypeService({
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

module.exports = {
    getNOCHordingTypeList,
    getNOCHordingTypeById,
    saveNOCHordingType
};