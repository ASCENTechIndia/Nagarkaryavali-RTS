const express    = require("express");
const router     = express.Router();
const controller = require("./frmAppliReportEMst.controller");
const auth       = require("../../../middlewares/auth.middleware");


router.get("/service-list", auth(), controller.getServiceList);

router.get("/zone-list", auth(), controller.getZoneList);

router.post("/report", auth(), controller.getAppliReport);

router.post("/documents", auth(), controller.getAppliDocuments);

module.exports = router;
