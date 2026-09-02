const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const upload = require("../../../middlewares/upload.middleware");
const controller = require("./FrmWaterAppliEntry.controller");

router.post("/zones", auth(), controller.getZones);
router.post("/connection-types", auth(), controller.getConnectionTypes);
router.post("/connection-sizes", auth(), controller.getConnectionSizes);
router.post("/usage-types", auth(), controller.getUsageTypes);
router.post("/usage-subtypes", auth(), controller.getUsageSubTypes);
router.post("/connection-statuses", auth(), controller.getConnectionStatuses);
router.post("/business-certificates", auth(), controller.getBusinessCertificates);

router.post("/document-definitions", auth(), controller.getDocumentDefinitions);
router.post(
  "/upload-document",
  auth(),
  upload.single("document"),
  controller.uploadDocument
);

router.post("/submit", controller.submitApplication);
router.post("/application-details", auth(), controller.getApplicationDetails);

router.post("/payment-flag", auth(), controller.getServicePaymentFlag);
router.post("/check-payment", controller.checkPayment);

module.exports = router;