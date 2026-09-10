const repo = require("./FrmMandapStall.repo");

const { AppError } = require("../../../libs/errors");

async function submitMandapStallApplicationService(payload) {
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
    } = payload;

    if (!userId) {
        throw new AppError(
            "User ID is required",
            400
        );
    }

    if (!applicantName) {
        throw new AppError(
            "Applicant Name is required",
            400
        );
    }

    if (!mobileNo) {
        throw new AppError(
            "Mobile Number is required",
            400
        );
    }

    if (String(mobileNo).length !== 10) {
        throw new AppError(
            "Mobile Number must be 10 digits",
            400
        );
    }

    if (!emailId) {
        throw new AppError(
            "Email ID is required",
            400
        );
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(String(emailId).trim())) {
        throw new AppError(
            "Invalid Email Address",
            400
        );
    }

    if (!propertyNo) {
        throw new AppError(
            "Property Number is required",
            400
        );
    }


    if (!businessAddress) {
        throw new AppError(
            "Business Address is required",
            400
        );
    }


    if (!mandapArea) {
        throw new AppError(
            "Mandap Area is required",
            400
        );
    }


    if (
        aadhaarNo &&
        String(aadhaarNo).length !== 12
    ) {
        throw new AppError(
            "Aadhar Number must be 12 digits",
            400
        );
    }


    let businessTypeNumber = null;

    if (
        businessType !== undefined &&
        businessType !== null &&
        businessType !== ""
    ) {
        businessTypeNumber = Number(businessType);

        if (Number.isNaN(businessTypeNumber)) {
            throw new AppError(
                "Invalid Business Type",
                400
            );
        }
    }


    if (!permissionFrom) {
        throw new AppError(
            "Permission From date is required",
            400
        );
    }

    if (!permissionTo) {
        throw new AppError(
            "Permission To date is required",
            400
        );
    }


    const permissionFromDate =
        new Date(`${permissionFrom}T00:00:00`);

    const permissionToDate =
        new Date(`${permissionTo}T00:00:00`);

    if (Number.isNaN(permissionFromDate.getTime())) {
        throw new AppError(
            "Invalid Permission From date",
            400
        );
    }

    if (Number.isNaN(permissionToDate.getTime())) {
        throw new AppError(
            "Invalid Permission To date",
            400
        );
    }

    if (permissionFromDate > permissionToDate) {
        throw new AppError(
            "Permission From date cannot be greater than Permission To date",
            400
        );
    }

    const appResult =
        await repo.insertMandapStallApplication({
            userId,

            applicantName,

            mobileNo,

            emailId: String(emailId).trim(),

            aadhaarNo: aadhaarNo,

            residentialAddress: residentialAddress,

            panCardNo: panCardNo,

            orgName: orgName,

            orgAddress: orgAddress,

            businessType: businessTypeNumber,

            businessDescription: businessDescription,

            permissionFrom: permissionFromDate,

            permissionTo: permissionToDate,

            propertyNo,

            businessAddress,

            mandapArea,
        });


    if (Number(appResult.out_errcode) !== 9999) {
        return {
            success: false,
            errorCode: appResult.out_errcode,
            message:
                appResult.out_ErrMsg ||
                "Mandap / Stall application submission failed",
        };
    }

    const mandapStallId =
        appResult.out_mandapstallid;

    const parts =
        appResult.out_ErrMsg
            ? appResult.out_ErrMsg.split("$")
            : [];

    const message =
        parts[0] ||
        "Mandap / Stall application submitted successfully";

    return {
        success: true,

        errorCode:
            appResult.out_errcode,

        message,

        mandapStallId,
    };
}

module.exports = {
    submitMandapStallApplicationService,
};