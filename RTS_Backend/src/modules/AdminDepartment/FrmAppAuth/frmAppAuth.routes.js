const express = require("express");
const router = express.Router();
const controller = require("./frmAppAuth.controller");
const upload = require("../../../middlewares/upload.middleware");
const auth = require("../../../middlewares/auth.middleware");

router.post("/user-prabhag", auth(), controller.getUserPrabhagList);
router.post("/user-department", auth(), controller.getUserDeptList);
router.post("/user-sector", auth(), controller.getUserSectorList);
router.post("/application-list", auth(), controller.getApplicationAuthList);
router.post("/hod-clerk-list", auth(), controller.getHodClerkList);
router.post("/application-details", auth(), controller.getApplicationDetails);
router.post("/application-auth", auth(), controller.applicationAuth);
router.post("/application-verification-document", auth(), upload.single("document"),controller.saveApplicationVerificationDocument);
router.post("/menu-details", auth(), controller.getMenuDetails);
router.post("/certificate-preview", auth(), controller.certificatePreview);
router.post("/trade-certificate", auth(), controller.tradeCertificate);
router.post("/update-document-flag", auth(), controller.updateDocumentFlag);

module.exports = router;
