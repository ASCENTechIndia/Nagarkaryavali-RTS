const repo = require("./FrmAfterTransactionTMC.repo");

// ============================================================
// GET PAYMENT ACKNOWLEDGEMENT DETAILS
// ============================================================
const getPaymentAcknowledgementService = async (data) => {
  if (!data.serviceId) {
    return {
      status: "FAILED",
      message: "Service ID is required.",
      data: [],
    };
  }

  if (!data.appNo) {
    return {
      status: "FAILED",
      message: "Application number is required.",
      data: [],
    };
  }

  const result = await repo.getPaymentAcknowledgementRepo(data);


  if (!result.success) {
    return {
      status: "FAILED",
      message: result.error || "Failed to get payment acknowledgement details.",
      data: [],
    };
  }

  if (!result.rows || result.rows.length === 0) {
    return {
      status: "FAILED",
      message: "Payment acknowledgement details not found.",
      data: [],
    };
  }

  return {
    success: true,
    status: "SUCCESS",
    message: "Payment acknowledgement details fetched successfully.",
    data: result.rows,
    rowCount: result.rows.length,
  };
};

module.exports = {
  getPaymentAcknowledgementService,
};
