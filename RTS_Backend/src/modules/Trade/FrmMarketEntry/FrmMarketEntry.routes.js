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

// GET ZONE BY WARD (NEW - Mirroring ddlward_SelectedIndexChanged)
router.post("/getzonebyward", controller.getZoneByWard);

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

// GET APPLICATION DETAILS
router.post("/getapplicationdetails", controller.getApplicationDetails);

// GET EXISTING LICENSE DETAILS (NEW - Mirroring FetchExiatingLicDetails)
router.post("/getexistinglicensedetails", controller.getExistingLicenseDetails);

// CHECK LICENSE CANCELLED (NEW - Mirroring btnSearch_Click)
router.post("/checklicensecancelled", controller.checkLicenseCancelled);

// APPLICATION ENTRY
router.post("/applicationentry", controller.applicationEntry);

// UPDATE DIRECTOR IMAGES
router.post("/updatedirectorimages", upload.array("directorImages", 10), controller.updateDirectorImages);

// DOCUMENT INSERT
router.post("/documentinsert", upload.single("document"), controller.documentInsert);

// GET TRADE CATEGORY BY JWALAN
router.post("/gettradecategorybyjwalanshil", controller.getTradeCategoryByJwalan);

module.exports = router;