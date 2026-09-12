const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("./FrmHearingDateAssign.controller");

router.post("/hearing-process-list", auth(), controller.getHearingProcessList);

router.post("/assign-hearing-date", auth(), controller.assignHearingDate);

module.exports = router;
