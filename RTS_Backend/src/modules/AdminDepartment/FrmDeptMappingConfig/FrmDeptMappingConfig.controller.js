const asyncHandler = require("../../../libs/asyncHandler");
const { fail, ok } = require("../../../libs/response");
const service = require("./FrmDeptMappingConfig.service");


/**
 * Get Department Dropdown
 */
exports.getDepartmentDropdownController = asyncHandler(
    async (req, res) => {
        console.log("Department Dropdown Request");

        const data =
            await service.getDepartmentDropdownService();

        return ok(
            res,
            data,
            data.message ||
                "Department dropdown fetched successfully"
        );
    }
);


/**
 * Get Configured Departments for Selected User
 */
exports.getUserDepartmentConfigController = asyncHandler(
    async (req, res) => {
        console.log(
            "User Department Configuration Request:",
            req.query
        );

        const { userId } = req.query;

        if (!userId) {
            return fail(res, "userId is required");
        }

        const data =
            await service.getUserDepartmentConfigService({
                userId,
            });

        return ok(
            res,
            data,
            data.message ||
                "User department configuration fetched successfully"
        );
    }
);


/**
 * Save User Department Configuration
 */
exports.saveUserDepartmentConfigController = asyncHandler(
    async (req, res) => {
        console.log(
            "Save User Department Configuration Request:",
            req.body
        );

        const {
            loginUserId,
            ulbid,
            userId,
            deptConfigStr,
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

        if (!deptConfigStr) {
            return fail(res, "deptConfigStr is required");
        }


        const data =
            await service.saveUserDepartmentConfigService({
                loginUserId,
                ulbid,
                userId,
                deptConfigStr,
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
                "User Department Configuration Detail Saved Successfully."
        );
    }
);