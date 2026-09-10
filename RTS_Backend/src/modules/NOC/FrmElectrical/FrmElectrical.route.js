const express = require("express");

const router = express.Router();

const auth = require("../../../middlewares/auth.middleware");

const controller = require("./FrmElectrical.controller");

router.post(
    "/submit-electrical",
    auth(),
    controller.submitApplication
);

module.exports = router;