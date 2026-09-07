const asyncHandler = require("../../../libs/asyncHandler");
const { fail, ok } = require("../../../libs/response");
const service = require("./FrmChallanGen.service");

exports.getWardDropdownController = asyncHandler(
    async (req, res) => {
        console.log("Ward Dropdown Request:", req.query);

        const { ulbid } = req.query;

        if (!ulbid) {
            return fail(res, "ulbid is required");
        }

        const data = await service.getWardDropdownService({ulbid});
        return ok( res, data, data.message || "Ward dropdown fetched successfully" );
    }
);

exports.getDepartmentDropdownController = asyncHandler(
    async (req, res) => {
        console.log("Department Dropdown Request");
        const data = await service.getDepartmentDropdownService();
        return ok( res, data, data.message || "Department dropdown fetched successfully" );
    }
);

exports.generateChallanController = asyncHandler(
    async (req, res) => {
        console.log("Generate Challan Request:", req.body);

        const {userName, challanDate, receiptFromDate, receiptToDate, wardId, payMode, deptId, ulbid} = req.body;

        if (!userName || String(userName).trim() === "") {
            return fail(res, "Username is required");
        }

        if (!challanDate) {
            return fail(res, "Challan Date is required");
        }

        if (!receiptFromDate) {
            return fail(res, "Receipt From Date is required");
        }

        if (!receiptToDate) {
            return fail(res, "Receipt To Date is required");
        }

        if (!wardId) {
            return fail(res, "Ward is required");
        }

        if (payMode === undefined || payMode === null || payMode === "") {
            return fail(res, "Pay Mode is required");
        }

        if (!deptId) {
            return fail(res, "Department is required");
        }

        if (!ulbid) {
            return fail(res, "ULB ID is required");
        }

        const data = await service.generateChallanService({userName: String(userName).trim(), challanDate, receiptFromDate, receiptToDate, wardId, payMode, deptId, ulbid});

        if (!data.success) {
            return fail(res, data.message || "Failed to generate challan");
        }

        return ok(res, data, data.message || "Challan generated successfully");
    }
);