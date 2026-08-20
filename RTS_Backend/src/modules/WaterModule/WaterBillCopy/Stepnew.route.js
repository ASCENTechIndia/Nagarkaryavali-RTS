const express = require("express");
const router = express.Router();
const controller = require("./Stepnew.controller");
const auth = require("../../../middlewares/auth.middleware");
const upload = require("../../../middlewares/upload.middleware");


router.get( "/service-name", auth(), controller.getServiceNameController);
router.get( "/noc-purpose", auth(), controller.getNocPurposeController);
router.get( "/wards", auth(), controller.getWardsController);
router.get( "/user-mobile", auth(), controller.getUserMobileController);
router.get( "/water-sewerage-types", auth(), controller.getWaterSewerageTypesController);
router.get( "/water-consumer-types", auth(), controller.getWaterConsumerTypesController);
router.get( "/water-meter-types", auth(), controller.getWaterMeterTypesController);
router.get( "/service-documents", auth(), controller.getServiceDocumentsController);
router.post( "/save", auth(), controller.saveApplicantInfoController);
router.post( "/upload-app-doc", auth(), upload.single("documents"), controller.uploadAppDocument);

module.exports = router;