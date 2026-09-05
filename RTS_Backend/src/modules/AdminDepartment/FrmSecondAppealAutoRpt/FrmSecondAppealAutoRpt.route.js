const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmSecondAppealAutoRpt.controller");

router.post("/second-appeal-report", controller.getSecondAppealReport);

router.post("/second-appeal-report-pdf", controller.generateSecondAppealReportPDF);

module.exports = router;
