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

router.post("/getcertificatedoc", auth(), controller.getCertificateDoc);

router.post("/insertcertificatedoc", auth(), controller.insertCertificateDoc);

router.post("/updatecertificatestatus", auth(), controller.updateCertificateStatus);

router.post("/downloaddocumentbyid", auth(), controller.downloadDocumentById);

router.post("/generateanddownloadcertificate", auth(), controller.generateAndDownloadCertificate);

router.post("/downloadcertificate", auth(), controller.generateAndDownloadCertificate);

module.exports = router;
