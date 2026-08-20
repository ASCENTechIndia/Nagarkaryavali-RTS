const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./FrmPropertyAppel.service");

const createPropAppeal = asyncHandler(async (req, res) => {
  const data = await service.submitPropAppealService(req.body);
  return ok(res, data);
});

module.exports = { createPropAppeal };
