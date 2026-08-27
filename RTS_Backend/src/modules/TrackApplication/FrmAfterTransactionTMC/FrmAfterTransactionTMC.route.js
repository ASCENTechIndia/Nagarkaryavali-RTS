const express = require("express");
const router = express.Router();
const controller = require("./FrmAfterTransactionTMC.controller");
const auth = require("../../../middlewares/auth.middleware");

router.get("/payment-session-details", auth(), controller.getPaymentSessionDetailsController);
router.post("/payment-ins", auth(), controller.paymentInsController);

module.exports = router;