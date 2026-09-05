const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmFirstAppealAuthoRpt.controller");


router.post("/appeal-report", controller.getAppealReport);

router.post("/appeal-report-pdf", controller.generateAppealReportPDF);

module.exports = router;
