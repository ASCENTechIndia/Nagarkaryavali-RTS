const express = require("express");
const router = express.Router();
const controller = require("./FrmNOCHordingType.controller");
const auth = require("../../../middlewares/auth.middleware");

router.post("/list", auth(), controller.getNOCHordingTypeList);
router.post("/hodType", auth(), controller.getNOCHordingTypeById);
router.post("/submit", auth(), controller.saveNOCHordingType);

module.exports = router;