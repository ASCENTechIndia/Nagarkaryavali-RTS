const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmChallanGenReport.controller");

router.post("/prabhag-list", auth(), controller.getPrabhagList);
router.post("/department-list", auth(), controller.getDepartmentList);
router.post("/generate-report", auth(), controller.generateChallanReport);
router.post("/generate-pdf", auth(), controller.generateChallanReportPDF);

module.exports = router;
