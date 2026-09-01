const repo = require("./FrmRoadCutting.repo");

const getRoadTypeListService = async () => {


const result = await repo.getRoadTypeListRepo();

if (!result.success) {
throw new Error(result.error || "Failed to fetch road type list.");
}

return {
status: "SUCCESS",
message: "Road type list fetched successfully.",
data: result.rows,
};
};


const getWardListService = async (ulbId) => {
if (!ulbId) {
throw new Error("ULB ID is required.");
}

const result = await repo.getWardListRepo(ulbId);

if (!result.success) {
throw new Error(result.error || "Failed to fetch ward list.");
}

return {
status: "SUCCESS",
message: "Ward list fetched successfully.",
data: result.rows,
};
};

const getRoadCuttingTypeListService = async (ulbId) => {
if (!ulbId) {
throw new Error("ULB ID is required.");
}

const specialUlbIds = [870, 1690];

if (!specialUlbIds.includes(Number(ulbId))) {
return {
status: "SUCCESS",
message: "Road cutting type list fetched successfully.",
data: [],
};
}

const result = await repo.getRoadCuttingTypeListRepo();

if (!result.success) {
throw new Error(
result.error || "Failed to fetch road cutting type list.",
);
}

return {
status: "SUCCESS",
message: "Road cutting type list fetched successfully.",
data: result.rows,
};
};

const getPrabhagSamitiListService = async (ulbId) => {
if (!ulbId) {
throw new Error("ULB ID is required.");
}

const specialUlbIds = [870, 1690];

if (!specialUlbIds.includes(Number(ulbId))) {
return {
status: "SUCCESS",
message: "Prabhag Samiti list fetched successfully.",
data: [],
};
}

const result = await repo.getPrabhagSamitiListRepo();

if (!result.success) {
throw new Error(
result.error || "Failed to fetch Prabhag Samiti list.",
);
}

return {
status: "SUCCESS",
message: "Prabhag Samiti list fetched successfully.",
data: result.rows,
};
};

const saveRoadCuttingService = async (data) => {
const result = await repo.insertRoadCuttingRepo(data);

if (Number(result.errCode) !== 9999) {
return {
success: false,
message:
result.errMsg || "Road Cutting application insertion failed.",
errCode: result.errCode || 1500,
applicationNo: result.applicationNo || "",
};
}

return {
success: true,
message:
result.errMsg || "Application Details Inserted Successfully",
applicationNo: result.applicationNo || "",
errCode: result.errCode,
};
};

module.exports = {
getRoadTypeListService,
getWardListService,
getRoadCuttingTypeListService,
getPrabhagSamitiListService,
saveRoadCuttingService,
};
