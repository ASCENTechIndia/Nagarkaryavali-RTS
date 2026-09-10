const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmMeatShopNOC.controller");

router.post("/submit", auth(), controller.submitApplication);

module.exports = router;