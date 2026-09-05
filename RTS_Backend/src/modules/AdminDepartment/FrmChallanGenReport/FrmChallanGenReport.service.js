const repo = require("./FrmChallanGenReport.repo");
const { AppError } = require("../../../libs/errors");

async function getPrabhagListService(ulbId) {
  if (!ulbId) {
    throw new AppError("ULB ID is required", 400);
  }

  const result = await repo.getPrabhagList(ulbId);

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function getDepartmentListService() {
  const result = await repo.getDepartmentList();

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  return {
    success: true,
    rowCount: result.rows.length,
    rows: result.rows,
  };
}

async function generateChallanReportService(params) {
  const {
    ulbId,
    fromDate,
    toDate,
    challanDate,
    prabhagId,
    deptId
  } = params;

  if (!ulbId) {
    throw new AppError("ULB ID is required", 400);
  }

  if (!fromDate) {
    throw new AppError("From Date is required", 400);
  }

  if (!toDate) {
    throw new AppError("To Date is required", 400);
  }

  if (!prabhagId) {
    throw new AppError("Prabhag is required", 400);
  }

  if (!deptId) {
    throw new AppError("Department is required", 400);
  }

  const result = await repo.getChallanReportData({
    ulbId,
    fromDate,
    toDate,
    prabhagId,
    deptId,
  });

  if (!result.success) {
    throw new AppError(result.error, 500);
  }

  if (result.rows.length === 0) {
    return {
      success: false,
      message: "Challan Not Found",
      data: null,
    };
  }

  return {
    success: true,
    message: "Report generated successfully",
    data: result.rows,
    rowCount: result.rows.length,
  };
}

module.exports = {
  getPrabhagListService,
  getDepartmentListService,
  generateChallanReportService
};