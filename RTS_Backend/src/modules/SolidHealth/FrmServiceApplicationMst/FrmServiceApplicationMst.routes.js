const express = require("express");
const router = express.Router();
const controller = require("./FrmServiceApplicationMst.controller");
const upload = require("../../../middlewares/upload.middleware");
const auth = require("../../../middlewares/auth.middleware");

router.post("/wardlist", auth(), controller.getWardList);

router.post("/sectorlist", auth(), controller.getSectorList);

router.post("/documentlist", auth(), controller.getDocumentList);

router.post("/save", auth(), controller.saveServiceApplication);

router.post("/upload-document", auth(), upload.any(), controller.uploadServiceDocuments);

router.post("/villages", auth(), controller.getVillageList);

module.exports = router;
