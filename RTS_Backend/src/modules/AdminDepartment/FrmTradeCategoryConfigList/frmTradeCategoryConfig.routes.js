const express    = require("express");
const router     = express.Router();
const controller = require("./frmTradeCategoryConfig.controller");
const auth       = require("../../../middlewares/auth.middleware");

router.get("/list", auth(), controller.getTradeCategoryConfigList);

router.get("/business-category-list", auth(), controller.getBusinessCategoryList);

router.post("/save", auth(), controller.saveTradeCategoryConfig);

module.exports = router;
