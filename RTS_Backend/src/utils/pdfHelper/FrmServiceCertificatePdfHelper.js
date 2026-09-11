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

    // Already Base64 image
    if (String(filePath).startsWith("data:image/")) {
      return filePath;
    }

    // URL image
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
// Register Handlebars Helpers
// =========================================================

// Equal comparison
Handlebars.registerHelper("eq", function (a, b) {
  return String(a) === String(b);
});

// Not equal comparison
Handlebars.registerHelper("neq", function (a, b) {
  return String(a) !== String(b);
});

// Check value exists
Handlebars.registerHelper("hasValue", function (value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
});

// Increment number
Handlebars.registerHelper("inc", function (value) {
  return Number(value || 0) + 1;
});

let templateFile = "";

switch (String(serviceId)) {
  // 515 - Clinical / Medical

  case "515":
    templateFile = "FrmClinicalMedical.html";
    break;

  // 516 - Tours and Travels

  case "516":
    templateFile = "FrmTourAndTravels.html";
    break;

  // 517 - Electricity Meter / Cable Installation
  //      and Excavation

  case "517":
    templateFile = "FrmElectricalMeterDigging.html";
    break;

  // 518 - Meat Shop

  case "518":
    templateFile = "FrmMeatShopLicense.html";
    break;

  // 519 - Hospital License

  case "519":
    templateFile = "FrmHospitalLicense.html";
    break;

  // 520 - Fast Food License

  case "520":
    templateFile = "FrmFastFoodLicense.html";
    break;

  // 521 - Mandap / Stall License

  case "521":
    templateFile = "FrmMandapStallLicense.html";
    break;

  default:
    throw new Error(`PDF template not configured for Service ID ${serviceId}`);
}

// =========================================================
// PDF Helper
// =========================================================
const FrmServiceCertificatePdfHelper = async ({ rows, corporationName, ulbLogo, serviceId, appNo, ulbId }) => {
  try {
    // =======================================================
    // 1. VALIDATE DATA
    // =======================================================
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("No certificate data available for PDF generation.");
    }

    // =======================================================
    // 2. VALIDATE SERVICE ID
    // =======================================================
    const serviceKey = String(serviceId);

    const templateFile = SERVICE_TEMPLATE_MAP[serviceKey];

    if (!templateFile) {
      throw new Error(`PDF template not configured for Service ID ${serviceId}`);
    }

    console.log(`FrmServiceCertificate PDF - Service ID: ${serviceId}`);

    console.log(`FrmServiceCertificate PDF - Template: ${templateFile}`);

    // =======================================================
    // 3. CURRENT ROW
    // =======================================================
    const row = rows[0];

    // =======================================================
    // 4. LOGOS
    // =======================================================

    // Use logo received from controller first
    let tmclogoPath = ulbLogo;

    // Fallback logo
    if (!tmclogoPath) {
      tmclogoPath = path.resolve(__dirname, "../../../public/tmclogo.jpg");
    }

    const aplesewaLogoPath = path.resolve(__dirname, "../../../public/Apleseva.png");

    const leftLogo = toDataUrl(tmclogoPath);
    const rightLogo = toDataUrl(aplesewaLogoPath);

    // =======================================================
    // 5. COMMON DATA
    // =======================================================
    //
    // We are intentionally keeping this generic because
    // service procedures are not created yet.
    //
    // Once procedures are ready, their returned columns
    // can be mapped here.
    // =======================================================

    const certificate = {
      serviceId: serviceId,

      appNo: row.RTSNO || row.APPNO || row.APPLICATIONNO || appNo || "",

      applicantName: row.APPLINAME || row.APLINAME || row.APPLILNAME || row.APPLICANTNAME || "",

      mobileNo: row.APPLIMOBILE || row.MOBILENO || row.MOBNO || row.MOBILE || "",

      email: row.APPLIEMAIL || row.EMAIL || row.EMAILID || "",

      aadharNo: row.APPLIADDHAR || row.AADHARNO || row.ADHARNO || "",

      address: row.APPLIADDRESS || row.CUSTMADDRES || row.ADDRESS || row.APPLICANTADDRESS || "",

      propertyNo: row.PROPNO || row.PROPERTYNO || "",

      businessName: row.BUSINESSNAME || row.INSTITUTENAME || row.ORGANIZATIONNAME || "",

      businessAddress: row.BUSINESSADDRESS || row.INSTITUTEADDRESS || row.ORGANIZATIONADDRESS || "",

      businessType: row.BUSINESSTYPE || row.BUSINESSTYPENAME || "",

      businessDescription: row.BUSINESSDESCRIPTION || row.BUSINESSDESC || "",

      corporationName: corporationName || "ठाणे महानगरपालिका, ठाणे",

      applicationDate: formatDate(row.APPLDATE || row.APPLICATIONDATE || row.APPLIEDDT),

      authDate: formatDate(row.AUTHDT || row.AUTHDATE),
    };

    // =======================================================
    // 6. GENERIC SERVICE DATA
    // =======================================================
    //
    // At this stage, don't hardcode procedure columns for
    // each service.
    //
    // The complete row is also passed to the template.
    // Therefore, when procedures are ready, any returned
    // column can directly be used in HTML.
    // =======================================================

    const reportData = {
      ...row,

      // -----------------------------------------------------
      // Common service information
      // -----------------------------------------------------
      SERVICEID: serviceId,
      APPNO: appNo,
      ULBID: ulbId,

      // -----------------------------------------------------
      // Corporation
      // -----------------------------------------------------
      CORPORATION: corporationName || "ठाणे महानगरपालिका, ठाणे",

      CORPORATIONNAME: corporationName || "ठाणे महानगरपालिका, ठाणे",

      // -----------------------------------------------------
      // Logos
      // -----------------------------------------------------
      ULBLOGO: leftLogo,
      ULB_LOGO: leftLogo,

      APLESEVA_LOGO: rightLogo,

      // -----------------------------------------------------
      // Certificate object
      // -----------------------------------------------------
      CERTIFICATE: certificate,
      certificate,

      // -----------------------------------------------------
      // Common aliases
      // -----------------------------------------------------
      APPLINO: row.RTSNO || row.APPNO || row.APPLICATIONNO || appNo || "",

      APPLINAME: row.APPLINAME || row.APLINAME || row.APPLILNAME || row.APPLICANTNAME || "",

      APPLIMOBILE: row.APPLIMOBILE || row.MOBILENO || row.MOBNO || row.MOBILE || "",

      APPLIEMAIL: row.APPLIEMAIL || row.EMAIL || row.EMAILID || "",

      APPLIADDHAR: row.APPLIADDHAR || row.AADHARNO || row.ADHARNO || "",

      APPLIADDRESS: row.APPLIADDRESS || row.CUSTMADDRES || row.ADDRESS || row.APPLICANTADDRESS || "",

      PROPERTYNO: row.PROPNO || row.PROPERTYNO || "",

      BUSINESSNAME: row.BUSINESSNAME || row.INSTITUTENAME || row.ORGANIZATIONNAME || "",

      BUSINESSADDRESS: row.BUSINESSADDRESS || row.INSTITUTEADDRESS || row.ORGANIZATIONADDRESS || "",

      BUSINESSTYPE: row.BUSINESSTYPE || row.BUSINESSTYPENAME || "",

      BUSINESSDESCRIPTION: row.BUSINESSDESCRIPTION || row.BUSINESSDESC || "",

      APPLICATIONDATE: formatDate(row.APPLDATE || row.APPLICATIONDATE || row.APPLIEDDT),

      AUTHDATE: formatDate(row.AUTHDT || row.AUTHDATE),
    };

    // =======================================================
    // 7. HTML TEMPLATE PATH
    // =======================================================
    const templatePath = path.resolve(__dirname, "../../templates", templateFile);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`HTML template not found: ${templatePath}`);
    }

    console.log(`FrmServiceCertificate PDF Template: ${templateFile}`);

    // =======================================================
    // 8. READ HTML TEMPLATE
    // =======================================================
    const htmlTemplate = fs.readFileSync(templatePath, "utf8");

    // =======================================================
    // 9. COMPILE HANDLEBARS
    // =======================================================
    const template = Handlebars.compile(htmlTemplate);

    const html = template(reportData);

    // =======================================================
    // 10. PDF DIRECTORY
    // =======================================================
    const pdfDirectory = path.resolve(__dirname, "../../../public/pdf");

    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, {
        recursive: true,
      });
    }

    // =======================================================
    // 11. PDF FILE NAME
    // =======================================================
    const safeServiceId = String(serviceId).replace(/[^a-zA-Z0-9_-]/g, "");

    const safeAppNo = String(appNo || row.APPNO || row.RTSNO || "Application").replace(/[^a-zA-Z0-9_-]/g, "_");

    const pdfName = `ServiceCertificate_${safeServiceId}_${safeAppNo}_${Date.now()}.pdf`;

    const pdfPath = path.join(pdfDirectory, pdfName);

    // =======================================================
    // 12. PUPPETEER
    // =======================================================
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      // -----------------------------------------------------
      // Create page
      // -----------------------------------------------------
      const page = await browser.newPage();

      // -----------------------------------------------------
      // A4 page
      // -----------------------------------------------------
      await page.setViewport({
        width: 794,
        height: 1123,
        deviceScaleFactor: 1,
      });

      // -----------------------------------------------------
      // Set HTML
      // -----------------------------------------------------
      await page.setContent(html, {
        waitUntil: ["domcontentloaded", "networkidle0"],
      });

      // -----------------------------------------------------
      // Generate PDF
      // -----------------------------------------------------
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
    // 13. VERIFY PDF
    // =======================================================
    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF file was not created.");
    }

    // =======================================================
    // 14. RETURN PDF DETAILS
    // =======================================================
    return {
      fileName: pdfName,
      filePath: pdfPath,
      templateFile,
      serviceId,
      appNo,
      ulbId,
    };
  } catch (error) {
    // =======================================================
    // ERROR
    // =======================================================
    console.error("FrmServiceCertificate PDF Helper Error:", error);

    throw error;
  }
};

// =========================================================
// EXPORT
// =========================================================
module.exports = FrmServiceCertificatePdfHelper;
