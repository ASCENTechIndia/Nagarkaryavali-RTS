const asyncHandler = require("../../../libs/asyncHandler");
const { ok, fail } = require("../../../libs/response");
const service = require("./FrmChallanGenReport.service");
const { ChallanReportPDFHelper } = require("../../../utils/pdfHelper/FrmChallanGenReport");
const path = require("path");
const { getCorporationDetailsService } = require("../../Dashboard/Dashboard.service");

exports.getPrabhagList = asyncHandler(async (req, res) => {
  const ulbId = req.user?.ulbId || req.body.ulbId || req.query.ulbId || 3;

  const result = await service.getPrabhagListService(ulbId);

  return ok(res, result, "Prabhag list fetched successfully");
});

exports.getDepartmentList = asyncHandler(async (req, res) => {
  const result = await service.getDepartmentListService();

  return ok(res, result, "Department list fetched successfully");
});

exports.generateChallanReport = asyncHandler(async (req, res) => {
  const {
    challanDate,
    fromDate,
    toDate,
    prabhagId,
    deptId
  } = req.body;

  const ulbId = req.body.ulbId;

  if (!fromDate) {
    return fail(res, "From Date is required");
  }

  if (!toDate) {
    return fail(res, "To Date is required");
  }

  if (!prabhagId) {
    return fail(res, "Prabhag is required");
  }

  if (!deptId) {
    return fail(res, "Department is required");
  }

  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);
  const today = new Date();

  if (fromDateObj > toDateObj) {
    return fail(res, "To date should be greater than from date");
  }

  if (fromDateObj > today) {
    return fail(res, "From Date cannot be greater than System Date");
  }

  if (toDateObj > today) {
    return fail(res, "To Date cannot be greater than System Date");
  }

  const result = await service.generateChallanReportService({
    ulbId,
    fromDate,
    toDate,
    challanDate,
    prabhagId,
    deptId
  });

  if (!result.success) {
    return fail(res, result.message || "Report generation failed");
  }

  return ok(res, result, "Report generated successfully");
});

exports.generateChallanReportPDF = asyncHandler(async (req, res) => {
  try {
    const { challanDate, fromDate, toDate, prabhagId, deptId, prabhagName } = req.body;

    const ulbId = req.body.ulbId || req.user?.ulbId || 3;
    if (!fromDate) {
      return res.status(400).json({ success: false, message: "From Date is required" });
    }

    if (!toDate) {
      return res.status(400).json({ success: false, message: "To Date is required" });
    }

    if (!prabhagId) {
      return res.status(400).json({ success: false, message: "Prabhag is required" });
    }

    if (!deptId) {
      return res.status(400).json({ success: false, message: "Department is required" });
    }

    const result = await service.generateChallanReportService({
      ulbId,
      fromDate,
      toDate,
      challanDate,
      prabhagId,
      deptId,
    });

    if (!result.success || !result.data || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: result.message || "No records found for the selected criteria"
      });
    }

    let prabhagNameFinal = prabhagName;
    if (!prabhagNameFinal) {
      const prabhagResult = await service.getPrabhagListService(ulbId);
      if (prabhagResult.success) {
        const found = prabhagResult.rows.find(p => String(p.WARDID) === String(prabhagId));
        prabhagNameFinal = found?.WARDNAME || "HEADQUARTER";
      }
    }

    let deptName = "";
    const deptResult = await service.getDepartmentListService();
    if (deptResult.success) {
      const found = deptResult.rows.find(d => String(d.DEPTID) === String(deptId));
      deptName = found?.DEPTNAME || "";
    }

    const corporationResponse = await getCorporationDetailsService({
      corporationId: ulbId,
    });

    const corporationData = corporationResponse?.data || {};
    const corporation = corporationData?.corporation || {};
    const corporationName = corporation?.VAR_CORPORATION_NAME || "ठाणे महानगरपालिका, ठाणे";

    let ulbLogo = "";
    if (corporationData?.logo) {
      ulbLogo = `data:image/png;base64,${corporationData.logo}`;
    }

    const firstRecord = result.data[0];
    const challanNumber = firstRecord?.VAR_CHALAN_NUMBER;
    const challanDateTime = firstRecord?.RECEIPTDATE || challanDate || new Date();

    const pdf = await ChallanReportPDFHelper({
      reportData: result.data,
      filters: {
        fromDate,
        toDate,
        challanDate: challanDateTime,
        prabhagName: prabhagNameFinal || "HEADQUARTER",
        deptName,
        ulbId,
        corporationName,
        ulbLogo,
        challanNumber,
      }
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const pdfUrl = `${baseUrl}/pdf/${path.basename(pdf.filePath)}`;

    return res.json({
      success: true,
      message: "PDF Generated Successfully",
      fileName: pdf.fileName,
      pdfUrl,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "PDF Generation Failed",
      error: error.message
    });
  }
});