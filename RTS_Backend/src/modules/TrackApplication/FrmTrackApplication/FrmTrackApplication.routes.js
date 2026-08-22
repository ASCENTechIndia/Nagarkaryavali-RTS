const express = require("express");
const router = express.Router();

const controller = require("./FrmTrackApplication.controller");
const auth = require("../../../middlewares/auth.middleware");


router.post("/getapplicationdetails", auth(), controller.getApplicationDetails);

router.post("/getapplicationdocuments", auth(), controller.getApplicationDocuments);

router.post("/getappealdetails", auth(), controller.getAppealDetails);

router.post("/getapplicationcertificate", auth(), controller.getApplicationCertificate);

router.post("/getpaymentflag", auth(), controller.getPaymentFlag);

router.post("/checkpayment", auth(), controller.checkPayment);

router.post("/getapplicationpaymentdetails", auth(), controller.getApplicationPaymentDetails);

router.post("/getapplicationsteps", auth(), controller.getApplicationSteps);

router.post("/getcertificatedata", auth(), controller.getCertificateData);

router.post("/getreapplyservicedetails", auth(), controller.getReApplyServiceDetails);

module.exports = router;
