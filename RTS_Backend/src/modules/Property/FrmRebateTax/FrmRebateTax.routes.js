const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmRebateTax.controller");

router.post(
  "/rebate-types",
  auth(),
  controller.getRebateTypes
);

router.post(
  "/tax-names",
  auth(),
  controller.getTaxNames
);

router.post(
  "/submit",
  auth(),
  controller.submitApplication
);

module.exports = router;