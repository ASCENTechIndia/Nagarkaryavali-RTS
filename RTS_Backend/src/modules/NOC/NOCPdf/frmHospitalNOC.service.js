const {
    HospitalNocPDFHelper,
} = require("../../../utils/pdfHelper/hospitalNocPDFHelper");


// ============================================================
// GENERATE NOC PDF
// ============================================================

const generateHospitalNocPDFService = async ({
    row,
    corporationName,
}) => {

    if (!row) {
        throw new Error(
            "NOC data is required."
        );
    }

    if (
        !row.SERVICE_TYPE &&
        !row.SERVICETYPE &&
        !row.serviceType
    ) {
        throw new Error(
            "SERVICE_TYPE is required."
        );
    }

    return await HospitalNocPDFHelper({
        row,
        corporationName,
    });
};


module.exports = {
    generateHospitalNocPDFService,
};