const express = require("express");

const controller = require("./FrmDashboardAll.controller");

const auth  = require("../../../middlewares/auth.middleware");

const router = express.Router();

// =====================================================
// Department Details
// =====================================================

router.post("/department-details", auth(), controller.getDepartmentDetails);

router.post("/service-details", auth(), controller.getServiceDetails);

router.post("/ward-wise", auth(), controller.getWardWiseDetails);

router.post("/application-details", auth(), controller.getApplicationDetails);

router.post("/steps", auth(), controller.getSteps);

module.exports = router;
