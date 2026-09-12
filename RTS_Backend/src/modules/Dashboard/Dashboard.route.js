const express = require("express");
const router = express.Router();
const controller = require("./Dashboard.controller");
const auth = require("../../middlewares/auth.middleware");

router.get("/corporation-details", auth(), controller.getCorporationDetailsController);
router.get("/department-menu", auth(), controller.getDepartmentMenuController);
router.get("/employee-department-menu", auth(), controller.getEmployeeDepartmentMenuController);
router.get("/services-by-dept",auth(), controller.getServicesByDeptIdController);
router.get("/documents-for-service", auth(), controller.getDocumentsForServiceController);
router.get("/instructions-for-service", auth(), controller.getInstructionsForServiceController);
router.get("/download-docs", auth(), controller.getDownloadDocsController);
router.get("/decrypt-request", auth(), controller.decryptRequestController);
router.get("/service-details", auth(), controller.getServiceDetails);

module.exports = router;