const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

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


const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB");
};

const formatNumber = (num) =>
  Number(num || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ApplicationsDetailPDFHelper = async ({ reportData, filters, corporationName = "" }) => {
  try {
    if (!reportData.length) throw new Error("No data found.");

    const templatePath = path.resolve(__dirname, "../../templates/FrmRTSOnlineColl.html");
    if (!fs.existsSync(templatePath)) throw new Error(`Template not found: ${templatePath}`);

    const leftLogoPath = path.resolve(__dirname, "../../../public/tmclogo.jpg");
    const rightLogoPath = path.resolve(__dirname, "../../../public/Apleseva.png");

    const leftLogo = toDataUrl(leftLogoPath);
    const rightLogo = toDataUrl(rightLogoPath);

    const rows = reportData.map((item, index) => ({
      srNo: index + 1,
      appNo: item.APPNO,
      name: item.NAME,
      noOfCopy: item.NOOFCOPY,
      amount: formatNumber(item.AMOUNT),
      status: item.STATUS,
      receiptNo: item.RECNO,
      billdeskRefNo: item.BILLDESK_REFNO,
      receiptDate: formatDate(item.RECDATE),
      emailId: item.EMAILID,
      mobileNo: item.MOBNO,
    }));

    const htmlData = {
      corporationName: corporationName || "ठाणे महानगरपालिका, ठाणे",
      leftLogo,
      rightLogo,
      rows,
      fromDate: filters.fromDate || "",
      toDate: filters.toDate || "",
      serviceId: filters.serviceId || "",
      deptId: filters.deptId || "",
      printDate: formatDate(new Date()),
    };

    const templateHtml = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateHtml);
    const html = template(htmlData);

    const chromePath = path.resolve(
      __dirname,
      "../../../node_modules/puppeteer/.cache/puppeteer/chrome/win64-135.0.7049.84/chrome-win64/chrome.exe"
    );

    const launchOptions = {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };

    if (fs.existsSync(chromePath)) launchOptions.executablePath = chromePath;

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0", timeout: 0 });
    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "5mm", right: "5mm", bottom: "5mm", left: "5mm" },
    });

    await browser.close();


    const outputDir = path.resolve(__dirname, "../../../public/pdf");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `Applications_Detail_${Date.now()}.pdf`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, pdfBuffer);

    return { fileName, filePath };
  } catch (error) {
    console.error("ApplicationsDetailPDFHelper Error:", error);
    throw error;
  }
};

module.exports = { ApplicationsDetailPDFHelper };
