const express = require("express");
const router = express.Router();
const controller = require("./Dashboard.controller");
const auth = require("../../middlewares/auth.middleware");

router.get("/corporation-details", controller.getCorporationDetailsController);
router.get("/department-menu", controller.getDepartmentMenuController);
router.get("/services-by-dept", controller.getServicesByDeptIdController);
router.get("/documents-for-service", controller.getDocumentsForServiceController);
router.get("/download-docs", controller.getDownloadDocsController);

module.exports = router;