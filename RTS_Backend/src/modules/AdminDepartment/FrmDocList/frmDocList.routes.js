const express = require("express");
const router = express.Router();
const controller = require("./frmDocList.controller");


router.post("/service-document-count", controller.getServiceDocumentCount);

router.post("/all-services", controller.getAllServices);

router.post("/documents-by-service", controller.getDocumentsByService);

router.post("/active-services", controller.getActiveServices);

router.post("/service-documents", controller.getServiceDocuments);

router.post("/service-document-config", controller.getServiceDocumentConfig);

router.post("/save-service-document-config",controller.saveServiceDocumentConfig);

router.post("/save-document", controller.saveDocument);

module.exports = router;