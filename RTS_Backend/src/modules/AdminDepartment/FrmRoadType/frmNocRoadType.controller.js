const asyncHandler = require("../../../libs/asyncHandler");
const { ok }        = require("../../../libs/response");
const { AppError }  = require("../../../libs/errors");

const service = require("./frmNocRoadType.service");

const getNocRoadTypeList = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get NOC Road Type List");
  console.log("================================================");

  const result = await service.getNocRoadTypeListService();

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch NOC road type list.", 500);
  }

  return ok(res, {
    message:  "NOC road type list fetched successfully.",
    rowCount: result.rowCount,
    rows:     result.rows,
  });
});


const saveNocRoadType = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Save NOC Road Type");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const {
    userId,
    roadTypeId,
    roadTypeName,
    ulbId,
    mode,
    ipAddress,
    ipSource,
  } = req.body;

  if (!userId) {
    throw new AppError("userId is required.", 400);
  }

  if (!roadTypeName || !String(roadTypeName).trim()) {
    throw new AppError("roadTypeName is required.", 400);
  }

  if (!ulbId) {
    throw new AppError("ulbId is required.", 400);
  }

  if (!mode) {
    throw new AppError("mode is required (1=Insert, 2=Update, 3=Delete).", 400);
  }

  const result = await service.saveNocRoadTypeService({
    userId:       String(userId),
    roadTypeId:   Number(roadTypeId || 0),
    roadTypeName: String(roadTypeName).trim(),
    ulbId:        Number(ulbId),
    mode:         Number(mode),
    ipAddress:    ipAddress  || req.ip || "127.0.0.1",
    ipSource:     ipSource   || "WEB",
  });

  if (!result.success) {
    throw new AppError(result.message || "Failed to save NOC road type.", 400);
  }

  return ok(res, {
    message:   result.message,
    operation: result.operation,
    errCode:   result.errCode,
  });
});

module.exports = {
  getNocRoadTypeList,
  saveNocRoadType,
};
