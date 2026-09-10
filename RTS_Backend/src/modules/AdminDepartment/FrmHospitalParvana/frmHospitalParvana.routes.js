const express = require("express");
const router = express.Router();
const controller = require("./frmHospitalParvana.controller");
const auth = require("../../../middlewares/auth.middleware");

// GET  /api/FrmHospitalParvana/list
router.get("/list", auth(), controller.getHospitalList);

// GET  /api/FrmHospitalParvana/
router.get("/", auth(), controller.getHospitalList);

// GET  /api/FrmHospitalParvana/:id
router.get("/:id", auth(), controller.getHospitalById);

// POST /api/FrmHospitalParvana/save (Procedure AORTS_HOSPITAL_INS)
router.post("/save", auth(), controller.saveHospital);

// POST /api/FrmHospitalParvana/insert (Alias)
router.post("/insert", auth(), controller.saveHospital);

module.exports = router;
