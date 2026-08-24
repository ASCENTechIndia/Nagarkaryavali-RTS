const repo = require("./FrmPlumberLicense.repo");

const getEducationDropdownService = async () => {
    console.log("Service: Fetch Plumber Education Dropdown");
    const data = await repo.getEducationDropdownRepo();

    if (!data || data.length === 0) {
        return {success: false, message: "No data Found", data: []};
    }
    return { success: true, count: data.length, data };
};

const savePlumberLicenseService = async (payload) => {
    console.log("Service: Save Plumber License", payload);
    const result = await repo.savePlumberLicenseRepo(payload);

    const errorCode = Number(result?.out_Errcode);
    if (errorCode !== 9999) {
        return {
            success: false,
            errorCode: result?.out_Errcode,
            message: result?.out_ErrMsg || "Unable to save plumber license",
            appNo: result?.out_appno || null,
        };
    }

    return {
        success: true,
        errorCode: result.out_Errcode,
        message: result.out_ErrMsg || "Plumber license details inserted successfully",
        appNo: result.out_appno || null,
    };
};

const renewPlumberLicenseService = async (payload) => {
    console.log("Service: Renew Plumber License", payload);
    const result = await repo.renewPlumberLicenseRepo(payload);

    const errorCode = Number(result?.out_Errcode);
    if (errorCode !== 9999) {
        return {
            success: false,
            errorCode: result?.out_Errcode,
            message: result?.out_ErrMsg || "Unable to renew plumber license",
            appNo: result?.out_appno || null,
        };
    }

    return {
        success: true,
        errorCode: result.out_Errcode,
        message: result.out_ErrMsg || "Plumber license renewed successfully",
        appNo: result.out_appno || null,
    };
};

module.exports = {
    getEducationDropdownService,
    savePlumberLicenseService,
    renewPlumberLicenseService,
};