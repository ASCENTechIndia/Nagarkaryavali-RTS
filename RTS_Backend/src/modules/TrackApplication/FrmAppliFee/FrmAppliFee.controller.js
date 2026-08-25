const asyncHandler = require("../../../libs/asyncHandler");
const { fail, ok } = require("../../../libs/response");
const service = require("./FrmAppliFee.service");

exports.getPropertyDetailsController = asyncHandler(
    async (req, res) => {
        console.log("Property Details Request:", req.query);
        const { appNo } = req.query;

        if (!appNo) {
            return fail(res, "appNo is required");
        }

        const data = await service.getPropertyDetailsService({appNo});
        return ok(res, data, data.message || "Property details fetched successfully");
    }
);

exports.getPropertyAssessmentController = asyncHandler(
    async (req, res) => {
        console.log("Property Assessment Request:", req.query);
        const { appNo } = req.query;

        if (!appNo) {
            return fail(res, "appNo is required");
        }

        const data = await service.getPropertyAssessmentService({appNo});
        return ok(res, data, data.message || "Property assessment fetched successfully");
    }
);

exports.getApplicantDetailsController = asyncHandler(
    async (req, res) => {
        console.log("Applicant Details Request:", req.query);
        const { appNo } = req.query;

        if (!appNo) {
            return fail(res, "appNo is required");
        }

        const data = await service.getApplicantDetailsService({appNo});
        return ok( res, data, data.message || "Applicant details fetched successfully");
    }
);

exports.getApplicationDetailsController = asyncHandler(
    async (req, res) => {
        console.log("Application Details Request:", req.query);
        const { appNo, serviceId } = req.query;

        if (!appNo) {
            return fail(res, "appNo is required");
        }

        if (!serviceId) {
            return fail(res, "serviceId is required");
        }

        const data = await service.getApplicationDetailsService({appNo, serviceId});
        return ok(res, data, data.message || "Application details fetched successfully");
    }
);

exports.getApplicationSourceController = asyncHandler(
    async (req, res) => {
        console.log("Application Source Request:", req.query);
        const { appNo, serviceId } = req.query;

        if (!appNo) {
            return fail(res, "appNo is required");
        }

        if (!serviceId) {
            return fail(res, "serviceId is required");
        }

        const data = await service.getApplicationSourceService({appNo, serviceId});
        return ok( res, data, data.message || "Application source fetched successfully");
    }
);

exports.getUserDetailsController = asyncHandler(
    async (req, res) => {
        console.log("User Details Request:", req.query);
        const { userUniqueId } = req.query;

        if (!userUniqueId) {
            return fail(res, "userUniqueId is required");
        }

        const data = await service.getUserDetailsService({userUniqueId});
        return ok(res, data, data.message || "User details fetched successfully");
    }
);

exports.getMahaUserDetailsController = asyncHandler(
    async (req, res) => {
        console.log("MahaOnline User Details Request:", req.query);
        const { trackId } = req.query;

        if (!trackId) {
            return fail(res, "trackId is required");
        }

        const data = await service.getMahaUserDetailsService({trackId});
        return ok(res, data, data.message || "MahaOnline user details fetched successfully");
    }
);

exports.paymentSessionController = asyncHandler(
    async (req, res) => {
        console.log("Payment Session Request:", req.body);
        const {ulbId, corpId, userUniqueId, username, userFullName, trackId, userIdMahaOnline, lastLogin, lastLogout, serviceId, service: serviceName, marrageregis, step, appNo, paymentReq, amount} = req.body;

        if (!ulbId) {
            return fail(res, "ulbId is required");
        }
        if (!corpId) {
            return fail(res, "corpId is required");
        }
        if (!userUniqueId) {
            return fail(res, "userUniqueId is required");
        }
        if (!username) {
            return fail(res, "username is required");
        }
        if (!userFullName) {
            return fail(res, "userFullName is required");
        }
        if (!trackId) {
            return fail(res, "trackId is required");
        }
        if (!userIdMahaOnline) {
            return fail(res, "userIdMahaOnline is required");
        }
        if (!serviceId) {
            return fail(res, "serviceId is required");
        }
        if (!serviceName) {
            return fail(res, "service is required");
        }
        if (!marrageregis) {
            return fail(res, "marrageregis is required");
        }
        if (step === undefined || step === null || step === "") {
            return fail(res, "step is required");
        }
        if (!appNo) {
            return fail(res, "appNo is required");
        }
        if (!paymentReq) {
            return fail(res, "paymentReq is required");
        }
        if (amount === undefined || amount === null || amount === "") {
            return fail(res, "amount is required");
        }

        const data = await service.paymentSessionService({
            ulbId,
            corpId,
            userUniqueId,
            username,
            userFullName,
            trackId,
            userIdMahaOnline,
            lastLogin,
            lastLogout,
            serviceId,
            service: serviceName,
            marrageregis,
            step,
            appNo,
            paymentReq,
            amount,
        });

        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(res, data, data.message || "Payment session created successfully");
    }
);