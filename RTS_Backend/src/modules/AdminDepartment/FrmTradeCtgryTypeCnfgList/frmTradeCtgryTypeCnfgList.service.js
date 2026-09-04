const repo = require("./frmTradeCtgryTypeCnfgList.repo");

const getTradeTypeConfigListService = async () => {
  return await repo.getTradeTypeConfigListRepo();
};


const getTradeCategoriesService = async () => {
  return await repo.getTradeCategoriesRepo();
};

const getCategoryTypeConfigService = async ({
  categoryId,
  categoryTypeId,
}) => {
  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  if (!categoryTypeId) {
    throw new Error("Category Type ID is required.");
  }

  return await repo.getCategoryTypeConfigRepo({
    categoryId,
    categoryTypeId,
  });
};

const getTradeTypesService = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  return await repo.getTradeTypesRepo(categoryId);
};

const saveTradeTypeConfigService = async ({
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

  return await repo.saveTradeTypeConfigRepo({
    userId,
    categoryTradeId,
    tradeTypeId,
    type,
    jwalan,
    status,
    mode,
  });
};

const getTradeCategoriesConfigService = async (ulbId) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  return await repo.getTradeCategoriesConfigRepo(ulbId);
};

const getTradeCategoryByIdService = async (categoryId) => {
  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  return await repo.getTradeCategoryByIdRepo(categoryId);
};

const saveTradeCategoryService = async ({
  userId,
  categoryTradeId,
  category,
  status,
  ulbId,
  mode,
}) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (mode === undefined || mode === null) {
    throw new Error("Mode is required.");
  }

  if (![1, 2].includes(Number(mode))) {
    throw new Error("Mode must be 1 or 2.");
  }

  if (!category) {
    throw new Error("Category is required.");
  }

  if (!status) {
    throw new Error("Status is required.");
  }

  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  /*
   * For INSERT mode the procedure generates the category ID.
   * Therefore categoryTradeId is not required for mode 1.
   *
   * For UPDATE mode it is required.
   */
  if (Number(mode) === 2 && !categoryTradeId) {
    throw new Error("Category Trade ID is required for update.");
  }

  return await repo.saveTradeCategoryRepo({
    userId,
    categoryTradeId: categoryTradeId || 0,
    category,
    status,
    ulbId,
    mode: Number(mode),
  });
};
module.exports = {
 
  getTradeTypeConfigListService,
  getTradeCategoriesService,
  getCategoryTypeConfigService,
  getTradeTypesService,
  saveTradeTypeConfigService,
  getTradeCategoriesConfigService,
  getTradeCategoryByIdService,
  saveTradeCategoryService

};