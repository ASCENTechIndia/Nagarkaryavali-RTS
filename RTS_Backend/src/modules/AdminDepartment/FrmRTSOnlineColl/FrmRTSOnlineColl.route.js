const express = require("express");
const controller = require("./FrmRTSOnlineColl.controller");

const router = express.Router();


router.get("/departments", controller.getDepartments);

router.post("/applications-summary", controller.getApplicationsSummary);

router.post("/applications-detail", controller.getApplicationsDetail);

router.post(
  "/generate-applications-detail-pdf",
  controller.generateApplicationsDetailPDF
);

module.exports = router;
