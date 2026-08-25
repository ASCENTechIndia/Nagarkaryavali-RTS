const asyncHandler = require("../../../libs/asyncHandler");
const { fail, ok } = require("../../../libs/response");
const service = require("./FrmAppeal.service");

exports.raiseAppealController = asyncHandler(
    async (req, res) => {
        console.log("Raise Appeal Request:", req.body);

        const {appId, citizenRemark, appealType, appealBy, userUniqueId, mode} = req.body;

        if (!appId || appId === "0") {
            return fail(res, "appId is required");
        }
        if (citizenRemark === undefined || citizenRemark === null) {
            return fail(res, "citizenRemark is required");
        }
        if (appealType === undefined || appealType === null || appealType === "") {
            return fail(res, "appealType is required");
        }
        if (!appealBy) {
            return fail(res, "appealBy is required");
        }
        if (userUniqueId === undefined || userUniqueId === null || userUniqueId === "") {
            return fail(res, "userUniqueId is required");
        }
        if (mode === undefined || mode === null || mode === "") {
            return fail(res, "mode is required");
        }

        const data = await service.raiseAppealService({appId, citizenRemark, appealType, appealBy, userUniqueId, mode});

        if (!data.success) {
            return fail(res, data.message);
        }
        return ok( res, data, data.message || "Appeal raised successfully");
    }
);

exports.getApplicationDetailsController = asyncHandler(
    async (req, res) => {
        console.log("Application Details Request:", req.query);
        const { appNo } = req.query;

        if (!appNo) {
            return fail(res, "appNo is required");
        }

        const data = await service.getApplicationDetailsService({appNo});
        return ok(res, data, data.message || "Application details fetched successfully");
    }
);