const express = require("express");
const router = express.Router();
const controller = require("./FrmAfterTransactionTMC.controller");
const auth = require("../../../middlewares/auth.middleware");

router.get("/payment-session-details",  controller.getPaymentSessionDetailsController);
router.post("/payment-ins",  controller.paymentInsController);

module.exports = router;