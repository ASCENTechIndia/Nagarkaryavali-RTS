const repo = require("./FrmSecondAppealAutoRpt.repo");

async function getSecondAppealReportService(filters) {
  if (!filters.fromDate || !filters.toDate) throw new Error("Date range is required", 400);

  return await repo.fetchSecondAppealReport(filters);
}

module.exports = { getSecondAppealReportService };
