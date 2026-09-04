const repo = require("./FrmMappingConfig.repo");


/**
 * Get User Dropdown
 */
const getUserDropdownService = async () => {
    console.log("Service: Fetch User Dropdown");

    const data = await repo.getUserDropdownRepo();

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No users found",
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
 * Get Ward Dropdown
 */
const getWardDropdownService = async ({ ulbid }) => {
    console.log("Service: Fetch Ward Dropdown", { ulbid });

    const data = await repo.getWardDropdownRepo({ ulbid });

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No wards found",
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
 * Get Selected User Ward Configuration
 */
const getUserWardConfigService = async ({ userId }) => {
    console.log("Service: Fetch User Ward Configuration", { userId });

    const data = await repo.getUserWardConfigRepo({ userId });

    if (!data || data.length === 0) {
        return {
            success: false,
            message: "No ward configuration found for this user",
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
 * Save User Ward Configuration
 */
const saveUserWardConfigService = async (payload) => {
    console.log("Service: Save User Ward Configuration");

    const result = await repo.saveUserWardConfigRepo(payload);

    if (Number(result.out_errorcode) !== 9999) {
        return {
            success: false,
            errorCode: result.out_errorcode,
            message:
                result.out_errormsg ||
                "Failed to save user ward configuration",
        };
    }

    return {
        success: true,
        errorCode: result.out_errorcode,
        message:
            result.out_errormsg ||
            "User configuration detail saved successfully",
    };
};


module.exports = {
    getUserDropdownService,
    getWardDropdownService,
    getUserWardConfigService,
    saveUserWardConfigService,
};