const repo = require("./FrmRTSOnlineColl.repo");

async function getDepartmentsService() {
  const rows = await repo.fetchDepartments();
  return {
    success: true,
    departments: rows.map(r => ({
      deptName: r.DEPTNAME,
      deptId: r.DEPTID
    }))
  };
}

async function getApplicationsSummaryService({ fromDate, toDate, deptId }) {
  if (!fromDate || !toDate) throw new Error("Date range is required", 400);

  const rows = await repo.fetchApplicationsSummary({ fromDate, toDate, deptId });

  return {
    success: true,
    summary: rows.map(r => ({
      serviceId: r.SERVICEID,
      serviceName: r.SERVICENAME,
      amount: r.AMOUNT,
      appCount: r.APPCOUNT
    }))
  };
}

async function getApplicationsDetailService(filters) {
  if (!filters.fromDate || !filters.toDate) throw new Error("Date range is required");
  if (!filters.serviceId) throw new Error("Service ID is required");

  return await repo.fetchApplicationsDetail(filters);
}

module.exports = { getDepartmentsService, getApplicationsSummaryService ,getApplicationsDetailService};
