const express = require("express");
const router = express.Router();

const controller = require("./FrmHearingDateAssign.controller");

router.post("/hearing-process-list", controller.getHearingProcessList);

router.post("/assign-hearing-date", controller.assignHearingDate);

module.exports = router;
