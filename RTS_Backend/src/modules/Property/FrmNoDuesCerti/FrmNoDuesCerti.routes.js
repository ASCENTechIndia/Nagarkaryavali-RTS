const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmNoDuesCerti.controller");

router.post(
  "/property-details",
  // auth(),
  controller.getPropertyDetails
)

router.post(
  "/submit",
  // auth(),
  controller.submitApplication
);

module.exports = router;