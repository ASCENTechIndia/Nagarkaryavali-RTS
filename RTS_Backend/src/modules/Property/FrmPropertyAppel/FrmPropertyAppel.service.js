const repo = require("./FrmPropertyAppel.repo");
const AppError = require("../../../libs/errors");

async function submitPropAppealService(payload) {
    const {
        userId,
        zoneId,
        serviceId,
        propNo,
        subCode,
        landHolder,
        structHolder,
        ownDetails,
        address,
        appliName,
        mobile,
        email,
        aadhar,
        objectType,
        objectDesc,
        taxDate1,
        taxDate2,
        oldUsage,
        newUsage,
        oldSubUsage,
        newSubUsage,
        oldArea,
        newArea,
        oldYrKaryogya,
        newYrKaryogya,
        oldKaryogya,
        newKaryogya,
        appSource,
    } = payload;

    // Basic validations
    if (!userId) {
        throw new AppError("User ID is required", 400);
    }

    if (!zoneId) {
        throw new AppError("Zone ID is required", 400);
    }

    if (!serviceId) {
        throw new AppError("Service ID is required", 400);
    }

    if (!propNo) {
        throw new AppError("Property Number is required", 400);
    }

    if (!appliName) {
        throw new AppError("Applicant Name is required", 400);
    }

    if (!address) {
        throw new AppError("Address is required", 400);
    }

    const result = await repo.insertPropAppeal({
        userId,
        zoneId,
        serviceId,
        propNo,
        subCode,
        landHolder,
        structHolder,
        ownDetails,
        address,
        appliName,
        mobile,
        email,
        aadhar,
        objectType,
        objectDesc,
        taxDate1,
        taxDate2,
        oldUsage,
        newUsage,
        oldSubUsage,
        newSubUsage,
        oldArea,
        newArea,
        oldYrKaryogya,
        newYrKaryogya,
        oldKaryogya,
        newKaryogya,
        appSource,
    });

    if (Number(result.out_errcode) !== 9999) {
        return {
            success: false,
            errorCode: result.out_errcode,
            message: result.out_ErrMsg,
        };
    }

    const applicationNo = result.out_applino;

    const parts = result.out_ErrMsg ? result.out_ErrMsg.split("$") : [];

    const message = parts[0] || "Property Appeal submitted successfully";

    return {
        success: true,
        errorCode: result.out_errcode,
        message,
        applicationNo,
        redirectTo: "FrmPropAppealSummary",
    };
}

module.exports = {
    submitPropAppealService,
};
