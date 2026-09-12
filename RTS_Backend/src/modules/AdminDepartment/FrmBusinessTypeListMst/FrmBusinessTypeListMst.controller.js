const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./FrmBusinessTypeListMst.service");

const getBusinessTypeById = asyncHandler(async (req, res) => {
  const { bustypId } = req.body;
  const data = await service.getBusinessTypeByIdService(bustypId);
  return ok(res, data);
});

const getAllBusinessTypes = asyncHandler(async (req, res) => {
     const { ulbid } = req.body;
  const data = await service.getAllBusinessTypesService(ulbid);
  return ok(res, data);
});

const manageBusinessType = asyncHandler(async (req, res) => {
  const payload = req.body;
  const result = await service.manageBusinessTypeService(payload);

  return ok(res, result);
});

module.exports = { getBusinessTypeById, getAllBusinessTypes, manageBusinessType };
