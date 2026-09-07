const service = require("./FrmHearingDateAssign.service");
const asyncHandler = require("../../../libs/asyncHandler");

const getHearingProcessList = asyncHandler(async (req, res) => {
  const result = await service.getHearingProcessListService();

  if (!result || result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      status: "FAILED",
      message: "Record Not Found",
      data: [],
      rowCount: 0,
    });
  }

  return res.json({
    success: true,
    status: "SUCCESS",
    message: "Hearing process list fetched successfully.",
    data: result.rows,
    rowCount: result.rowCount,
  });
});

const assignHearingDate = asyncHandler(async (req, res) => {
  const { userId, ulbId, in_str } = req.body;

  const result = await service.assignHearingDateService({
    userId,
    ulbId,
    in_str,
  });

  if (Number(result.errCode) === 9999) {
    return res.json({
      success: true,
      status: "SUCCESS",
      message: result.errMsg,
      errCode: result.errCode,
    });
  }

  return res.status(400).json({
    success: false,
    status: "FAILED",
    message: `${result.errCode}: ${result.errMsg}`,
    errCode: result.errCode,
  });
});

module.exports = {
  getHearingProcessList,
  assignHearingDate,
};
