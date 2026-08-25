const repo = require("./FrmAppeal.repo");

const raiseAppealService = async (payload) => {
    console.log("Service: Raise Appeal", payload);
    const result = await repo.raiseAppealRepo(payload);

    if (Number(result.out_errcode) !== 9999) {
        return {success: false, errorCode: result.out_errcode, message: result.out_errmsg};
    }

    return {success: true, errorCode: result.out_errcode, message: result.out_errmsg};
};

const getApplicationDetailsService = async (payload) => {
    console.log("Service: Get Application Details", payload);
    const data = await repo.getApplicationDetailsRepo(payload);

    if (!data || data.length === 0) { 
        return {success: false, message: "No application details found", data: []};
    }

    return {success: true, count: data.length, data};
};

module.exports = {
    raiseAppealService,
    getApplicationDetailsService,
};