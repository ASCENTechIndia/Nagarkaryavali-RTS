const express = require("express");
const router  = express.Router();
const controller = require("./frmTownPlanningSectorMapping.controller");
const auth = require("../../../middlewares/auth.middleware");

router.get("/user-list", auth(), controller.getUserList);

router.get("/sector-list", auth(), controller.getSectorListWithMapping);

router.post("/save-mapping", auth(), controller.saveSectorMapping);

module.exports = router;
