const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");
const service = require("./FrmNOCHordingType.service");

const getNOCHordingTypeList = asyncHandler(async (req, res) => {
  const { ulbId } = req.body;

  if (!ulbId) {
    throw new AppError("ulbId is required", 400);
  }

  const result = await service.getNOCHordingTypeListService({ ulbId });

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get NOC Hording Type List.",
      500
    );
  }

  return ok(res, result, "NOC Hording Type List fetched successfully");
});

const getNOCHordingTypeById = asyncHandler(async (req, res) => {
  const { hordId } = req.body;

  if (!hordId) {
    throw new AppError("hordId is required", 400);
  }

  const result = await service.getNOCHordingTypeByIdService(hordId);

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get NOC hording type by id.",
      500
    );
  }

  return ok(res, result, "NOC hording type by id fetched successfully");
});

const saveNOCHordingType = asyncHandler(async (req, res) => {
  const {
    userId,
    hordingTypeId,
    name,
    ulbId,
    mode,
    ipAddress,
    ipSource,
  } = req.body;

  if (!userId) {
    throw new AppError("userId is required", 400);
  }

  if (!name) {
    throw new AppError("name is required", 400);
  }

  if (!ulbId) {
    throw new AppError("ulbId is required", 400);
  }

  if (mode === undefined || mode === null) {
    throw new AppError("mode is required", 400);
  }

  if (![1, 2, 3].includes(Number(mode))) {
    throw new AppError("mode must be 1, 2 or 3", 400);
  }

  if (Number(mode) !== 1 && !hordingTypeId) {
    throw new AppError(
      "hordingTypeId is required for update / delete",
      400
    );
  }

  const result = await service.saveNOCHordingTypeService({
    userId,
    hordingTypeId,
    name,
    ulbId,
    mode: Number(mode),
    ipAddress: ipAddress || "",
    ipSource: ipSource || "",
  });

  if (!result.success) {
    throw new AppError(
      result.errorMsg || "Failed to save NOC hording type.",
      500
    );
  }

  return ok(
    res,
    {
      status: "SUCCESS",
      errorCode: result.errorCode,
      message: result.errorMsg || "NOC hording type saved successfully.",
      data: result,
    },
    result.errorMsg || "NOC hording type saved successfully."
  );
});

module.exports = {
  getNOCHordingTypeList,
  getNOCHordingTypeById,
  saveNOCHordingType,
};