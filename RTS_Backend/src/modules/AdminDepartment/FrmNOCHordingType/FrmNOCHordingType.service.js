const repo = require("./FrmNOCHordingType.repo");

const getNOCHordingTypeListService = async ({
  ulbId
}) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  return await repo.getNOCHordingTypeListRepo({
    ulbId
  });
};

const getNOCHordingTypeByIdService = async (categoryId) => {
  if (!hordId) {
    throw new Error("Hording ID is required.");
  }

  return await repo.getNOCHordingTypeByIdRepo(hordId);
};

const saveNOCHordingTypeService = async ({
  userId,
  categoryTradeId,
  tradeTypeId,
  type,
  jwalan,
  status,
  mode,
}) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!categoryTradeId) {
    throw new Error("Category Trade ID is required.");
  }

  if (!tradeTypeId) {
    throw new Error("Trade Type ID is required.");
  }

  if (mode === undefined || mode === null) {
    throw new Error("Mode is required.");
  }

  if (![1, 2].includes(Number(mode))) {
    throw new Error("Mode must be 1 or 2.");
  }

  if (!type) {
    throw new Error("Type is required.");
  }

  if (!status) {
    throw new Error("Status is required.");
  }

  return await repo.saveNOCHordingTypeRepo({
    userId,
    categoryTradeId,
    tradeTypeId,
    type,
    jwalan,
    status,
    mode,
  });
};

module.exports = {
    getNOCHordingTypeListService,
    getNOCHordingTypeByIdService,
    saveNOCHordingTypeService
};