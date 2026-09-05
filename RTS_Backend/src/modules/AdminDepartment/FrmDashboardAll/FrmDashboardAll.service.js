const repo = require("./FrmDashboardAll.repo");
const { AppError } = require("../../../libs/errors");

// =====================================================
// Get Department Details
// =====================================================

const getDepartmentDetailsService = async ({ fromDate, toDate, ulbId, wardId, ward }) => {
  if (!fromDate) {
    throw new AppError("fromDate is required", 400);
  }

  if (!toDate) {
    throw new AppError("toDate is required", 400);
  }

  // Ward-wise API requires both
  // wardId and ward when ward-wise data is requested.
  //
  // If both are empty, department-wise data is returned.

  if ((wardId && !ward) || (!wardId && ward)) {
    throw new AppError("wardId and ward must be provided together", 400);
  }

  if (wardId && isNaN(Number(wardId))) {
    throw new AppError("wardId must be a valid number", 400);
  }

  if (ulbId && isNaN(Number(ulbId))) {
    throw new AppError("ulbId must be a valid number", 400);
  }

  return await repo.getDepartmentDetailsRepo({
    fromDate,
    toDate,
    ulbId,
    wardId,
    ward,
  });
};

// =====================================================
// Parse DD/MM/YYYY
// =====================================================
const parseDate = (value, fieldName) => {
  if (!value) {
    throw new AppError(`${fieldName} is required`, 400);
  }

  if (typeof value !== "string") {
    throw new AppError(`${fieldName} must be in DD/MM/YYYY format`, 400);
  }

  const parts = value.trim().split("/");

  if (parts.length !== 3) {
    throw new AppError(`${fieldName} must be in DD/MM/YYYY format`, 400);
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  // Basic numeric validation
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    throw new AppError(`${fieldName} must be in DD/MM/YYYY format`, 400);
  }

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    throw new AppError(`${fieldName} is invalid`, 400);
  }

  const date = new Date(year, month - 1, day, 0, 0, 0, 0);

  // Validate actual calendar date
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new AppError(`${fieldName} is invalid`, 400);
  }

  return date;
};

// =====================================================
// Get Service Details
// =====================================================
const getServiceDetailsService = async ({ deptId, dept, wardId, ward, fromDate, toDate, ulbId }) => {
  // -----------------------------------------------
  // Required Department
  // -----------------------------------------------
  if (!deptId) {
    throw new AppError("Department ID is required", 400);
  }

  if (!dept) {
    throw new AppError("Department name is required", 400);
  }

  // -----------------------------------------------
  // Date conversion
  // -----------------------------------------------
  const parsedFromDate = parseDate(fromDate, "fromDate");
  const parsedToDate = parseDate(toDate, "toDate");

  // -----------------------------------------------
  // Date validation
  // -----------------------------------------------
  if (parsedFromDate > parsedToDate) {
    throw new AppError("From date cannot be greater than To date", 400);
  }

  // -----------------------------------------------
  // Ward-wise validation
  // -----------------------------------------------
  if (wardId && ward && !ulbId) {
    throw new AppError("ULB ID is required for ward-wise service details", 400);
  }

  return await repo.getServiceDetailsRepo({
    deptId,
    dept,
    wardId,
    ward,
    fromDate: parsedFromDate,
    toDate: parsedToDate,
    ulbId,
  });
};

// =====================================================
// Get Ward Wise Details
// =====================================================
const getWardWiseDetailsService = async ({ fromDate, toDate, ulbId }) => {
  if (!ulbId) {
    throw new AppError("ULB ID is required", 400);
  }

  const parsedFromDate = parseDate(fromDate, "fromDate");
  const parsedToDate = parseDate(toDate, "toDate");

  if (parsedFromDate > parsedToDate) {
    throw new AppError("From date cannot be greater than To date", 400);
  }

  return await repo.getWardWiseDetailsRepo({
    fromDate: parsedFromDate,
    toDate: parsedToDate,
    ulbId,
  });
};

const getApplicationDetailsService = async ({ deptId, dept, servId, serv, wardId, ward, fromDate, toDate, ulbId }) => {
  // ================================================
  // Required fields
  // ================================================
  if (!servId) {
    throw new AppError("Service ID is required", 400);
  }

  if (!serv) {
    throw new AppError("Service name is required", 400);
  }

  if (!ulbId) {
    throw new AppError("ULB ID is required", 400);
  }

  // ================================================
  // Date conversion
  // DD/MM/YYYY -> JS Date
  // ================================================
  const parsedFromDate = parseDate(fromDate, "fromDate");
  const parsedToDate = parseDate(toDate, "toDate");

  // ================================================
  // Date validation
  // ================================================
  if (parsedFromDate > parsedToDate) {
    throw new AppError("From date cannot be greater than To date", 400);
  }

  // ================================================
  // Ward-wise validation
  // Legacy:
  // if (WardId != null && WardId != "")
  // ================================================
  if (wardId) {
    if (!deptId) {
      throw new AppError("Department ID is required for ward-wise application details", 400);
    }

    if (!dept) {
      throw new AppError("Department name is required for ward-wise application details", 400);
    }

    if (!ward) {
      throw new AppError("Ward name is required for ward-wise application details", 400);
    }
  }

  return await repo.getApplicationDetailsRepo({
    deptId,
    dept,
    servId,
    serv,
    wardId,
    ward,
    fromDate: parsedFromDate,
    toDate: parsedToDate,
    ulbId,
  });
};

const getStepsService = async ({ appNo, ulbId }) => {

  if (!appNo) {
    throw new AppError("Application Number is required", 400);
  }

  if (!ulbId) {
    throw new AppError("ULB ID is required", 400);
  }

  return await repo.getStepsRepo({
    appNo,
    ulbId,
  });
};

module.exports = {
  getDepartmentDetailsService,
  getServiceDetailsService,
  getWardWiseDetailsService,
  getApplicationDetailsService,
  getStepsService
};
