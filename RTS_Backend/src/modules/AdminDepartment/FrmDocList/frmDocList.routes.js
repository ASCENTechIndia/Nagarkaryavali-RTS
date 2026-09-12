const express = require("express");
const router = express.Router();
const controller = require("./frmDocList.controller");
const auth = require("../../../middlewares/auth.middleware");

router.post("/service-document-count", auth(), controller.getServiceDocumentCount);

router.post("/all-services", auth(), controller.getAllServices);

router.post("/documents-by-service", auth(), controller.getDocumentsByService);

router.post("/active-services", auth(), controller.getActiveServices);

router.post("/service-documents", auth(), controller.getServiceDocuments);

router.post("/service-document-config", auth(), controller.getServiceDocumentConfig);

router.post("/save-service-document-config",auth(),controller.saveServiceDocumentConfig);

router.post("/save-document", auth(), controller.saveDocument);

module.exports = router;