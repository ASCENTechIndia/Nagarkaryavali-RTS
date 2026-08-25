const express = require("express");
const controller = require("./FrmPropertyAppel.controller");

const router = express.Router();

router.post("/prop-appeal", controller.createPropAppeal);
router.get("/objections", controller.getObjections);

module.exports = router;
