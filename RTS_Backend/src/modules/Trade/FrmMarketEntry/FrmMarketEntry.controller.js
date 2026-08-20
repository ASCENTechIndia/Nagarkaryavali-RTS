const service = require("./FrmMArketEntry.service");

// ============================================================
// GET BUSINESS PLACE
// ============================================================
const getBusinessPlace = async (req, res, next) => {
  try {
    const data = await service.getBusinessPlaceService();

    return res.status(200).json({
      ok: true,
      message: "Business Place fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET JALAN SHIL
// ============================================================
const getJalanShil = async (req, res, next) => {
  try {
    const data = await service.getJalanShilService();

    return res.status(200).json({
      ok: true,
      message: "Jalan Shil fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET ILLEGAL TYPE
// ============================================================
const getIllegalType = async (req, res, next) => {
  try {
    const data = await service.getIllegalTypeService();

    return res.status(200).json({
      ok: true,
      message: "Illegal Type fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET APPLICANT TYPE
// ============================================================
const getApplicantType = async (req, res, next) => {
  try {
    const { ulbId } = req.body;

    if (!ulbId) {
      return res.status(400).json({
        ok: false,
        message: "ULB ID is required",
      });
    }

    const data = await service.getApplicantTypeService(ulbId);

    return res.status(200).json({
      ok: true,
      message: "Applicant Type fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET WARD
// ============================================================
const getWard = async (req, res, next) => {
  try {
    const { ulbId } = req.body;

    if (!ulbId) {
      return res.status(400).json({
        ok: false,
        message: "ULB ID is required",
      });
    }

    const data = await service.getWardService(ulbId);

    return res.status(200).json({
      ok: true,
      message: "Ward fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET LICENSE TYPE
// ============================================================
const getLicenseType = async (req, res, next) => {
  try {
    const data = await service.getLicenseTypeService();

    return res.status(200).json({
      ok: true,
      message: "License Type fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET TRADE CATEGORY
// ============================================================
const getTradeCategory = async (req, res, next) => {
  try {
    const { licenseType, jalanShil } = req.body;

    if (!licenseType) {
      return res.status(400).json({
        ok: false,
        message: "License Type is required",
      });
    }

    if (!jalanShil) {
      return res.status(400).json({
        ok: false,
        message: "Jalan Shil is required",
      });
    }

    const data = await service.getTradeCategoryService(licenseType, jalanShil);

    return res.status(200).json({
      ok: true,
      message: "Trade Category fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET TRADE DETAILS
// ============================================================
const getTradeDetails = async (req, res, next) => {
  try {
    const { ulbId } = req.body;

    if (!ulbId) {
      return res.status(400).json({
        ok: false,
        message: "ULB ID is required",
      });
    }

    const data = await service.getTradeDetailsService(ulbId);

    return res.status(200).json({
      ok: true,
      message: "Trade Details fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET DOCUMENT DETAILS
// ============================================================
const getDocumentDetails = async (req, res, next) => {
  try {
    const { serviceId, ulbId } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        ok: false,
        message: "Service ID is required",
      });
    }

    if (!ulbId) {
      return res.status(400).json({
        ok: false,
        message: "ULB ID is required",
      });
    }

    const data = await service.getDocumentDetailsService(serviceId, ulbId);

    return res.status(200).json({
      ok: true,
      message: "Document Details fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SELF DECLARE DATA
// ============================================================
const getSelfDeclareData = async (req, res, next) => {
  try {
    const { serviceId } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        ok: false,
        message: "Service ID is required",
      });
    }

    const data = await service.getSelfDeclareDataService(serviceId);

    return res.status(200).json({
      ok: true,
      message: "Self Declare Data fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET TRADE TYPE DETAILS
// ============================================================
const getTradeTypeDetails = async (req, res, next) => {
  try {
    const { ulbId, tradeCategoryId, tradeTypeId } = req.body;

    if (!ulbId) {
      return res.status(400).json({
        ok: false,
        message: "ULB ID is required",
      });
    }

    if (!tradeCategoryId) {
      return res.status(400).json({
        ok: false,
        message: "Trade Category ID is required",
      });
    }

    if (!tradeTypeId) {
      return res.status(400).json({
        ok: false,
        message: "Trade Type ID is required",
      });
    }

    const data = await service.getTradeTypeDetailsService(ulbId, tradeCategoryId, tradeTypeId);

    return res.status(200).json({
      ok: true,
      message: "Trade Type Details fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET APPLICATION DETAILS
// ============================================================
const getApplicationDetails = async (req, res, next) => {
  try {
    const { applicationId, ulbId } = req.body;

    console.log("📥 Get Application Details", {
      applicationId,
      ulbId,
    });

    if (!applicationId) {
      return res.status(400).json({
        ok: false,
        message: "Application ID is required",
      });
    }

    if (!ulbId) {
      return res.status(400).json({
        ok: false,
        message: "ULB ID is required",
      });
    }

    const result = await service.getApplicationDetailsService(applicationId, ulbId);

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        message: result.message,
        data: null,
      });
    }

    return res.status(200).json({
      ok: true,
      message: result.message,
      status: result.status,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// APPLICATION ENTRY
// ============================================================
const applicationEntry = async (req, res, next) => {
  try {
    const {
      userId,
      appid,
      appliNo,
      mode,
      oldLicencNo,

      shopName,
      panNo,
      contactNo,
      email,
      address,

      zoneId,
      wardId,
      isProd,
      ownSpace,
      agrmentWith,

      area,
      isCorpNOC,
      busStartYr,
      shopActNo,
      foodlicno,

      licDays,
      applitradeStr,
      applitradetypeStr,
      applidirectorStr,
      source,

      shopNameMar,
      placeOwnerName,
      placeOwnerAddress,

      fromDate,
      toDate,

      amount,
      licType,
      ulbId,
      ipAddress,
      licenseTypeId,
      arrearsAmount,
      serviceId,
      cfcRecno,
      jwalan,
      illegal,
      category,
      propNo,
      trdBusinessType,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        ok: false,
        message: "User ID is required",
      });
    }

    if (!ulbId) {
      return res.status(400).json({
        ok: false,
        message: "ULB ID is required",
      });
    }

    if (!shopName) {
      return res.status(400).json({
        ok: false,
        message: "Shop Name is required",
      });
    }

    if (!contactNo) {
      return res.status(400).json({
        ok: false,
        message: "Contact No is required",
      });
    }

    if (!address) {
      return res.status(400).json({
        ok: false,
        message: "Address is required",
      });
    }

    if (!wardId) {
      return res.status(400).json({
        ok: false,
        message: "Ward ID is required",
      });
    }

    if (!fromDate) {
      return res.status(400).json({
        ok: false,
        message: "From Date is required",
      });
    }

    if (!toDate) {
      return res.status(400).json({
        ok: false,
        message: "To Date is required",
      });
    }

    if (!jwalan) {
      return res.status(400).json({
        ok: false,
        message: "Jwalan is required",
      });
    }

    if (!illegal) {
      return res.status(400).json({
        ok: false,
        message: "Illegal Property is required",
      });
    }

    // --------------------------------------------------------
    // SERVICE
    // --------------------------------------------------------

    const result = await service.applicationEntryService({
      userId,
      appid,
      appliNo,
      mode,
      oldLicencNo,

      shopName,
      panNo,
      contactNo,
      email,
      address,

      zoneId,
      wardId,
      isProd,
      ownSpace,
      agrmentWith,

      area,
      isCorpNOC,
      busStartYr,
      shopActNo,
      foodlicno,

      licDays,
      applitradeStr,
      applitradetypeStr,
      applidirectorStr,
      source,

      shopNameMar,
      placeOwnerName,
      placeOwnerAddress,

      fromDate,
      toDate,

      amount,
      licType,
      ulbId,
      ipAddress,
      licenseTypeId,
      arrearsAmount,
      serviceId,
      cfcRecno,
      jwalan,
      illegal,
      category,
      propNo,
      trdBusinessType,
    });

    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    if (Number(result.errorCode) === 9999) {
      return res.status(200).json({
        ok: true,
        message: result.errorMsg,
        status: "SUCCESS",
        data: {
          appId: result.appId,
          appliNo: result.appliNo,
        },
      });
    }

    // --------------------------------------------------------
    // FAILURE FROM PROCEDURE
    // --------------------------------------------------------

    return res.status(200).json({
      ok: false,
      message: result.errorMsg,
      status: "FAILED",
      data: {
        errorCode: result.errorCode,
        appId: result.appId,
        appliNo: result.appliNo,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinessPlace,
  getJalanShil,
  getIllegalType,
  getApplicantType,
  getWard,
  getLicenseType,
  getTradeCategory,
  getTradeDetails,
  getDocumentDetails,
  getSelfDeclareData,
  getTradeTypeDetails,
  getApplicationDetails,
  applicationEntry,
};
