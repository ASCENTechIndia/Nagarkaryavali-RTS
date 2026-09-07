const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const upload = require("../../../middlewares/upload.middleware");
const controller = require("./FrmHearingProccess.controller");

router.post("/hearing-list", auth(), controller.getHearingList);
router.post("/appeal-types", auth(), controller.getAppealTypes);
router.post("/hearing-data", auth(), controller.getHearingData);
router.post("/submit-hearing", auth(), controller.submitAppealHearing);

router.post(
  "/upload-document",
  auth(),
  upload.single("document"),
  controller.uploadHearingDocument
);

module.exports = router;