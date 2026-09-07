const service = require("./FrmDashboardAll.service");
const asyncHandler = require("../../../libs/asyncHandler");
// =====================================================
// Get Department Details
// =====================================================

const getDepartmentDetails = asyncHandler(async (req, res) => {
  const { fromDate, toDate, ulbId, wardId, ward } = req.body;

  const result = await service.getDepartmentDetailsService({
    fromDate,
    toDate,
    ulbId,
    wardId,
    ward,
  });

  return res.json({
    success: true,
    status: "SUCCESS",
    message: "Department details fetched successfully.",
    data: result.rows,
    rowCount: result.rowCount,
  });
});

// =====================================================
// Get Service Details
// =====================================================
const getServiceDetails = asyncHandler(async (req, res) => {
  const { deptId, dept, wardId, ward, fromDate, toDate, ulbId } = req.body;

  const result = await service.getServiceDetailsService({
    deptId,
    dept,
    wardId,
    ward,
    fromDate,
    toDate,
    ulbId,
  });

  return res.json({
    success: true,
    status: "SUCCESS",
    message: "Service details fetched successfully.",
    data: result.rows,
    rowCount: result.rowCount,
  });
});

const getWardWiseDetails = asyncHandler(async (req, res) => {
  const { fromDate, toDate, ulbId } = req.body;

  const result = await service.getWardWiseDetailsService({
    fromDate,
    toDate,
    ulbId,
  });

  return res.json({
    success: true,
    status: "SUCCESS",
    message: "Ward wise details fetched successfully.",
    data: result.rows,
    rowCount: result.rowCount,
  });
});

const getApplicationDetails = asyncHandler(async (req, res) => {
  const { deptId, dept, servId, serv, wardId, ward, fromDate, toDate, ulbId } = req.body;

  const result = await service.getApplicationDetailsService({
    deptId,
    dept,
    servId,
    serv,
    wardId,
    ward,
    fromDate,
    toDate,
    ulbId,
  });

  return res.json({
    success: true,
    status: "SUCCESS",
    message: "Application details fetched successfully.",
    data: result.rows,
    rowCount: result.rowCount,
  });
});

const getSteps = asyncHandler(async (req, res) => {
  const { appNo, ulbId } = req.body;

  const result = await service.getStepsService({
    appNo,
    ulbId,
  });

  return res.json({
    success: true,
    status: "SUCCESS",
    message: "Application details fetched successfully.",
    data: result.rows,
    rowCount: result.rowCount,
  });
});

module.exports = {
  getDepartmentDetails,
  getServiceDetails,
  getWardWiseDetails,
  getApplicationDetails,
  getSteps
};
