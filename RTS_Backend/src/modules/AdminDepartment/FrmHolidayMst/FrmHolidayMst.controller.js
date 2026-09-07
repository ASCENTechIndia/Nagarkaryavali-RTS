const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");
const service = require("./FrmHolidayMst.service");

const saveHoliday = asyncHandler(async (req, res) => {
  const {
    Userid,
    Str,
    Ulbid
  } = req.body;

  if (!Userid) {
    throw new AppError("Userid is required", 400);
  }

  if (!Str) {
    throw new AppError("Str (holiday dates) is required", 400);
  }

  if (!Ulbid) {
    throw new AppError("Ulbid is required", 400);
  }

  const result = await service.saveHolidayService({
    Userid,
    Str,
    Ulbid
  });

  if (!result.success) {
    throw new AppError(
      result.ErrMsg || "Failed to save holiday.",
      500
    );
  }

  let customMessage = result.ErrMsg || "Holiday(s) saved successfully";
  
  if (result.ErrCode === 9999) {
    customMessage = "Holiday(s) saved successfully";
  } else if (result.ErrCode === -120) {
    customMessage = "Date already exists as a holiday";
  } else if (result.ErrCode === -110) {
    customMessage = "Invalid input parameters";
  }

  return ok(res, {
    status: "SUCCESS",
    message: customMessage,
    ErrCode: result.ErrCode,
    data: result,
  });
});

module.exports = {
  saveHoliday
};