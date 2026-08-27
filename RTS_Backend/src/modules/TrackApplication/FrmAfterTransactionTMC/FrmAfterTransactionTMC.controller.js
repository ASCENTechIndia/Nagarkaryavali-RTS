const asyncHandler = require("../../../libs/asyncHandler");
const { fail, ok } = require("../../../libs/response");
const service = require("./FrmAfterTransactionTMC.service");

exports.getPaymentSessionDetailsController = asyncHandler(
    async (req, res) => {
        console.log("Payment Session Details Request:", req.query);
        const { paymentSessionId } = req.query;

        if (!paymentSessionId) {
            return fail(res, "paymentSessionId is required");
        }

        const data = await service.getPaymentSessionDetailsService({paymentSessionId});

        if (!data.success) {
            return fail(res, data.message);
        }
        return ok(res, data, "Payment session details fetched successfully");
    }
);

exports.paymentInsController = asyncHandler(
    async (req, res) => {
        console.log("Payment Ins Request:", req.body);
        const {appNo, amount, paymentStatus, paymentResponse} = req.body;

        if (!appNo) {
            return fail(res, "appNo is required");
        }

        if ( amount === undefined || amount === null || amount === "") {
            return fail(res, "amount is required");
        }
        if (!paymentStatus) {
            return fail(res, "paymentStatus is required");
        }
        if (!["S", "F"].includes(paymentStatus)) {
            return fail( res, "paymentStatus must be S or F");
        }
        if (!paymentResponse) {
            return fail(res, "paymentResponse is required");
        }

        const data = await service.paymentInsService({appNo, amount, paymentStatus, paymentResponse});
        console.log({data})
        if (!data.success) { 
            return fail(res, data.message);
        }

        return ok(res, data, "Payment details updated successfully");
    }
);

exports.paymentResponseController = asyncHandler(
    async (req, res) => {
        console.log("Payment Gateway Response:", req.body);

        const msg = req.body?.msg || req.body?.response || req.body?.Response || "";
        if (!msg) {
            return res.status(400).send("Payment response not received");
        }

        const frontendUrl = process.env.FRONTEND_URL;
        if (!frontendUrl) {
            return res.status(500).send("FRONTEND_URL is not configured");
        }

        const transactionId = String(msg).split("~")[1] || "";
        if (!transactionId) {
            return res.status(400).send("Transaction ID not found");
        }

        const redirectUrl = `${frontendUrl}/app/FrmAfterTransactionTMC`+`?transactionId=${encodeURIComponent(transactionId)}`+`&paymentResponse=${encodeURIComponent(msg)}`;
        console.log("Redirecting to:", redirectUrl);
        return res.redirect(303, redirectUrl);
    }
);