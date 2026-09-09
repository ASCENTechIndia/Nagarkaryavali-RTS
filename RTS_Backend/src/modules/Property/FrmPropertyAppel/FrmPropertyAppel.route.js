const express = require("express");
const controller = require("./FrmPropertyAppel.controller");
const auth = require("../../../middlewares/auth.middleware");

const router = express.Router();

router.post("/prop-appeal", auth(), controller.createPropAppeal);
router.get("/objections", auth(), controller.getObjections);

module.exports = router;
