const express = require("express");
const router = express.Router();
const controller = require("./FrmHolidayMst.controller");

// FrmHolidayMst Routes
router.post("/Details", controller.saveHoliday);

module.exports = router;