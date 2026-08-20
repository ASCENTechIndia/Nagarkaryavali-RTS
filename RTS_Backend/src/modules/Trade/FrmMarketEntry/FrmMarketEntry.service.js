const repo = require("./FrmMarketEntry.repo");

// ============================================================
// GET BUSINESS PLACE
// ============================================================
const getBusinessPlaceService = async () => {
  return await repo.getBusinessPlaceRepo();
};

// ============================================================
// GET JALAN SHIL
// ============================================================
const getJalanShilService = async () => {
  return await repo.getJalanShilRepo();
};

// ============================================================
// GET ILLEGAL TYPE
// ============================================================
const getIllegalTypeService = async () => {
  return await repo.getIllegalTypeRepo();
};

// ============================================================
// GET APPLICANT TYPE
// ============================================================
const getApplicantTypeService = async (ulbId) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  return await repo.getApplicantTypeRepo(ulbId);
};

// ============================================================
// GET WARD
// ============================================================
const getWardService = async (ulbId) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  return await repo.getWardRepo(ulbId);
};

// ============================================================
// GET LICENSE TYPE
// ============================================================
const getLicenseTypeService = async () => {
  return await repo.getLicenseTypeRepo();
};

// ============================================================
// GET TRADE CATEGORY
// ============================================================
const getTradeCategoryService = async (licenseType, jalanShil) => {
  if (!licenseType) {
    throw new Error("License Type is required.");
  }

  if (!jalanShil) {
    throw new Error("Jalan Shil is required.");
  }

  return await repo.getTradeCategoryRepo(licenseType, jalanShil);
};

// ============================================================
// GET TRADE DETAILS
// ============================================================
const getTradeDetailsService = async (ulbId) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  return await repo.getTradeDetailsRepo(ulbId);
};

// ============================================================
// GET DOCUMENT DETAILS
// ============================================================
const getDocumentDetailsService = async (serviceId, ulbId) => {
  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  return await repo.getDocumentDetailsRepo(serviceId, ulbId);
};

// ============================================================
// GET SELF DECLARE DATA
// ============================================================
const getSelfDeclareDataService = async (serviceId) => {
  if (!serviceId) {
    throw new Error("Service ID is required.");
  }

  return await repo.getSelfDeclareDataRepo(serviceId);
};

// ============================================================
// GET TRADE TYPE DETAILS
// ============================================================
const getTradeTypeDetailsService = async (ulbId, tradeCategoryId, tradeTypeId) => {
  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  if (!tradeCategoryId) {
    throw new Error("Trade Category ID is required.");
  }

  if (!tradeTypeId) {
    throw new Error("Trade Type ID is required.");
  }

  return await repo.getTradeTypeDetailsRepo(ulbId, tradeCategoryId, tradeTypeId);
};

// ============================================================
// GET APPLICATION DETAILS
// ============================================================
const getApplicationDetailsService = async (applicationId, ulbId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (!ulbId) {
    throw new Error("ULB ID is required.");
  }

  // ----------------------------------------------------------
  // APPLICATION MASTER
  // ----------------------------------------------------------
  const application = await repo.getApplicationDetailsRepo(applicationId, ulbId);

  // ----------------------------------------------------------
  // NO DATA
  // ----------------------------------------------------------
  if (!application || application.length === 0) {
    return {
      success: false,
      status: "NOT_FOUND",
      message: "Application details not found",
      data: null,
    };
  }

  // ----------------------------------------------------------
  // TRADE TYPE DETAILS
  // ----------------------------------------------------------
  const tradeTypeDetails = await repo.getApplicationTradeTypeDetailsRepo(applicationId, ulbId);

  // ----------------------------------------------------------
  // TRADE DETAILS
  // ----------------------------------------------------------
  const tradeDetails = await repo.getApplicationTradeDetailsRepo(applicationId);

  // ----------------------------------------------------------
  // DIRECTOR DETAILS
  // ----------------------------------------------------------
  const directorDetails = await repo.getApplicationDirectorDetailsRepo(applicationId);

  // ----------------------------------------------------------
  // DOCUMENT DETAILS
  // ----------------------------------------------------------
  const documentDetails = await repo.getApplicationDocumentDetailsRepo(applicationId, ulbId);

  // ----------------------------------------------------------
  // RETURN COMPLETE APPLICATION DATA
  // ----------------------------------------------------------
  return {
    success: true,
    status: "FOUND",
    message: "Application details fetched successfully",
    data: {
      application: application[0],
      tradeTypeDetails,
      tradeDetails,
      directorDetails,
      documentDetails,
    },
  };
};


// ============================================================
// APPLICATION ENTRY
// ============================================================
const applicationEntryService = async (data) => {
  return await repo.applicationEntryRepo(data);
};  


module.exports = {
  getBusinessPlaceService,
  getJalanShilService,
  getIllegalTypeService,
  getApplicantTypeService,
  getWardService,
  getLicenseTypeService,
  getTradeCategoryService,
  getTradeDetailsService,
  getDocumentDetailsService,
  getSelfDeclareDataService,
  getTradeTypeDetailsService,
  getApplicationDetailsService,
  applicationEntryService
};
