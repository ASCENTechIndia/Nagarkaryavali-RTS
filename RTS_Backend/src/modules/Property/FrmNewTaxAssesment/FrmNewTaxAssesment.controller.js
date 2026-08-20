const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./FrmNewTaxAssesment.service");

const createNewTaxAsses = asyncHandler(async (req, res) => {
  const data = await service.submitNewTaxAssessmentService(req.body);
  return ok(res, data);
});

const getWardsByUlb = asyncHandler(async (req, res) => {
  const { ulbid } = req.body;
  const data = await service.getWardsByUlbService(ulbid);
  return ok(res, data);
});

module.exports = { createNewTaxAsses, getWardsByUlb };
