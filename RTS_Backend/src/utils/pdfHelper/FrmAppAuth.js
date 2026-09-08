const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

// =========================================================
// Convert local image to Base64 Data URL
// =========================================================
const toDataUrl = (filePath) => {
  try {
    if (!filePath) return "";

    if (String(filePath).startsWith("data:image/")) {
      return filePath;
    }

    if (String(filePath).startsWith("http://") || String(filePath).startsWith("https://")) {
      return filePath;
    }

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, "../../../public", filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn("Image not found:", absolutePath);
      return "";
    }

    const extension = path.extname(absolutePath).toLowerCase();

    let mimeType = "image/png";

    if (extension === ".jpg" || extension === ".jpeg") {
      mimeType = "image/jpeg";
    } else if (extension === ".png") {
      mimeType = "image/png";
    } else if (extension === ".gif") {
      mimeType = "image/gif";
    } else if (extension === ".webp") {
      mimeType = "image/webp";
    }

    const imageBuffer = fs.readFileSync(absolutePath);

    return `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error converting image:", error);
    return "";
  }
};

// =========================================================
// Date formatter
// =========================================================
const formatDate = (value) => {
  if (!value) return "";

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    const day = String(date.getDate()).padStart(2, "0");

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
  } catch (error) {
    return String(value);
  }
};

// =========================================================
// PDF Helper
// =========================================================
const FrmAppAuthReportHelper = async ({ rows, corporationName, ulbLogo, serviceId, appNo, ulbId }) => {
  try {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("No certificate data available for PDF generation.");
    }

    // =======================================================
    // SELECT HTML TEMPLATE BASED ON SERVICE ID
    // =======================================================
    let templateFile = "";

    switch (String(serviceId)) {
      case "22":
        templateFile = "CrtChangeInUsage.html"; //done
        break;

      case "341":
        templateFile = "CrtChngInConSize.html"; //done
        break;

      case "18":
        templateFile = "CrtChangInOwner.html"; //done
        break;

      case "21":
        templateFile = "CrtWtrReconnection.html";
        break;

      case "24":
        templateFile = "CrtWtrPlumberLicense.html";
        break;

      case "26":
        templateFile = "CrtWtrNoDuesCertifct.html";
        break;

      case "27":
        templateFile = "CrtFaultyMtrCmplnt.html";
        break;

      case "28":
        templateFile = "CrtWtrUnAuthConnCompln.html";
        break;

      case "29":
        templateFile = "CrtWtrPresurCompln.html";
        break;

      case "30":
        templateFile = "CrtWtrQualityComplain.html";
        break;

      case "161":
        templateFile = "CrtWtrtemprmntdisconn.html";
        break;

      case "23":
        throw new Error("PDF template not configured for Service ID 23");

      case "25":
        throw new Error("PDF template not configured for Service ID 25");

      case "141":
        throw new Error("PDF template not configured for Service ID 141");

      default:
        throw new Error(`PDF template not configured for Service ID ${serviceId}`);
    }

    // =======================================================
    // CURRENT ROW
    // =======================================================
    const row = rows[0];

    // =======================================================
    // LOGOS
    // =======================================================
    const tmclogoPath = path.resolve(__dirname, "../../../public/tmclogo.jpg");

    const aplesewaLogoPath = path.resolve(__dirname, "../../../public/Apleseva.png");

    const leftLogo = toDataUrl(tmclogoPath);

    const rightLogo = toDataUrl(aplesewaLogoPath);

    // =======================================================
    // COMMON CERTIFICATE DATA
    // =======================================================
    const certificate = {
      serviceId: serviceId,

      appNo: row.RTSNO || row.APPNO || appNo || "",

      applicantName: row.APPLINAME || row.APLINAME || row.APPLILNAME || row.WTRCONNAME || "",

      mobileNo: row.APPLIMOBILE || row.MOBILENO || row.MOBNO || "",

      email: row.APPLIEMAIL || row.EMAIL || "",

      aadharNo: row.APPLIADDHAR || row.AADHARNO || row.ADHARNO || "",

      address: row.APPLIADDRESS || row.CUSTMADDRES || row.ADDRESS || "",

      connectionNo: row.CONSNO || row.CONNECTIONNO || row.CONNNO || "",

      propertyNo: row.PROPNO || row.PROPERTYNO || "",

      zoneName: row.ZONENM || row.ZONENAME || row.PRABHAGNAME || "",

      amount: row.AMOUNT || "",

      purpose: row.PURPOSE || "",

      refNo: row.REFNO || "",

      outNo: row.OUTNO || "",

      authDate: formatDate(row.AUTHDT || row.AUTHDATE),

      applicationDate: formatDate(row.APPLDATE || row.APPLIEDDT),

      corporationName: corporationName || "ठाणे महानगरपालिका, ठाणे",

      connectionBroken: row.CONNBROKEN,
    };

    // =======================================================
    // SERVICE SPECIFIC DATA
    // =======================================================
    switch (String(serviceId)) {
      // -----------------------------------------------------
      // 22 / 341 / 21 / 161
      // -----------------------------------------------------
      case "22":
      case "341":
      case "21":
      case "161":
        certificate.consumerNo = row.CONSNO || "";

        certificate.disconnectionId = row.DISCONNID || "";

        certificate.reason = row.REASON || "";

        certificate.usageId = row.USAGEID || "";

        certificate.tariffRate = row.TARIFRATE || "";

        certificate.connectionSizeId = row.CONNSIZEID || "";

        certificate.connectionSize = row.CONNSIZE || "";

        certificate.currentConnectionSize = row.CURCONSIZESRCH || "";

        certificate.usageType = row.USAGETYPENEWSRCH || row.USGNAME || "";

        certificate.connectionAddress = row.CONADDRESSSRCH || "";

        certificate.ownerName = row.OWNERNAMESRCH || "";

        certificate.waterUsage = row.WATERUSAGE || "";

        certificate.connectionPlace = row.CONNPLACE || "";

        certificate.houseNo = row.HOUSENO || "";

        certificate.familyCount = row.FAMCOUNT || "";

        certificate.waterTiming = row.WATERTIMING || "";

        certificate.remark = row.WTREMARK || row.REMMARK || "";

        certificate.fullName = row.FULLNAME || "";

        certificate.disconnectionDate = formatDate(row.ERLDISDT);

        certificate.reconnectionDate = formatDate(row.CONNRECONNDT);

        certificate.meterDate = formatDate(row.METERDT);

        certificate.subMeterDate = formatDate(row.SUBMETERDT);

        certificate.meterCuttingDate = formatDate(row.METERCUTTINGDT);

        certificate.vishay = row.VISHAY || "";

        certificate.sandharbh = row.SANDHARBH || row.HANDHARB || "";

        certificate.because = row.BECOUSE || "";

        break;

      // -----------------------------------------------------
      // 18 - Change Owner
      // -----------------------------------------------------
      case "18":
        certificate.connNo = row.CONNNO || "";

        certificate.residentialNo = row.RESINO || "";

        certificate.currentOwnerName = row.CURRONAME || "";

        certificate.currentConnectionName = row.CURCONAME || "";

        certificate.newOwnerName = row.NEWONAME || "";

        certificate.newConnectionName = row.NEWCONAME || "";

        certificate.meterType = row.METERTYPE || "";

        certificate.bHousehold = row.BCHOUSEHOLD || "";

        certificate.vishay = row.VISHAY || "";

        certificate.sandharbh = row.SHANDHARB || "";

        certificate.acceptDate = formatDate(row.ACCEPTDATE);

        break;

      // -----------------------------------------------------
      // 24 - Plumber License
      // -----------------------------------------------------
      case "24":
        certificate.licenseNo = row.LICENSENO || "";

        certificate.panNo = row.PANNO || "";

        certificate.col1 = row.APPLICOL1 || "";

        certificate.col2 = row.APPLICOL2 || "";

        certificate.actDate = formatDate(row.ACTPDT);

        break;

      // -----------------------------------------------------
      // 26-30 - Water complaints
      // -----------------------------------------------------
      case "26":
      case "27":
      case "28":
      case "29":
      case "30":
        certificate.waterConsumerName = row.WTRCONNAME || "";

        certificate.customerAddress = row.CUSTMADDRES || "";

        certificate.houseNo = row.HOUSENO || "";

        certificate.waterUsage = row.WATERUSAGE || "";

        certificate.familyMemberCount = row.FMLYMEMCOUNT || "";

        certificate.connectionType = row.CONNTYPE || "";

        certificate.waterTiming = row.WATERTIMING || "";

        certificate.meterNotWorkingDate = formatDate(row.METERNOWRKDT);

        certificate.meterWorkingDate = formatDate(row.METERWRKDT);

        certificate.departmentVerification = row.DEPTVERF || "";

        certificate.documentValid = row.DOCVALID || "";

        certificate.stateComplaint = row.STATECOMB || "";

        certificate.connectionBroken = row.CONNBROKEN || "";

        certificate.pointOfAction = row.PUNTVACTION || "";

        certificate.specialRightPressure = row.SPLRIGHTPRESRE || "";

        certificate.obstructionTap = row.OBSTRUCTIONTAP || "";

        certificate.garbageStuck = row.GARBAGESTUCK || "";

        certificate.sufficientWaterSupply = row.SUFFICIENTWTRSUPPLY || "";

        certificate.lowWaterPressure = row.LOWWTRPRESRE || "";

        certificate.customerChannel = row.CUSTCHANNEL || "";

        certificate.complaintStatus = row.CMPLTSTATUS || "";

        certificate.sampleCollectionDate = formatDate(row.SMPLCOLLDT);

        certificate.sampleTestDate = formatDate(row.SMPLTESTDT);

        certificate.meterType = row.METERTYPE || "";

        certificate.chemicalTest = row.CHEMICALTEST || "";

        certificate.freeChlorine = row.FREECHLORINE || "";

        certificate.ph = row.PH || "";

        certificate.turbidity = row.TURBIDITY || "";

        certificate.chloride = row.CHLORIDE || "";

        certificate.hardness = row.HARDNESS || "";

        certificate.prabhagId = row.PRABHAGID || "";

        certificate.prabhagName = row.PRABHAGNAME || "";

        certificate.vishay = row.VISHAY || "";

        certificate.sandharbh = row.SANDHARBH || row.HANDHARB || "";

        certificate.connectionNo = row.CONSNO || row.CONNECTIONNO || row.CONNNO || "";

        break;

      default:
        break;
    }

    // =======================================================
    // HANDLEBARS REPORT DATA
    // =======================================================
    const reportData = {
      ...row,

      SERVICEID: serviceId,
      APPNO: appNo,
      ULBID: ulbId,

      CORPORATION: corporationName || "ठाणे महानगरपालिका, ठाणे",

      CORPORATIONNAME: corporationName || "ठाणे महानगरपालिका, ठाणे",

      ULBLOGO: leftLogo,
      ULB_LOGO: leftLogo,

      APLESEVA_LOGO: rightLogo,

      CERTIFICATE: certificate,
      certificate,

      // Common aliases
      APPLINO: row.RTSNO || row.APPNO || appNo || "",

      APPLINAME: row.APPLINAME || row.APLINAME || row.APPLILNAME || row.WTRCONNAME || "",

      APPLIMOBILE: row.APPLIMOBILE || row.MOBILENO || row.MOBNO || "",

      APPLIEMAIL: row.APPLIEMAIL || row.EMAIL || "",

      APPLIADDHAR: row.APPLIADDHAR || row.AADHARNO || row.ADHARNO || "",

      APPLIADDRESS: row.APPLIADDRESS || row.CUSTMADDRES || row.ADDRESS || "",

      ZONENAME: row.ZONENM || row.ZONENAME || row.PRABHAGNAME || "",

      OUTNO: row.OUTNO || "",

      AUTHDATE: formatDate(row.AUTHDT || row.AUTHDATE),
    };

    // =======================================================
    // HTML TEMPLATE PATH
    // =======================================================
    const templatePath = path.resolve(__dirname, "../../templates", templateFile);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`HTML template not found: ${templatePath}`);
    }

    console.log(`FrmAppAuth PDF Template: ${templateFile}`);

    // =======================================================
    // READ + COMPILE HTML
    // =======================================================
    const htmlTemplate = fs.readFileSync(templatePath, "utf8");

    const template = Handlebars.compile(htmlTemplate);

    const html = template(reportData);

    // =======================================================
    // PDF DIRECTORY
    // =======================================================
    const pdfDirectory = path.resolve(__dirname, "../../../public/pdf");

    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, {
        recursive: true,
      });
    }

    // =======================================================
    // PDF NAME
    // =======================================================
    const pdfName = `Certificate_${Date.now()}.pdf`;

    const pdfPath = path.join(pdfDirectory, pdfName);

    // =======================================================
    // PUPPETEER
    // =======================================================
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: ["domcontentloaded", "networkidle0"],
      });

      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "10mm",
          bottom: "10mm",
          left: "10mm",
          right: "10mm",
        },
      });
    } finally {
      await browser.close();
    }

    // =======================================================
    // RETURN PDF DETAILS
    // =======================================================
    return {
      fileName: pdfName,
      filePath: pdfPath,
      templateFile,
      serviceId,
      appNo,
    };
  } catch (error) {
    console.error("FrmAppAuth PDF Helper Error:", error);

    throw error;
  }
};

module.exports = FrmAppAuthReportHelper;
