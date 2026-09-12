const repo = require("./FrmNOCHordingType.repo");

const getNOCHordingTypeListService = async ({ ulbId }) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  return await repo.getNOCHordingTypeListRepo({ ulbId });
};

const getNOCHordingTypeByIdService = async (hordId) => {
  if (!hordId) {
    throw new Error("Hording ID is required.");
  }

  return await repo.getNOCHordingTypeByIdRepo(hordId);
};

const saveNOCHordingTypeService = async ({
  userId,
  hordingTypeId,
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
    throw new Error("Hoarding Type Name is required.");
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

  if (Number(mode) === 2 && !hordingTypeId) {
    throw new Error("Hording Type ID is required for update.");
  }

  if (Number(mode) === 3 && !hordingTypeId) {
    throw new Error("Hording Type ID is required for delete.");
  }

  return await repo.saveNOCHordingTypeRepo({
    userId,
    hordingTypeId,
    name,
    ulbId,
    mode,
    ipAddress: ipAddress || "",
    ipSource: ipSource || "",
  });
};

module.exports = {
  getNOCHordingTypeListService,
  getNOCHordingTypeByIdService,
  saveNOCHordingTypeService,
};