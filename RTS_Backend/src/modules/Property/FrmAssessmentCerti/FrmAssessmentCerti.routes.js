const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const upload = require("../../../middlewares/upload.middleware");
const controller = require("./FrmAssessmentCerti.controller");

router.post(
  "/documents",
  // auth(),
  controller.getDocumentDefinitions
);

router.post(
  "/payment-flag",
  // auth(),
  controller.getServicePaymentFlag
);

router.post(
  "/maha-service-id",
  // auth(),
  controller.getMahaServiceId
);

router.post(
  "/upload-document",
  // auth(),
  upload.single("document"),
  controller.uploadDocument
);

router.post(
  "/submit",
  // auth(),
  controller.submitApplication
);

router.post(
  "/check-payment",
  // auth(),
  controller.checkPayment
);

router.post(
  "/maha-online-first-step",
  // auth(),
  controller.insertMahaOnlineFirstStep
);

module.exports = router;