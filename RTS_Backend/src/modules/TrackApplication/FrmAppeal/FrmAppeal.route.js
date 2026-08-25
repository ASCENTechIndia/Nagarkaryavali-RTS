const express = require("express");
const router = express.Router();
const controller = require("./FrmAppeal.controller");
const auth = require("../../../middlewares/auth.middleware");

router.post("/raise-appeal", auth(), controller.raiseAppealController);
router.get("/application-details", auth(), controller.getApplicationDetailsController);

module.exports = router;