const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const { AppError } = require("../../../libs/errors");

const service = require("./frmAppliReportEMst.service");

const getServiceList = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get Service List");
  console.log("================================================");

  const result = await service.getServiceListService();

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch service list.", 500);
  }

  return ok(res, {
    message:  "Service list fetched successfully.",
    rowCount: result.rowCount,
    data:     result.rows,
  });
});


const getZoneList = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get Zone List");
  console.log("================================================");

  const result = await service.getZoneListService();

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch zone list.", 500);
  }

  return ok(res, {
    message:  "Zone list fetched successfully.",
    rowCount: result.rowCount,
    data:     result.rows,
  });
});


const getAppliReport = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get Appli Report");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const {
    serviceId,
    fromDate,
    toDate,
    zoneId,
    appliNo,
    mobileNo,
  } = req.body;

  const result = await service.getAppliReportService({
    serviceId,
    fromDate,
    toDate,
    zoneId,
    appliNo,
    mobileNo,
  });

  if (!result.success) {
    throw new AppError(result.error || "Failed to fetch appli report.", 500);
  }

  return ok(res, {
    message:  "Appli report fetched successfully.",
    rowCount: result.rowCount,
    data:     result.rows,
  });
});

const getAppliDocuments = asyncHandler(
  async (req, res) => {
    console.log(
      "================================================"
    );

    console.log("Request: Get Appli Documents");

    console.log("Request Body:", req.body);

    console.log(
      "================================================"
    );

    const {
      appliNo,
      authMode = "HO",
    } = req.body;

    if (!appliNo || !String(appliNo).trim()) {
      throw new AppError(
        "appliNo is required.",
        400
      );
    }

    const result =
      await service.getAppliDocumentsService({
        appliNo: String(appliNo).trim(),
        authMode,
      });

    if (!result.success) {
      throw new AppError(
        result.error ||
          "Failed to fetch application documents.",
        500
      );
    }

    return ok(
      res,
      {
        rowCount: result.rowCount,
        data: result.rows,
      },
      "Application documents fetched successfully."
    );
  }
);

module.exports = {
  getServiceList,
  getZoneList,
  getAppliReport,
  getAppliDocuments,
};
