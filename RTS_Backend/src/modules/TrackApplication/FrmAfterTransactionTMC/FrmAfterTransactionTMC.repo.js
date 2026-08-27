const { executeQueryTMC } = require("../../../db/queryExecutor");
const { executeProcedureTMC } = require("../../../db/procedureExecutor");
const oracledb = require("oracledb");

const getPaymentSessionDetailsRepo = async ({ paymentSessionId }) => {
    console.log("Repo: Payment Session Details", { paymentSessionId });
    const binds = {paymentSessionId: Number(paymentSessionId)};

    const sql = `
        SELECT
            var_paysession_appno AS appno,
            num_paysession_amount AS amount,
            num_paysession_serviceid AS serviceid,
            var_paysession_username AS email,
            num_paysession_useruniqueid AS useruniqueid,
            var_paysession_userfullname AS userfullname,
            num_paysession_ulbid AS ulbid
        FROM aorts_paysession_det
        WHERE num_paysession_id = :paymentSessionId
    `;

    const result = await executeQueryTMC(sql, binds);

    if (!result || !result.success) {
        throw new Error(result?.error || "Failed to fetch payment session details");
    }

    return result.rows;
};

const paymentInsRepo = async ({appNo, amount, paymentStatus, paymentResponse}) => {
    console.log("Repo: Payment Ins", {appNo, amount, paymentStatus});

    const sql = `
        BEGIN
            aorts_payment_ins(
                :in_ApplicationNo,
                :in_amount,
                :in_flag,
                :in_payres,
                :out_errcode,
                :out_ErrMsg
            );
        END;
    `;

    const binds = {
        in_ApplicationNo: appNo,
        in_amount: Number(amount),
        in_flag: paymentStatus,
        in_payres: paymentResponse,
        out_errcode: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
        out_ErrMsg: {dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000}
    };

    const result = await executeProcedureTMC({sql, binds});

    if (!result || !result.success) {
        throw new Error(result?.error || "Payment procedure execution failed");
    }
    return result.outBinds;
};

module.exports = {
    getPaymentSessionDetailsRepo,
    paymentInsRepo
};