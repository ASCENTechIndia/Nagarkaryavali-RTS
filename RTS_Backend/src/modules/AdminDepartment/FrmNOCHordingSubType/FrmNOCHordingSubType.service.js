const repo = require("./FrmNOCHordingSubType.repo");

const getNOCHordingSubTypeListService = async ({ ulbId }) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  return await repo.getNOCHordingSubTypeListRepo({ ulbId });
};

const getNOCHordingSubTypeByIdService = async (subTypeId) => {
  if (!subTypeId) {
    throw new Error("Sub Type ID is required.");
  }

  return await repo.getNOCHordingSubTypeByIdRepo(subTypeId);
};

const saveNOCHordingSubTypeService = async ({
  userId,
  subTypeId,
  hordId,
  name,
  ulbId,
  mode,
  ipAddress,
  ipSource,
}) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!name) {
    throw new Error("Hoarding Sub Type Name is required.");
  }

  if (!hordId) {
    throw new Error("Hoarding Type ID is required.");
  }

  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  if (mode === undefined || mode === null) {
    throw new Error("Mode is required.");
  }

  if (![1, 2, 3].includes(Number(mode))) {
    throw new Error("Mode must be 1, 2 or 3.");
  }

  if (Number(mode) === 2 && !subTypeId) {
    throw new Error("Sub Type ID is required for update.");
  }

  if (Number(mode) === 3 && !subTypeId) {
    throw new Error("Sub Type ID is required for delete.");
  }

  return await repo.saveNOCHordingSubTypeRepo({
    userId,
    subTypeId,
    hordId,
    name,
    ulbId,
    mode,
    ipAddress: ipAddress || "",
    ipSource: ipSource || "",
  });
};

module.exports = {
  getNOCHordingSubTypeListService,
  getNOCHordingSubTypeByIdService,
  saveNOCHordingSubTypeService,
};