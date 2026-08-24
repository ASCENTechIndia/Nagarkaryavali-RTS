const express = require("express");
const router = express.Router();
const controller = require("./Stepnew.controller");
const auth = require("../../../middlewares/auth.middleware");
const upload = require("../../../middlewares/upload.middleware");


router.get( "/service-name",  controller.getServiceNameController);
router.get( "/noc-purpose",  controller.getNocPurposeController);
router.get( "/wards", controller.getWardsController);
router.get( "/user-mobile",  controller.getUserMobileController);
router.get( "/water-sewerage-types",  controller.getWaterSewerageTypesController);
router.get( "/water-consumer-types",  controller.getWaterConsumerTypesController);
router.get( "/water-meter-types",  controller.getWaterMeterTypesController);
router.get( "/service-documents",  controller.getServiceDocumentsController);
router.post( "/save",  controller.saveApplicantInfoController);
router.post( "/upload-app-doc",  upload.single("documents"), controller.uploadAppDocument);

module.exports = router;