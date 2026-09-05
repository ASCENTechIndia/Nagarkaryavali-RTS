const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB");
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


const AppealReportPDFHelper = async ({ reportData, filters }) => {
  try {
    if (!reportData.length) throw new Error("No data found.");

    const templatePath = path.resolve(__dirname, "../../templates/FrmFirstAppealAuthoRpt.html");
    if (!fs.existsSync(templatePath)) throw new Error(`Template not found: ${templatePath}`);

     const leftLogoPath = path.resolve(__dirname, "../../../public/tmclogo.jpg");

      const leftLogo = toDataUrl(leftLogoPath);

    const rows = reportData.map((item, index) => ({
      srNo: index + 1,
      appNo: item.APPNO,
      receiptDate: formatDate(item.RECEIPTDATE),
      ackDate: formatDate(item.DTFIRSTAPPEAL),
      nameAndAddress: item.NAMEADDRESS,
      requestedService: item.PUBSERVRQU,
      disposedDateReason: item.REJECTDATE,
      fineDetails: item.FINE
    }));

    const htmlData = {
      leftLogo,
      rows,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      printDate: formatDate(new Date())
    };

    const templateHtml = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateHtml);
    const html = template(htmlData);

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 0 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" }
    });

    await browser.close();

    const outputDir = path.resolve(__dirname, "../../../public/pdf");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `Appeal_Report_${Date.now()}.pdf`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, pdfBuffer);

    return { fileName, filePath };
  } catch (err) {
    console.error("FirstAppealAuthoRpt Error:", err);
    throw err;
  }
};

module.exports = { AppealReportPDFHelper };
