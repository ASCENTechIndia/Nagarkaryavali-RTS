const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./FrmSecondAppealAutoRpt.service");
const { SecondAppealPDFHelper } = require("../../../utils/pdfHelper/FrmSecondAppealAutoRpt");
const path = require("path");

const getSecondAppealReport = asyncHandler(async (req, res) => {
  const filters = req.body;
  const result = await service.getSecondAppealReportService(filters);

  if (!result.rows || result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "No records found" });
  }

  return ok(res, { success: true, data: result.rows });
});

const generateSecondAppealReportPDF = asyncHandler(async (req, res) => {
  try {
    const filters = req.body;
    const result = await service.getSecondAppealReportService(filters);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No records found" });
    }

    const pdf = await SecondAppealPDFHelper({
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

module.exports = { getSecondAppealReport, generateSecondAppealReportPDF };
