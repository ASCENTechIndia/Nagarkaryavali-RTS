const express = require("express");
const router = express.Router();
const controller = require("./frmHospitalParvana.controller");
const auth = require("../../../middlewares/auth.middleware");

router.get("/list", auth(), controller.getHospitalList);

router.get("/", auth(), controller.getHospitalList);

router.get("/:id", auth(), controller.getHospitalById);

router.post("/save", auth(), controller.saveHospital);

router.post("/insert", auth(), controller.saveHospital);

module.exports = router;
