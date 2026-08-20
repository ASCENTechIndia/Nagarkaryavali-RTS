const express = require("express");
const controller = require("./FrmNewTaxAssesment.controller");

const router = express.Router();

router.post("/new-tax-asses", controller.createNewTaxAsses);
router.post("/wards", controller.getWardsByUlb)

module.exports = router;
