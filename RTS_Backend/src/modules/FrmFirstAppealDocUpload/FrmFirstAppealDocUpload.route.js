const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

const controller = require("./FrmFirstAppealDocUpload.controller");

router.get("/appeal-types",auth(), controller.getAppealTypes);

router.post("/appeal-authority-details", auth(), controller.getAppealAuthorityDetails);

router.post("/application-details", auth(), controller.getApplicationDetails);

router.post("/upload-appeal-document", upload.single("document"),controller.uploadAppealDocument );

router.post("/submit-appeal", auth(), controller.submitAppeal);

module.exports = router;
