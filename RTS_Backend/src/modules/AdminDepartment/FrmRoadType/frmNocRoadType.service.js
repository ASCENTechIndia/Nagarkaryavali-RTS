const repo = require("./frmNocRoadType.repo");

const getNocRoadTypeListService = async () => {
  const result = await repo.getNocRoadTypeListRepo();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch NOC road type list.");
  }

  return {
    success:  true,
    rows:     result.rows,
    rowCount: result.rows.length,
  };
};

const saveNocRoadTypeService = async ({
  userId,
  roadTypeId,
  roadTypeName,
  ulbId,
  mode,
  ipAddress,
  ipSource,
}) => {
  if (!userId) {
    throw new Error("userId is required.");
  }

  if (!roadTypeName || !String(roadTypeName).trim()) {
    throw new Error("roadTypeName is required.");
  }

  if (!ulbId) {
    throw new Error("ulbId is required.");
  }

  const result = await repo.saveNocRoadTypeRepo({
    userId,
    roadTypeId: roadTypeId || 0,
    roadTypeName: String(roadTypeName).trim(),
    ulbId,
    mode:       Number(mode || 1),
    ipAddress:  ipAddress  || "",
    ipSource:   ipSource   || "WEB",
  });

  if (!result.success) {
    return {
      success:  false,
      errCode:  result.errCode,
      message:  result.errMsg || "Failed to save NOC road type.",
    };
  }

  const operationMap = { 1: "INSERT", 2: "UPDATE", 3: "DELETE" };
  const msgMap = {
    1: "Road type added successfully.",
    2: "Road type updated successfully.",
    3: "Road type deleted successfully.",
  };

  return {
    success:   true,
    errCode:   result.errCode,
    message:   msgMap[Number(mode)] || result.errMsg,
    operation: operationMap[Number(mode)] || "UNKNOWN",
  };
};

module.exports = {
  getNocRoadTypeListService,
  saveNocRoadTypeService,
};
