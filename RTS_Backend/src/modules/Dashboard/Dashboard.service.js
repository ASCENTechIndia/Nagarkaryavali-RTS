const repo = require("./Dashboard.repo");

const getCorporationDetailsService = async (payload) => {
    console.log("Service: Fetch Corporation Details", payload);
    const data = await repo.getCorporationDetailsRepo(payload);

    if (!data) {
        return { success: false, message: "No corporation data found", data: null };
    }
    return { success: true, data };
};

const getDepartmentMenuService = async (payload) => {
    console.log("Service: Fetch Department Menu", payload);
    const data = await repo.getDepartmentMenuRepo(payload);

    if (!data || data.length === 0) {
        return { success: false, message: "No department menu found", data: [] };
    }
    return { success: true, count: data.length, data };
};

const getServicesByDeptIdService = async (payload) => {
    console.log("Service: Fetch Services By Department", payload);
    const data = await repo.getServicesByDeptIdRepo(payload);

    if (!data || data.length === 0) {
        return { success: false, message: "No services found", data: [] };
    }
    return { success: true, count: data.length, data };
};

const getDocumentsForServiceService = async (payload) => {
    console.log("Service: Fetch Documents For Service", payload);

    const data = await repo.getDocumentsForServiceRepo(payload);

    if (!data || data.length === 0) {
        return { success: false, message: "No documents found", data: [] };
    }
    return { success: true, count: data.length, data };
};

const getDownloadDocsService = async (payload) => {
    console.log("Service: Fetch Download Documents", payload);
    const data = await repo.getDownloadDocsRepo(payload);

    if (!data || data.length === 0) {
        return { success: false, message: "No download documents found", data: [] };
    }
    return { success: true, count: data.length, data };
};

module.exports = {
    getCorporationDetailsService,
    getDepartmentMenuService,
    getServicesByDeptIdService,
    getDocumentsForServiceService,
    getDownloadDocsService,
};