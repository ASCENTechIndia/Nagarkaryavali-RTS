const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./FrmTradeCtgrytypListMst.service");

const getTradeTypesByUlb = asyncHandler(async (req, res) => {
  const { ulbid } = req.body;
  const data = await service.getTradeTypesByUlbService(ulbid);
  return ok(res, data);
});

const getTradeCategories = asyncHandler(async (req, res) => {
  const data = await service.getTradeCategoriesService();
  return ok(res, data);
});

const getTradeTypeDetail = asyncHandler(async (req, res) => {
  const { tradeTypeId, tradeCategoryId, ulbid } = req.body;
  const data = await service.getTradeTypeDetailService({ tradeTypeId, tradeCategoryId, ulbid });
  return ok(res, data);
});

const insertOrUpdateTradeCategoryType = asyncHandler(async (req, res) => {
  const payload = req.body;
  const data = await service.insertOrUpdateTradeCategoryTypeService(payload);
  return ok(res, data);
});

module.exports = { getTradeTypesByUlb, getTradeTypeDetail,  getTradeCategories  , insertOrUpdateTradeCategoryType };
