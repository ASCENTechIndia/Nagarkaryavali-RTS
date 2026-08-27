const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

const controller = require("./FrmFirstAppealDocUpload.controller");

router.get("/appeal-types", controller.getAppealTypes);

router.post("/appeal-authority-details", controller.getAppealAuthorityDetails);

router.post("/application-details", controller.getApplicationDetails);

router.post("/upload-appeal-document", upload.single("document"),controller.uploadAppealDocument );

router.post("/submit-appeal", controller.submitAppeal);

module.exports = router;
