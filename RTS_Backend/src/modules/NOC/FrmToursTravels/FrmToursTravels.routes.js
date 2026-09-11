const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmToursTravels.controller");

router.post("/service-fields", auth(), controller.getServiceFields);
router.post("/submit", auth(), controller.submitApplication);

module.exports = router;
