const repo = require("./FrmChallanGen.repo");

const getWardDropdownService = async (payload) => {
    console.log("Service: Fetch Ward Dropdown", payload);
    const data = await repo.getWardDropdownRepo(payload);

    if (!data || data.length === 0) {
        return { success: false, message: "No ward found", data: [] };
    }
    return { success: true, count: data.length, data };
};

const getDepartmentDropdownService = async () => {
    console.log("Service: Fetch Department Dropdown");
    const data = await repo.getDepartmentDropdownRepo();

    if (!data || data.length === 0) {
        return { success: false, message: "No department found", data: [] };
    }
    return { success: true, count: data.length, data };
};

const generateChallanService = async (payload) => {
    console.log("Service: Generate Challan", payload);
    const result = await repo.generateChallanRepo(payload);

    const errorCode = Number(result.OUT_ERRCODE);
    const message = result.OUT_ERRMESSAGE;

    if (errorCode !== -100) {
        return { success: false, errorCode, message: message || "Failed to generate challan" };
    }
    return { success: true, errorCode, message: message || "Challan generated successfully" };
};

module.exports = {
    getWardDropdownService,
    getDepartmentDropdownService,
    generateChallanService,
};