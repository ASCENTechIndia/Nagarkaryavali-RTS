const express = require("express");
const router = express.Router();
const controller = require("./frmAppAuth.controller");
const upload = require("../../../middlewares/upload.middleware");


router.post("/user-prabhag", controller.getUserPrabhagList);
router.post("/user-department", controller.getUserDeptList);
router.post("/user-sector", controller.getUserSectorList);
router.post("/application-list", controller.getApplicationAuthList);
router.post("/hod-clerk-list", controller.getHodClerkList);
router.post("/application-details", controller.getApplicationDetails);
router.post("/application-auth", controller.applicationAuth);
router.post("/application-verification-document",upload.single("document"),controller.saveApplicationVerificationDocument);
router.post("/menu-details", controller.getMenuDetails);

module.exports = router;
