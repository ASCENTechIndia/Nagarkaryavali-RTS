const express = require("express");
const router = express.Router();
const controller = require("./frmTradeCtgryTypeCnfgList.controller");

// FrmTradeCtgryTypeCnfgList Routes

router.post("/list",controller.getTradeTypeConfigList);

router.post("/categories",controller.getTradeCategories);

router.post("/category-types",controller.getCategoryTypeConfig);

router.post("/trade-types",controller.getTradeTypes);

router.post("/tradetype-config-save",controller.saveTradeTypeConfig);

// FrmTradeCtgryList Routes

router.post("/tradecategorylist",controller.getTradeCategoriesConfig);

router.post("/tradecategoryby-id",controller.getTradeCategoryById);

router.post("/trade-category-save",controller.saveTradeCategory);

module.exports = router;