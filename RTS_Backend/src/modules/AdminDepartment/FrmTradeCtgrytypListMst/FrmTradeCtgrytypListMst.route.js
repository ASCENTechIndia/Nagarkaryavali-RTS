const express = require("express");
const router = express.Router();
const controller = require("./FrmTradeCtgrytypListMst.controller");
const auth = require("../../../middlewares/auth.middleware");

router.post("/trade-types", auth(), controller.getTradeTypesByUlb);

router.get("/trade-categories", auth(), controller.getTradeCategories);

router.post("/trade-type-detail", auth(), controller.getTradeTypeDetail);

router.post("/trade-category-type", auth(), controller.insertOrUpdateTradeCategoryType);

module.exports = router;
