const express = require("express");
const router = express.Router();
const controller = require("./FrmServiceApplicationMst.controller");
const upload = require("../../../middlewares/upload.middleware");

router.post("/wardlist", controller.getWardList);

router.post("/sectorlist", controller.getSectorList);

router.post("/documentlist", controller.getDocumentList);

router.post("/save", controller.saveServiceApplication);

router.post("/upload-document", upload.any(), controller.uploadServiceDocuments);
module.exports = router;
