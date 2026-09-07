const express = require("express");
const router = express.Router();
const controller = require("./FrmChallanGen.controller");
const auth = require("../../../middlewares/auth.middleware");

router.get("/ward-dropdown", auth(), controller.getWardDropdownController);
router.get("/department-dropdown", auth(), controller.getDepartmentDropdownController);
router.post("/generate-challan", auth(), controller.generateChallanController);

module.exports = router;