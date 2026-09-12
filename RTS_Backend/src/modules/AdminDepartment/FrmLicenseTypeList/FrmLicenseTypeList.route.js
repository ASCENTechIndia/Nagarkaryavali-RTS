const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmLicenseTypeList.controller");

router.get("/list", auth(), controller.getLicenseTypeList);

router.post("/license-type-details", auth(), controller.getLicenseTypeDetails);

router.post("/license-type-save", auth(), controller.saveLicenseType);

module.exports = router;