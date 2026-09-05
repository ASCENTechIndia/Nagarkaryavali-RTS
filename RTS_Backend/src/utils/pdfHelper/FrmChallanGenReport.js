const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

Handlebars.registerHelper('multiply', function(a, b) {
  return (Number(a) * Number(b)).toFixed(2);
});

Handlebars.registerHelper('sum', function(items) {
  let total = 0;
  if (items && Array.isArray(items)) {
    items.forEach(item => {
      total += (Number(item.amount) || 0);
    });
  }
  return total.toFixed(2);
});

Handlebars.registerHelper('eq', function(a, b) {
  return String(a) === String(b);
});

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const toDataUrl = (filePath) => {
  if (!filePath) return "";

  if (typeof filePath === "string" && filePath.startsWith("data:image")) return filePath;

  if (Buffer.isBuffer(filePath)) return `data:image/png;base64,${filePath.toString("base64")}`;

  if (typeof filePath === "string" && (filePath.startsWith("http://") || filePath.startsWith("https://")))
    return filePath;

  if (typeof filePath !== "string") return "";

  let finalPath = filePath;
  if (!path.isAbsolute(finalPath)) {
    finalPath = path.resolve(__dirname, "../../../public", filePath.replace(/^[\/\\]+/, ""));
  }

  if (!fs.existsSync(finalPath)) return "";

  const ext = path.extname(finalPath).toLowerCase();
  let mime = "image/png";
  if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
  else if (ext === ".webp") mime = "image/webp";

  const buffer = fs.readFileSync(finalPath);
  return `data:${mime};base64,${buffer.toString("base64")}`;
};

const ChallanReportPDFHelper = async ({ reportData, filters }) => {
  try {
    if (!reportData || reportData.length === 0) {
      throw new Error("No data found for report generation.");
    }

    const templatePath = path.resolve(__dirname, "../../templates/FrmChallanGenReport.html");
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    let logoBase64 = filters.ulbLogo || "";
    if (!logoBase64) {
      const logoPath = path.resolve(__dirname, "../../../public/tmclogo.jpg");
      logoBase64 = toDataUrl(logoPath);
    }

    const now = new Date();

    const rows = reportData.map((item) => ({
      receiptNo: item.RECEIPTNO || "-",
      receiveAmt: Number(item.RECEIVEAMT || 0).toFixed(2),
      receiptDate: item.RECEIPTDATE ? formatDate(item.RECEIPTDATE) : "-",
      prabhagId: item.PRABHAGID || "-",
      prabhag: item.PRABHAG || "-",
      serviceName: item.SERVICENAME || "-",
      challanNumber: item.VAR_CHALAN_NUMBER || "-",
      paymode: item.VAR_CHALAN_PAYMODE === "0" ? "Offline" : "Online",
    }));

    const totalAmount = reportData.reduce((sum, item) => sum + Number(item.RECEIVEAMT || 0), 0);

    const serviceSummary = {};
    reportData.forEach((item) => {
      const serviceName = item.SERVICENAME || "Other";
      if (!serviceSummary[serviceName]) {
        serviceSummary[serviceName] = 0;
      }
      serviceSummary[serviceName] += Number(item.RECEIVEAMT || 0);
    });

    const sortedServiceSummary = Object.entries(serviceSummary)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        serviceName: name,
        amount: amount.toFixed(2),
      }));

    const challanNumber = filters.challanNumber || "FIRE/0002";
    const challanDate = filters.challanDate ? formatDateTime(filters.challanDate) : formatDateTime(now);

    const corporationName = filters.corporationName || "ठाणे महानगरपालिका, ठाणे";

    const denominationDetails = [
      // { value: "2000", count: "X", amount: 0 },
      { value: "500", count: "X", amount: 0 },
      { value: "200", count: "X", amount: 0 },
      { value: "100", count: "X", amount: 0 },
      { value: "50", count: "X", amount: 0 },
      { value: "20", count: "X", amount: 0 },
      { value: "10", count: "X", amount: 0 },
      { value: "5", count: "X", amount: 0 },
      { value: "Other Coins", count: "X", amount: 0 },
    ];

    const denominationTotal = totalAmount.toFixed(2);

    const templateData = {
      logo: logoBase64,
      corporationName: corporationName,
      reportTitle: "General Receipt Challan Report",
      sampleNumber: "नमुना नं. १३",
      headquarter: filters.prabhagName || "HEADQUARTER",
      challanNumber: challanNumber,
      challanDate: challanDate,
      fromDate: filters.fromDate ? formatDate(filters.fromDate) : formatDate(now),
      toDate: filters.toDate ? formatDate(filters.toDate) : formatDate(now),
      rows: rows,
      totalAmount: totalAmount.toFixed(2),
      serviceSummary: sortedServiceSummary,
      printDate: formatDateTime(now),
      denominationDetails: denominationDetails,
      denominationTotal: denominationTotal,
    };

    const templateHtml = fs.readFileSync(templatePath, "utf8");

    const template = Handlebars.compile(templateHtml);
    const html = template(templateData);

    const chromePath = path.resolve(__dirname, "../../../node_modules/puppeteer/.cache/puppeteer/chrome/win64-135.0.7049.84/chrome-win64/chrome.exe");

    const launchOptions = {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };

    if (fs.existsSync(chromePath)) {
      launchOptions.executablePath = chromePath;
    }

    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 0 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "8mm",
        bottom: "8mm",
        left: "8mm",
        right: "8mm",
      },
    });

    await browser.close();

    const outputDir = path.resolve(__dirname, "../../../public/pdf");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `Challan_Report_${Date.now()}.pdf`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    return { fileName, filePath };
  } catch (err) {
    console.error("Challan Report PDF Generation Error:", err);
    throw err;
  }
};

module.exports = { ChallanReportPDFHelper };