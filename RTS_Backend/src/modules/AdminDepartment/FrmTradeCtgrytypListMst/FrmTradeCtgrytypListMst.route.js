const express = require("express");
const router = express.Router();
const controller = require("./FrmTradeCtgrytypListMst.controller");


router.post("/trade-types", controller.getTradeTypesByUlb);

router.get("/trade-categories", controller.getTradeCategories);

router.post("/trade-type-detail", controller.getTradeTypeDetail);

router.post("/trade-category-type", controller.insertOrUpdateTradeCategoryType);

module.exports = router;
