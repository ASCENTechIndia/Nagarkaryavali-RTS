const express = require("express");
const router = express.Router();
const controller = require("./FrmWaterAppliDetails.controller");
const auth = require("../../../middlewares/auth.middleware");
const upload = require("../../../middlewares/upload.middleware");

router.get("/wardlist", auth(), controller.getWardListController);
router.get("/documentlist", auth(), controller.getDocumentListController);
router.get("/application-details", auth(), controller.getWaterApplicationDetailsController);
router.get("/application-documents", auth(), controller.getWaterApplicationDocumentsController);
router.post("/save-application",  controller.saveWaterApplicationController);
router.post("/upload-application-document",  upload.single("file"), controller.uploadWaterApplicationDocumentController);

module.exports = router;