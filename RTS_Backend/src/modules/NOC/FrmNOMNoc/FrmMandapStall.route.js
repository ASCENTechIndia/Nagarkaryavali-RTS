const express = require("express");

const router = express.Router();

const auth = require("../../../middlewares/auth.middleware");

const controller = require("./FrmMandapStall.controller");

router.post(
    "/submit-mandap",
   auth(),
    controller.submitApplication
);

module.exports = router;