const asyncHandler = require("../../../libs/asyncHandler");
const { ok } = require("../../../libs/response");
const service = require("./FrmRTSOnlineColl.service");
const { ApplicationsDetailPDFHelper } = require("../../../utils/pdfHelper/FrmRTSOnlineColl");
const path = require("path");


const getDepartments = asyncHandler(async (req, res) => {
  const data = await service.getDepartmentsService();
  return ok(res, data);
});

const getApplicationsSummary = asyncHandler(async (req, res) => {
  const { fromDate, toDate, deptId } = req.body;
  const data = await service.getApplicationsSummaryService({ fromDate, toDate, deptId });
  return ok(res, data);
});


const getApplicationsDetail = asyncHandler(async (req, res) => {
  const filters = req.body;
  const result = await service.getApplicationsDetailService(filters);

  if (!result.rows || result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "No records found" });
  }

  return ok(res, { success: true, data: result.rows });
});

const generateApplicationsDetailPDF = asyncHandler(async (req, res) => {
  try {
    const filters = req.body;
    const result = await service.getApplicationsDetailService(filters);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No records found" });
    }

    const pdf = await ApplicationsDetailPDFHelper({
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


module.exports = { getDepartments, getApplicationsSummary , getApplicationsDetail, generateApplicationsDetailPDF };
