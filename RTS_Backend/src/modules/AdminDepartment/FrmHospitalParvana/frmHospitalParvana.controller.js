const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./frmHospitalParvana.service");

const getHospitalList = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Get Hospital List (AORTS_HOSPITAL_MAS)");
  console.log("Query Params:", req.query);
  console.log("================================================");

  const filters = {
    search: req.query.search,
    mobileNo: req.query.mobileNo,
    propertyNo: req.query.propertyNo,
    hospitalId: req.query.hospitalId,
  };

  const result = await service.getHospitalListService(filters);

  return ok(res, {
    message: "Hospital records fetched successfully.",
    rowCount: result.rowCount,
    data: result.rows,
  });
});

const getHospitalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("================================================");
  console.log(`Request: Get Hospital Detail for ID: ${id}`);
  console.log("================================================");

  const result = await service.getHospitalByIdService(id);

  return ok(res, {
    message: "Hospital details fetched successfully.",
    data: result.data,
  });
});

const saveHospital = asyncHandler(async (req, res) => {
  console.log("================================================");
  console.log("Request: Save Hospital Application (AORTS_HOSPITAL_INS)");
  console.log("Request Body:", req.body);
  console.log("================================================");

  const result = await service.saveHospitalService(req.body, req.user);

  return ok(res, {
    success: true,
    message: result.message,
    hospitalId: result.hospitalId,
    applicationNo: result.applicationNo,
  });
});

module.exports = {
  getHospitalList,
  getHospitalById,
  saveHospital,
};
