const express = require("express");

const controller = require("./FrmMArketEntry.controller");

const router = express.Router();

const auth = require("../../../middlewares/auth.middleware");

const upload = require("../../../middlewares/upload.middleware");

// GET BUSINESS PLACE

router.post("/getbusinessplace", auth(), controller.getBusinessPlace);

// GET JALAN SHIL

router.post("/getjalanshil", auth(), controller.getJalanShil);

// GET ILLEGAL TYPE

router.post("/getillegaltype", auth(), controller.getIllegalType);

// GET APPLICANT TYPE

router.post("/getapplicanttype", auth(), controller.getApplicantType);

// GET WARD

router.post("/getward", auth(), controller.getWard);

// GET LICENSE TYPE

router.post("/getlicensetype", auth(), controller.getLicenseType);

// GET TRADE CATEGORY

router.post("/gettradecategory", auth(), controller.getTradeCategory);

// GET TRADE DETAILS

router.post("/gettradedetails", auth(), controller.getTradeDetails);

// GET DOCUMENT DETAILS

router.post("/getdocumentdetails", auth(), controller.getDocumentDetails);

// GET SELF DECLARE DATA

router.post("/getselfdeclaredata", auth(), controller.getSelfDeclareData);

// GET TRADE TYPE DETAILS

// router.post("/gettradetypedetails", controller.getTradeTypeDetails); DONT USE

// GET APPLICATION DETAILS

router.post("/getapplicationdetails", auth(), controller.getApplicationDetails);

router.post("/applicationentry", auth(), controller.applicationEntry);

router.post("/updatedirectorimages", upload.array("directorImages", 10), auth(), controller.updateDirectorImages);

router.post("/documentinsert", upload.single("document"), auth(), controller.documentInsert);

router.post("/getexistinglicensedetails", auth(), controller.getExistingLicenseDetails);

router.post("/checklicensecancelled", auth(), controller.checkLicenseCancelled);

router.post("/gettradtypesrates", auth(), controller.getTradTypesRates);

router.post("/gettradetypesbycategory", auth(), controller.getTradeTypesByCategory);

router.post("/gettradecategorybyjwalanshil", auth(), controller.getTradeCategoryByJwalan);

module.exports = router;
