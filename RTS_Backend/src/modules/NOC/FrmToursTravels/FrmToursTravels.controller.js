const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmToursTravels.service");

exports.submitApplication = asyncHandler(async (req, res) => {
  const {
    userId, ulbId, serviceId, deptId, zoneId,
    firstName, middleName, lastName, address,
    mobileNo, aadhaarNo, panCardNo, emailId,
    orgName, orgAddress,
    businessType, businessDescription,
    propertyNo, businessAddress,
    waterConnectionNo, permitFromDate, permitToDate,
    occupancyCertificateNo, roadType,
    roadLength, roadWidth, roadLengthWidth,
    excavationArea, excavationStartPoint, excavationEndPoint,
    latitude, longitude, hospitalName, healthAgencyNo,
    fixedArea, newHoarding, hoardingNumber,
    advertisingArea, numberOfDays,
    hoardingType, hoardingSubType,
    businessLicenseNo,
    buildingPermissionProposalNo,
    licenseType,
  } = req.body;

  if (!userId) return fail(res, "User ID is required");
  if (!ulbId) return fail(res, "ULB ID is required");
  if (!serviceId) return fail(res, "Service ID is required");
  if (!deptId) return fail(res, "Department ID is required");

  const result = await service.submitNOCApplicationService({
    userId, ulbId, serviceId, deptId, zoneId,
    firstName, middleName, lastName, address,
    mobileNo, aadhaarNo, panCardNo, emailId,
    orgName, orgAddress,
    businessType, businessDescription,
    propertyNo, businessAddress,
    waterConnectionNo, permitFromDate, permitToDate,
    occupancyCertificateNo, roadType,
    roadLength, roadWidth, roadLengthWidth,
    excavationArea, excavationStartPoint, excavationEndPoint,
    latitude, longitude, hospitalName, healthAgencyNo,
    fixedArea, newHoarding, hoardingNumber,
    advertisingArea, numberOfDays,
    hoardingType, hoardingSubType,
    businessLicenseNo,
    buildingPermissionProposalNo,
    licenseType,
  });

  if (!result.success) {
    return fail(res, result.message || "Application submission failed");
  }

  return ok(res, result, result.message || "NOC application submitted successfully");
});

exports.getServiceFields = asyncHandler(async (req, res) => {
  const { serviceId, deptId, ulbId } = req.body;

  if (!serviceId) return fail(res, "Service ID is required");
  if (!deptId) return fail(res, "Department ID is required");
  if (!ulbId) return fail(res, "ULB ID is required");

  const result = await service.getServiceFieldsService({
    serviceId,
    deptId,
    ulbId,
  });

  if (!result.success) {
    return fail(res, result.message || "Failed to fetch fields");
  }

  return ok(res, result, "Service fields fetched successfully");
});


exports.getBusinessTypeDropdownController = asyncHandler(
    async (req, res) => {
        console.log("Business Type Dropdown Request:", req.query);

        const { ulbid } = req.query;

        if (!ulbid) {
            return fail(res, "ulbid is required");
        }

        const data = await service.getBusinessTypeDropdownService({ ulbid });

        return ok(
            res,
            data,
            data.message || "Business type dropdown fetched successfully"
        );
    }
);

exports.getRoadTypeDropdownController = asyncHandler(
    async (req, res) => {
        console.log("Road Type Dropdown Request:", req.query);

        const { ulbid } = req.query;

        if (!ulbid) {
            return fail(res, "ulbid is required");
        }

        const data = await service.getRoadTypeDropdownService({ ulbid });

        return ok(
            res,
            data,
            data.message || "Road type dropdown fetched successfully"
        );
    }
);