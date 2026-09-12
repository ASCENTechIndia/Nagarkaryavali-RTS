const express = require("express");
const router = express.Router();
const controller = require("./frmTradeCtgryTypeCnfgList.controller");
const auth = require("../../../middlewares/auth.middleware");


router.post("/list", auth(), controller.getTradeTypeConfigList);

router.post("/categories", auth(), controller.getTradeCategories);

router.post("/category-types", auth(), controller.getCategoryTypeConfig);

router.post("/trade-types",auth(), controller.getTradeTypes);

router.post("/tradetype-config-save", auth(), controller.saveTradeTypeConfig);

router.post("/tradecategorylist",auth(), controller.getTradeCategoriesConfig);

router.post("/tradecategoryby-id",auth(), controller.getTradeCategoryById);

router.post("/trade-category-save",auth(), controller.saveTradeCategory);

module.exports = router;