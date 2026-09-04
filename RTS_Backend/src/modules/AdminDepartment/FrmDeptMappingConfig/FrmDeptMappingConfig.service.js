const repo = require("./FrmDeptMappingConfig.repo");


/**
 * Get Department Dropdown
 */
const getDepartmentDropdownService = async () => {
    console.log("Service: Fetch Department Dropdown");

    const data = await repo.getDepartmentDropdownRepo();

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No departments found",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


/**
 * Get Selected User Department Configuration
 */
const getUserDepartmentConfigService = async ({ userId }) => {
    console.log("Service: Fetch User Department Configuration", {
        userId,
    });

    const data = await repo.getUserDepartmentConfigRepo({
        userId,
    });

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No department configuration found for this user",
            data: [],
        };
    }

    return {
        success: true,
        count: data.length,
        data,
    };
};


/**
 * Save User Department Configuration
 */
const saveUserDepartmentConfigService = async (payload) => {
    console.log("Service: Save User Department Configuration");

    const result = await repo.saveUserDepartmentConfigRepo(payload);

    if (Number(result.out_errorcode) !== 9999) {
        return {
            success: false,
            errorCode: result.out_errorcode,
            message:
                result.out_errormsg ||
                "Failed to save user department configuration",
        };
    }

    return {
        success: true,
        errorCode: result.out_errorcode,
        message:
            result.out_errormsg ||
            "User Department Configuration Detail Saved Successfully.",
    };
};


module.exports = {
    getDepartmentDropdownService,
    getUserDepartmentConfigService,
    saveUserDepartmentConfigService,
};