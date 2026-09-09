const express = require("express");
const controller = require("./FrmRTSOnlineColl.controller");
const auth = require("../../../middlewares/auth.middleware");

const router = express.Router();


router.get("/departments", auth(), controller.getDepartments);

router.post("/applications-summary", auth(), controller.getApplicationsSummary);

router.post("/applications-detail", auth(), controller.getApplicationsDetail);

router.post(
  "/generate-applications-detail-pdf", auth(),
  controller.generateApplicationsDetailPDF
);

module.exports = router;
