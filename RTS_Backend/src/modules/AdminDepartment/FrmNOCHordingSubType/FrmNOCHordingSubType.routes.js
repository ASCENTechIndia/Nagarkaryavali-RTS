const express = require("express");
const router = express.Router();
const controller = require("./FrmNOCHordingSubType.controller");
const auth = require("../../../middlewares/auth.middleware");

router.post("/list", auth(), controller.getNOCHordingSubTypeList);
router.post("/subType", auth(), controller.getNOCHordingSubTypeById);
router.post("/submit", auth(), controller.saveNOCHordingSubType);

module.exports = router;