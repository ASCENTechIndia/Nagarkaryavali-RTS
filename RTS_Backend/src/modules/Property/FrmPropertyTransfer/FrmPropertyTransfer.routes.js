const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmPropertyTransfer.controller");

router.post(
  "/transfer-types",
  // auth(),
  controller.getTransferTypes
);

router.post(
  "/submit",
  // auth(),
  controller.submitApplication
);

router.post(
  "/get-application",
  // auth(),
  controller.getPropertyTransferApplication
);

router.post(
  "/transfer-rate-config",
  // auth(),
  controller.getTransferRateConfig
);

module.exports = router;