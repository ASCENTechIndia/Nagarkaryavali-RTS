const repo = require("./frmAppliReportEMst.repo");

const getServiceListService = async () => {
  const result = await repo.getServiceListRepo();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch service list.");
  }

  return {
    success:  true,
    rows:     result.rows,
    rowCount: result.rows.length,
  };
};


const getZoneListService = async () => {
  const result = await repo.getZoneListRepo();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch zone list.");
  }

  return {
    success:  true,
    rows:     result.rows,
    rowCount: result.rows.length,
  };
};


const getAppliReportService = async ({
  serviceId,
  fromDate,
  toDate,
  zoneId,
  appliNo,
  mobileNo,
}) => {
  const result = await repo.getAppliReportRepo({
    serviceId,
    fromDate,
    toDate,
    zoneId,
    appliNo,
    mobileNo,
  });

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch appli report.");
  }

  return {
    success:  true,
    rows:     result.rows,
    rowCount: result.rows.length,
  };
};


const getAppliDocumentsService = async ({
  appliNo,
  authMode,
}) => {
  try {
    if (!appliNo || !String(appliNo).trim()) {
      return {
        success: false,
        error: "appliNo is required.",
        rows: [],
        rowCount: 0,
      };
    }

    const result =
      await repo.getAppliDocumentsRepo({
        appliNo: String(appliNo).trim(),
        authMode: authMode || "HO",
      });

    if (!result?.success) {
      return {
        success: false,
        error:
          result?.error ||
          "Failed to fetch application documents.",
        rows: [],
        rowCount: 0,
      };
    }

    const rows = Array.isArray(result.rows)
      ? result.rows
      : [];

    return {
      success: true,
      rows,
      rowCount: rows.length,
    };
  } catch (error) {
    console.error(
      "GET APPLI DOCUMENTS SERVICE ERROR:",
      error
    );

    return {
      success: false,
      error: error.message,
      rows: [],
      rowCount: 0,
    };
  }
};

module.exports = {
  getServiceListService,
  getZoneListService,
  getAppliReportService,
  getAppliDocumentsService,
};
