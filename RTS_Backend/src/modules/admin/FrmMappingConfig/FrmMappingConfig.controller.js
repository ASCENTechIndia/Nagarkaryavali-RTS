const asyncHandler = require("../../../libs/asyncHandler");
const { fail, ok } = require("../../../libs/response");
const service = require("./FrmMappingConfig.service");


/**
 * Get User Dropdown
 */
exports.getUserDropdownController = asyncHandler(
    async (req, res) => {
        console.log("User Dropdown Request");

        const data = await service.getUserDropdownService();

        return ok(
            res,
            data,
            data.message || "User dropdown fetched successfully"
        );
    }
);


/**
 * Get Ward Dropdown
 */
exports.getWardDropdownController = asyncHandler(
    async (req, res) => {
        console.log("Ward Dropdown Request:", req.query);

        const { ulbid } = req.query;

        if (!ulbid) {
            return fail(res, "ulbid is required");
        }

        const data = await service.getWardDropdownService({
            ulbid,
        });

        return ok(
            res,
            data,
            data.message || "Ward dropdown fetched successfully"
        );
    }
);


/**
 * Get User Ward Configuration
 */
exports.getUserWardConfigController = asyncHandler(
    async (req, res) => {
        console.log(
            "User Ward Configuration Request:",
            req.query
        );

        const { userId } = req.query;

        if (!userId) {
            return fail(res, "userId is required");
        }

        const data = await service.getUserWardConfigService({
            userId,
        });

        return ok(
            res,
            data,
            data.message ||
                "User ward configuration fetched successfully"
        );
    }
);


/**
 * Save User Ward Configuration
 */
exports.saveUserWardConfigController = asyncHandler(
    async (req, res) => {
        console.log(
            "Save User Ward Configuration Request:",
            req.body
        );

        const {
            loginUserId,
            ulbid,
            userId,
            blockConfigStr,
            ipAddress,
            source,
        } = req.body;


        if (!loginUserId) {
            return fail(res, "loginUserId is required");
        }

        if (!ulbid) {
            return fail(res, "ulbid is required");
        }

        if (!userId) {
            return fail(res, "userId is required");
        }

        if (!blockConfigStr) {
            return fail(res, "blockConfigStr is required");
        }


        const data = await service.saveUserWardConfigService({
            loginUserId,
            ulbid,
            userId,
            blockConfigStr,
            ipAddress,
            source,
        });


        if (!data.success) {
            return fail(res, data.message);
        }

        return ok(
            res,
            data,
            data.message ||
                "User configuration detail saved successfully"
        );
    }
);