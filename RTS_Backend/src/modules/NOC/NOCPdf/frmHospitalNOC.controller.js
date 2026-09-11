const {
    generateHospitalNocPDFService,
} = require("./frmHospitalNOC.service");


// ============================================================
// GENERATE NOC PDF
// ============================================================

const generateHospitalNocPDF = async (
    req,
    res
) => {

    try {

        const {
            corporationName,
            ...row
        } = req.body;


        // ======================================================
        // BASIC VALIDATION
        // ======================================================

        if (
            !row ||
            Object.keys(row).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "NOC data is required.",
            });
        }


        if (
            !row.SERVICE_TYPE &&
            !row.SERVICETYPE &&
            !row.serviceType
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "SERVICE_TYPE is required.",
            });
        }


        // ======================================================
        // GENERATE PDF
        // ======================================================

        const result =
            await generateHospitalNocPDFService({
                row,
                corporationName,
            });


        // ======================================================
        // RESPONSE
        // ======================================================

        return res.status(200).json({

            success: true,

            message:
                "NOC PDF generated successfully.",

            data: {

                fileName:
                    result.fileName,

                filePath:
                    result.filePath,

                fileUrl:
                    `/pdf/${result.fileName}`,

                serviceType:
                    result.serviceType,

                serviceName:
                    result.serviceName,
            },
        });

    } catch (error) {

        console.error(
            "NOC PDF Controller Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to generate NOC PDF.",
        });
    }
};


module.exports = {
    generateHospitalNocPDF,
};