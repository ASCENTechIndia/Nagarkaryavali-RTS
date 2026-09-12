const express = require("express");

const {
    generateHospitalNocPDF,
} = require("./frmHospitalNOC.controller");

const router = express.Router();


// ============================================================
// GENERATE NOC PDF
// ============================================================

router.post(
    "/generate-pdf",
    generateHospitalNocPDF
);


module.exports = router;