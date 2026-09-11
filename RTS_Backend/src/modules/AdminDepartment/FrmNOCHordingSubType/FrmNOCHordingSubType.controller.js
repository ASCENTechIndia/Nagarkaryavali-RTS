const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");
const service = require("./FrmNOCHordingSubType.service");

const getNOCHordingSubTypeList = asyncHandler(async (req, res) => {
  const { ulbId } = req.body;

  if (!ulbId) {
    throw new AppError("ulbId is required", 400);
  }

  const result = await service.getNOCHordingSubTypeListService({ ulbId });

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get NOC Hording Sub Type List.",
      500
    );
  }

  return ok(res, result, "NOC Hording Sub Type List fetched successfully");
});

const getNOCHordingSubTypeById = asyncHandler(async (req, res) => {
  const { subTypeId } = req.body;

  if (!subTypeId) {
    throw new AppError("subTypeId is required", 400);
  }

  const result = await service.getNOCHordingSubTypeByIdService(subTypeId);

  if (!result.success) {
    throw new AppError(
      result.error || "Failed to get NOC hording sub type by id.",
      500
    );
  }

  return ok(res, result, "NOC hording sub type by id fetched successfully");
});

const saveNOCHordingSubType = asyncHandler(async (req, res) => {
  const {
    userId,
    subTypeId,
    hordId,
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

  if (!hordId) {
    throw new AppError("hordId is required", 400);
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

  if (Number(mode) !== 1 && !subTypeId) {
    throw new AppError(
      "subTypeId is required for update / delete",
      400
    );
  }

  const result = await service.saveNOCHordingSubTypeService({
    userId,
    subTypeId,
    hordId,
    name,
    ulbId,
    mode: Number(mode),
    ipAddress: ipAddress || "",
    ipSource: ipSource || "",
  });

  if (!result.success) {
    throw new AppError(
      result.errorMsg || "Failed to save NOC hording sub type.",
      500
    );
  }

  return ok(
    res,
    {
      status: "SUCCESS",
      errorCode: result.errorCode,
      message: result.errorMsg || "NOC hording sub type saved successfully.",
      data: result,
    },
    result.errorMsg || "NOC hording sub type saved successfully."
  );
});

module.exports = {
  getNOCHordingSubTypeList,
  getNOCHordingSubTypeById,
  saveNOCHordingSubType,
};