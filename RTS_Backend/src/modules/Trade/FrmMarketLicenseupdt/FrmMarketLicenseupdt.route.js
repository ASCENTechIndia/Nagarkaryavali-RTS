const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmMarketLicenseupdt.controller");
const upload = require("../../../middlewares/upload.middleware");

router.post("/application-types", controller.getApplicationTypes);

router.post("/zones", controller.getZones);

router.get("/genders", controller.getGenders);

router.get("/jalanshil", controller.getJalanshil);

router.get("/relations", controller.getRelations);

router.post("/documentsMarket", controller.getDocuments);

router.get("/license-types", controller.getLicenseTypes);

router.get("/adhikrtutta", controller.getAdhikrtutta);

router.get("/application-status", controller.getApplicationStatus);

router.post("/market-license-details", controller.getMarketLicenseDetails);

router.post("/director-name", controller.getDirectorName);

router.post("/market-application-types", controller.getMarketApplicationTypes);

router.post("/director-details", controller.getDirectorDetails);

router.post(
  "/market-application-address",
  controller.getMarketApplicationAddress,
);

router.post("/trade-type-details", controller.getTradeTypeDetails);

router.post("/trade-details", controller.getTradeDetails);

router.post("/trade-director-id", controller.getTradeDirectorId);

router.post(
  "/trade-director-image",
  upload.single("document"),
  controller.updateTradeDirectorImage,
);

router.post(
  "/trade-types-by-category",

  controller.getTradeTypesByCategory,
);

router.post(
  "/service-instructions",

  controller.getServiceInstructions,
);

router.post(
  "/trade-categories",

  controller.getTradeCategories,
);


router.post(
  "/self-declaration",

  controller.getSelfDeclaration,
);

module.exports = router;
