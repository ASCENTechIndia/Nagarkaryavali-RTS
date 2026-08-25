const express = require("express");
const router = express.Router();
const controller = require("./FrmAppeal.controller");
const auth = require("../../../middlewares/auth.middleware");

router.post("/raise-appeal", controller.raiseAppealController);
router.get("/application-details", controller.getApplicationDetailsController);

module.exports = router;