const express = require("express");
const router = express.Router();

const controller = require("./FrmAfterTransactionTMC.controller");

router.post("/paymentacknowledgement", controller.generatePaymentAcknowledgement);

module.exports = router;
