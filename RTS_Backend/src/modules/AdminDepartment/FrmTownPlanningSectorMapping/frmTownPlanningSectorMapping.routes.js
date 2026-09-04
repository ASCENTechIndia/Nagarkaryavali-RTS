const express = require("express");
const router  = express.Router();
const controller = require("./frmTownPlanningSectorMapping.controller");
const auth = require("../../../middlewares/auth.middleware");

// GET  /api/FrmTownPlanningSectorMapping/user-list
router.get("/user-list", auth(), controller.getUserList);

// GET  /api/FrmTownPlanningSectorMapping/sector-list?userId=xxx
router.get("/sector-list", auth(), controller.getSectorListWithMapping);

// POST /api/FrmTownPlanningSectorMapping/save-mapping
router.post("/save-mapping", auth(), controller.saveSectorMapping);

module.exports = router;
