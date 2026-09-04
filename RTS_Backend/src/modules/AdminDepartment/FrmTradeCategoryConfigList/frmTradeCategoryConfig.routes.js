const express    = require("express");
const router     = express.Router();
const controller = require("./frmTradeCategoryConfig.controller");
const auth       = require("../../../middlewares/auth.middleware");

// GET  /api/FrmTradeCategoryConfig/list
router.get("/list", auth(), controller.getTradeCategoryConfigList);

// GET  /api/FrmTradeCategoryConfig/business-category-list
router.get("/business-category-list", auth(), controller.getBusinessCategoryList);

// POST /api/FrmTradeCategoryConfig/save
router.post("/save", auth(), controller.saveTradeCategoryConfig);

module.exports = router;
