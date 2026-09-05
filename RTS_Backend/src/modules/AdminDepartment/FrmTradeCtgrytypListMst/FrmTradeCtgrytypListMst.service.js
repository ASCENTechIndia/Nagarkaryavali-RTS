const repo = require("./FrmTradeCtgrytypListMst.repo");

async function getTradeTypesByUlbService(ulbid) {
  if (!ulbid) throw new Error("ULBID is required", 400);

  const rows = await repo.fetchTradeTypesByUlb(ulbid);

  if (!rows || rows.length === 0) {
    return { success: true, tradeTypes: [] };
  }

  return {
    success: true,
    tradeTypes: rows.map((r) => ({
      tradeTypeId: r.TRADETYPEID,
      tradeTypeName: r.TRADETYPENM,
      ulbId: r.ULBID,
      tradeCategoryId: r.TRADECATEGORYID,
      tradeCategoryName: r.TRADECATEGORYNM,
      status: r.STATUS,
    })),
  };
}

async function getTradeCategoriesService() {
  const rows = await repo.fetchTradeCategories();
  return {
    success: true,
    categories: rows.map((r) => ({
      tradeCategoryId: r.NUM_TRADECATEGORY_ID,
      tradeCategoryName: r.VAR_TRADECATEGORY_NAME,
    })),
  };
}

async function getTradeTypeDetailService({
  tradeTypeId,
  tradeCategoryId,
  ulbid,
}) {
  if (!tradeTypeId || !tradeCategoryId || !ulbid) {
    throw new AppError(
      "tradeTypeId, tradeCategoryId and ulbid are required",
      400,
    );
  }

  const rows = await repo.fetchTradeTypeDetail({
    tradeTypeId,
    tradeCategoryId,
    ulbid,
  });
  return {
    success: true,
    details: rows.map((r) => ({
      tradeCategoryName: r.TRADECATEGORYNM,
      tradeCategoryId: r.TRADECATEGORYID,
      status: r.STATUS,
    })),
  };
}

async function insertOrUpdateTradeCategoryTypeService(payload) {
  const outBinds = await repo.executeTradeCategoryTypeProcedure(payload);

  return {
    success: Number(outBinds.out_errcode) === -100,
    errorCode: outBinds.out_errcode,
    message: outBinds.out_ErrMsg
  };
}


module.exports = {
  getTradeTypesByUlbService,
  getTradeCategoriesService,
  getTradeTypeDetailService,
  insertOrUpdateTradeCategoryTypeService,
};
