const express = require("express");
const router = express.Router();
const controller = require("./FrmNOCHordingType.controller");
const auth = require("../../../middlewares/auth.middleware");

router.post("/list",controller.getNOCHordingTypeList);
router.post("/hodType",controller.getNOCHordingTypeById);
router.post("/submit",controller.saveNOCHordingType);

module.exports = router;