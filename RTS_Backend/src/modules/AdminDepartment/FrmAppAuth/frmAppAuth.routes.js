const express = require("express");

const router = express.Router();

const controller = require("./frmAppAuth.controller");

// ============================================================
// USER PRABHAG
// ============================================================
router.post("/user-prabhag", controller.getUserPrabhagList);

// ============================================================
// USER DEPARTMENT
// ============================================================
router.post("/user-department", controller.getUserDeptList);

// ============================================================
// USER SECTOR
// ============================================================
router.post("/user-sector", controller.getUserSectorList);

// ============================================================
// APPLICATION AUTHORIZATION LIST
// ============================================================
router.post("/application-list", controller.getApplicationAuthList);

router.post("/hod-clerk-list", controller.getHodClerkList);

router.post("/application-details", controller.getApplicationDetails);

module.exports = router;
