const express = require("express");
const router = express.Router();
const controller = require("./FrmAppliFee.controller");
const auth = require("../../../middlewares/auth.middleware");

router.get("/property-details", auth(), controller.getPropertyDetailsController);
router.get("/property-assessment", auth(), controller.getPropertyAssessmentController);
router.get("/applicant-details", auth(), controller.getApplicantDetailsController);
router.get("/application-details", auth(), controller.getApplicationDetailsController);
router.get("/application-source", auth(), controller.getApplicationSourceController);
router.get("/user-details", auth(), controller.getUserDetailsController);
router.get("/maha-user-details", auth(), controller.getMahaUserDetailsController);
router.post("/payment-session", auth(), controller.paymentSessionController);

module.exports = router;