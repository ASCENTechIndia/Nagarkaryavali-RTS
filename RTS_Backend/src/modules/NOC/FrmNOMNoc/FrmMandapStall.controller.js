const asyncHandler = require("../../../libs/asyncHandler");

const { ok, fail } = require("../../../libs/response");

const service = require("./FrmMandapStall.service");

exports.submitApplication = asyncHandler(
    async (req, res) => {
   
        const {
            userId,
            applicantName,
            mobileNo,
            emailId,
            aadhaarNo,
            residentialAddress,
            panCardNo,
            orgName,
            orgAddress,
            businessType,
            businessDescription,
            permissionFrom,
            permissionTo,
            propertyNo,
            businessAddress,
            mandapArea,
        } = req.body;

      
        if (!userId) {
            return fail(
                res,
                "User ID is required"
            );
        }

        if (!applicantName) {
            return fail(
                res,
                "Applicant Name is required"
            );
        }

        if (!mobileNo) {
            return fail(
                res,
                "Mobile Number is required"
            );
        }

        if (String(mobileNo).length !== 10) {
            return fail(
                res,
                "Mobile Number must be 10 digits"
            );
        }

      
        if (!emailId) {
            return fail(
                res,
                "Email ID is required"
            );
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(
                String(emailId).trim()
            )
        ) {
            return fail(
                res,
                "Invalid Email Address"
            );
        }

        if (!propertyNo) {
            return fail(
                res,
                "Property Number is required"
            );
        }

        if (!businessAddress) {
            return fail(
                res,
                "Business Address is required"
            );
        }

        if (!mandapArea) {
            return fail(
                res,
                "Mandap Area is required"
            );
        }

        if (!permissionFrom) {
            return fail(
                res,
                "Permission From date is required"
            );
        }

        if (!permissionTo) {
            return fail(
                res,
                "Permission To date is required"
            );
        }

        if (
            aadhaarNo &&
            String(aadhaarNo).length !== 12
        ) {
            return fail(
                res,
                "Aadhar Number must be 12 digits"
            );
        }

        if (
            businessType !== undefined &&
            businessType !== null &&
            businessType !== ""
        ) {
            const businessTypeNumber =
                Number(businessType);

            if (Number.isNaN(businessTypeNumber)) {
                return fail(
                    res,
                    "Invalid Business Type"
                );
            }
        }

      
        const result =
            await service.submitMandapStallApplicationService(
                {
                    userId,

                    applicantName,

                    mobileNo,

                    emailId:
                        String(emailId).trim(),

                    aadhaarNo,

                    residentialAddress,

                    panCardNo,

                    orgName,

                    orgAddress,

                    businessType,

                    businessDescription,

                    permissionFrom,

                    permissionTo,

                    propertyNo,

                    businessAddress,

                    mandapArea,
                }
            );

      
        if (!result.success) {
            return fail(
                res,
                result.message ||
                    "Mandap / Stall application submission failed"
            );
        }

        return ok(
            res,
            result,
            result.message ||
                "Mandap / Stall application submitted successfully"
        );
    }
);