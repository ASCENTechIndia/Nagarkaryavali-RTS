const repo = require("./FrmFirstAppealAuthoRpt.repo");

async function getAppealReportService(filters) {
  if (!filters.fromDate || !filters.toDate) throw new Error("Date range is required", 400);

  return await repo.fetchAppealReport(filters);
}

module.exports = { getAppealReportService };
