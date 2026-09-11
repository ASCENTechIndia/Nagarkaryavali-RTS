const express    = require("express");
const router     = express.Router();
const controller = require("./frmNocRoadType.controller");
const auth       = require("../../../middlewares/auth.middleware");

router.get("/list", auth(), controller.getNocRoadTypeList);

router.post("/save", auth(), controller.saveNocRoadType);

module.exports = router;
