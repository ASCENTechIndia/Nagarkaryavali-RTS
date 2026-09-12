const express = require("express");
const router = express.Router();
const controller = require("./FrmHolidayMst.controller");
const auth = require("../../../middlewares/auth.middleware");

// FrmHolidayMst Routes
router.post("/Details", auth(), controller.saveHoliday);

module.exports = router;