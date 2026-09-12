const express = require("express");
const router = express.Router();
const controller = require("./Dashboard.controller");

router.get("/corporation-details",  controller.getCorporationDetailsController);
router.get("/department-menu",  controller.getDepartmentMenuController);
router.get("/employee-department-menu",  controller.getEmployeeDepartmentMenuController);
router.get("/services-by-dept", controller.getServicesByDeptIdController);
router.get("/documents-for-service",  controller.getDocumentsForServiceController);
router.get("/instructions-for-service",  controller.getInstructionsForServiceController);
router.get("/download-docs",  controller.getDownloadDocsController);
router.get("/decrypt-request",  controller.decryptRequestController);
router.get("/service-details",  controller.getServiceDetails);

module.exports = router;