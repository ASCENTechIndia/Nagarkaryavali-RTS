const repo = require("./FrmAfterTransactionTMC.repo");

const getPaymentSessionDetailsService = async (payload) => {
    console.log("Service: Payment Session Details", payload);
    const data = await repo.getPaymentSessionDetailsRepo(payload);

    if (!data || data.length === 0) {
        return {success: false, message: "Payment session details not found", data: []};
    }

    return {success: true, count: data.length, data};
};

const paymentInsService = async (payload) => {
    console.log("Service: Payment Ins", payload);
    const result = await repo.paymentInsRepo(payload);

    const errorCode = Number(result?.out_errcode);
    const message = result?.out_ErrMsg;

    if (errorCode !== 9999) {
        return {success: false, errorCode, message: message || "Payment processing failed"};
    }

    return {success: true, errorCode, message: message || "Payment processed successfully"};
};

module.exports = {
    getPaymentSessionDetailsService,
    paymentInsService
};