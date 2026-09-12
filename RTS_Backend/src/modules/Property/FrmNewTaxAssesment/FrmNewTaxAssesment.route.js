const express = require("express");
const controller = require("./FrmNewTaxAssesment.controller");

const router = express.Router();

router.post("/new-tax-asses",auth(), controller.createNewTaxAsses);
router.post("/wards", auth(), controller.getWardsByUlb)

module.exports = router;
