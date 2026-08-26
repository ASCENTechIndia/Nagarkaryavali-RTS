const express = require("express");

const controller = require("./FrmMarketEntry.controller");

const router = express.Router();

const auth = require("../../../middlewares/auth.middleware");

const upload = require("../../../middlewares/upload.middleware");

// GET BUSINESS PLACE

router.post("/getbusinessplace", controller.getBusinessPlace);

// GET JALAN SHIL

router.post("/getjalanshil", controller.getJalanShil);

// GET ILLEGAL TYPE

router.post("/getillegaltype", controller.getIllegalType);

// GET APPLICANT TYPE

router.post("/getapplicanttype", controller.getApplicantType);

// GET WARD

router.post("/getward", controller.getWard);

// GET LICENSE TYPE

router.post("/getlicensetype", controller.getLicenseType);

// GET TRADE CATEGORY

router.post("/gettradecategory", controller.getTradeCategory);

// GET TRADE DETAILS

router.post("/gettradedetails", controller.getTradeDetails);

// GET DOCUMENT DETAILS

router.post("/getdocumentdetails", controller.getDocumentDetails);

// GET SELF DECLARE DATA

router.post("/getselfdeclaredata", controller.getSelfDeclareData);

// GET TRADE TYPE DETAILS

// router.post("/gettradetypedetails", controller.getTradeTypeDetails); DONT USE

// GET APPLICATION DETAILS

//router.post("/getapplicationdetails", controller.getApplicationDetails);

router.post("/applicationentry", controller.applicationEntry);

router.post("/updatedirectorimages", upload.array("directorImages", 10), controller.updateDirectorImages);

router.post("/documentinsert", upload.single("document"), controller.documentInsert);

//router.post("/getexistinglicensedetails",  controller.getExistingLicenseDetails);

// router.post("/checklicensecancelled", controller.checkLicenseCancelled);

// router.post("/gettradtypesrates", controller.getTradTypesRates);

// router.post("/gettradetypesbycategory", controller.getTradeTypesByCategory);

router.post("/gettradecategorybyjwalanshil", controller.getTradeCategoryByJwalan);

module.exports = router;
