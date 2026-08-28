const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmMarriageRgstn.controller");
const upload = require("../../../middlewares/upload.middleware");

router.post("/zones", auth(), controller.getZones);
router.post("/previous-status", auth(), controller.getPreviousStatus);
router.post("/religion-list", auth(), controller.getReligionList);
router.post("/id-documents", auth(), controller.getIDDocuments);
router.post("/address-documents", auth(), controller.getAddressDocuments);
router.post("/age-documents", auth(), controller.getAgeDocuments);
router.post("/relations", auth(), controller.getRelations);
router.post("/document-definitions", auth(), controller.getDocumentDefinitions);
router.post("/calculate-age", auth(), controller.calculateAge);
router.post("/submit", auth(), controller.submitApplication);
router.post("/get-marriage-data", auth(), controller.getMarriageData);
router.post("/payment-flag", auth(), controller.getServicePaymentFlag);
router.post("/check-payment", auth(), controller.checkPayment);

router.post(
  "/upload-husband-images",
  auth(),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "thumb", maxCount: 1 },
  ]),
  controller.uploadHusbandImages
);

router.post(
  "/upload-wife-images",
  auth(),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "thumb", maxCount: 1 },
  ]),
  controller.uploadWifeImages
);

router.post(
  "/upload-witness-images",
  auth(),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "thumb", maxCount: 1 },
  ]),
  controller.uploadWitnessImages
);

router.post(
  "/upload-before-marriage-doc",
  auth(),
  upload.single("document"),
  controller.uploadBeforeMarriageDoc
);

router.post(
  "/upload-grid-document",
  auth(),
  upload.single("document"),
  controller.uploadGridDocument
);


module.exports = router;