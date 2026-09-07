const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./FrmFirstAppealAuthoRpt.service");
const { AppealReportPDFHelper } = require("../../../utils/pdfHelper/FrmFirstAppealAuthoRpt");
const path = require("path");

const getAppealReport = asyncHandler(async (req, res) => {
  const filters = req.body;
  const result = await service.getAppealReportService(filters);

  if (!result.rows || result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "No records found" });
  }

  return ok(res, { success: true, data: result.rows });
});

const generateAppealReportPDF = asyncHandler(async (req, res) => {
  try {
    const filters = req.body;
    const result = await service.getAppealReportService(filters);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No records found" });
    }

    const pdf = await AppealReportPDFHelper({
      reportData: result.rows,
      filters
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const pdfUrl = `${baseUrl}/pdf/${path.basename(pdf.filePath)}`;

    return res.json({
      success: true,
      message: "PDF Generated Successfully",
      fileName: pdf.fileName,
      pdfUrl
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "PDF Generation Failed",
      error: error.message
    });
  }
});

module.exports = { getAppealReport, generateAppealReportPDF };
