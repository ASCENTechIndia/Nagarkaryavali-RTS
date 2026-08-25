const repo = require("./FrmAppliFee.repo");

const getPropertyDetailsService = async (payload) => {
    console.log("Service: Get Property Details", payload);
    const data = await repo.getPropertyDetailsRepo(payload);

    if (!data || data.length === 0) {
        return {success: false, message: "Property details not found", data: []};
    }
    return {success: true, count: data.length, data};
};

const getPropertyAssessmentService = async (payload) => {
    console.log("Service: Get Property Assessment", payload);
    const data = await repo.getPropertyAssessmentRepo(payload);

    if (!data || data.length === 0) {
        return {success: false, message: "Property assessment details not found", data: []};
    }
    return {success: true, count: data.length, data};
};

const getApplicantDetailsService = async (payload) => {
    console.log("Service: Get Applicant Details", payload);

    const data = await repo.getApplicantDetailsRepo(payload);

    if (!data || data.length === 0) {
        return {success: false, message: "Applicant details not found", data: []};
    }
    return {success: true, count: data.length, data};
};

const getApplicationDetailsService = async (payload) => {
    console.log("Service: Get Application Details", payload);
    const data = await repo.getApplicationDetailsRepo(payload);

    if (!data || data.length === 0) {
        return {success: false, message: "Application details not found", data: []};
    }
    return {success: true, count: data.length, data};
};

const getApplicationSourceService = async (payload) => {
    console.log("Service: Get Application Source", payload);
    const data = await repo.getApplicationSourceRepo(payload);

    if (!data || data.length === 0) {
        return {success: false, message: "Application source details not found", data: []};
    }
    return {success: true, count: data.length, data};
};

const getUserDetailsService = async (payload) => {
    console.log("Service: Get User Details", payload);
    const data = await repo.getUserDetailsRepo(payload);

    if (!data || data.length === 0) {
        return {success: false, message: "User details not found", data: []};
    }
    return {success: true, count: data.length, data};
};

const getMahaUserDetailsService = async (payload) => {
    console.log("Service: Get MahaOnline User Details", payload);
    const data = await repo.getMahaUserDetailsRepo(payload);

    if (!data || data.length === 0) {
        return {success: false, message: "MahaOnline user details not found", data: []};
    }
    return {success: true, count: data.length, data};
};

const paymentSessionService = async (payload) => {
    console.log("Service: Payment Session", payload);
    const result = await repo.paymentSessionRepo(payload);

    if (Number(result.out_errcode) !== 9999) {
        return {success: false, errorCode: result.out_errcode, message: result.out_ErrMsg};
    }
    return {success: true, errorCode: result.out_errcode, message: result.out_ErrMsg};
};

module.exports = {
    getPropertyDetailsService,
    getPropertyAssessmentService,
    getApplicantDetailsService,
    getApplicationDetailsService,
    getApplicationSourceService,
    getUserDetailsService,
    getMahaUserDetailsService,
    paymentSessionService,
};