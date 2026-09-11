const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");

// ============================================================
// IMAGE TO DATA URL
// ============================================================

const toDataUrl = (filePath) => {
    if (!filePath) {
        return "";
    }

    // Already data URL
    if (
        typeof filePath === "string" &&
        filePath.startsWith("data:image")
    ) {
        return filePath;
    }

    // Buffer
    if (Buffer.isBuffer(filePath)) {
        return `data:image/png;base64,${filePath.toString("base64")}`;
    }

    // External URL
    if (
        typeof filePath === "string" &&
        (
            filePath.startsWith("http://") ||
            filePath.startsWith("https://")
        )
    ) {
        return filePath;
    }

    if (typeof filePath !== "string") {
        return "";
    }

    let finalPath = filePath;

    // Relative path
    if (!path.isAbsolute(finalPath)) {
        finalPath = path.resolve(
            __dirname,
            "../../../public",
            filePath.replace(/^[\\/]+/, "")
        );
    }

    if (!fs.existsSync(finalPath)) {
        return "";
    }

    const ext = path.extname(finalPath).toLowerCase();

    let mime = "image/png";

    if (ext === ".jpg" || ext === ".jpeg") {
        mime = "image/jpeg";
    } else if (ext === ".webp") {
        mime = "image/webp";
    } else if (ext === ".gif") {
        mime = "image/gif";
    } else if (ext === ".svg") {
        mime = "image/svg+xml";
    }

    const buffer = fs.readFileSync(finalPath);

    return `data:${mime};base64,${buffer.toString("base64")}`;
};


// ============================================================
// DATE FORMAT
// ============================================================

const formatDate = (value) => {
    if (!value) {
        return "";
    }

    // Already DD-MM-YYYY / DD/MM/YYYY
    if (
        typeof value === "string" &&
        /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(value)
    ) {
        return value.replace(/-/g, "/");
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};


// ============================================================
// SERVICE TEMPLATE CONFIGURATION
// ============================================================

const SERVICE_TEMPLATES = {
    CLINIC_MEDICAL: {
        template: "FrmClinicalMedical.html",
        serviceName: "क्लिनिक / मेडिकल",
        fee: "1000/-",
    },

    TOUR_TRAVELS: {
        template: "FrmTourTravels.html",
        serviceName: "टूर आणि ट्रॅव्हल्स",
        fee: "1000/-",
    },

    ELECTRICAL: {
        template: "FrmElectrical.html",
        serviceName: "विद्युत मीटर/ केबल उभारणीसाठी व खोदाईसाठी",
        fee: "1000/-",
    },

    MEAT_SHOP: {
        template: "FrmMeatShop.html",
        serviceName: "मांस दुकान ( गोमांस, डुकराचे मांस, पोल्ट्री )",
        fee: "1000/-",
    },

    HOTEL_LICENSE: {
        template: "FrmHotelLicense.html",
        serviceName: "अन्न नागरी पुरवठा (हॉटेल परवाना)",
        fee: "1000/-",
    },

    FAST_FOOD: {
        template: "FrmFastFood.html",
        serviceName: "फास्ट फूड (परवाना)",
        fee: "2000/-",
    },

    MANDAP_STALL: {
        template: "FrmMandapStall.html",
        serviceName: "मंडप / स्टॉल (परवाना)",
        fee: "1000/-",
    },
};


// ============================================================
// PDF HELPER
// ============================================================

const HospitalNocPDFHelper = async ({
    row,
    corporationName = "",
}) => {
    let browser;

    try {

        // ====================================================
        // VALIDATION
        // ====================================================

        if (!row) {
            throw new Error(
                "NOC certificate data not found."
            );
        }


        // ====================================================
        // SERVICE TYPE
        // ====================================================

        const serviceType = String(
            row.SERVICE_TYPE ||
            row.SERVICETYPE ||
            row.serviceType ||
            ""
        )
            .trim()
            .toUpperCase();

        if (!serviceType) {
            throw new Error(
                "SERVICE_TYPE is required."
            );
        }


        // ====================================================
        // SERVICE CONFIG
        // ====================================================

        const serviceConfig =
            SERVICE_TEMPLATES[serviceType];

        if (!serviceConfig) {
            throw new Error(
                `Invalid NOC SERVICE_TYPE: ${serviceType}. ` +
                `Allowed values: ${Object.keys(
                    SERVICE_TEMPLATES
                ).join(", ")}`
            );
        }


        // ====================================================
        // TEMPLATE PATH
        //
        // Current helper:
        // src/utils/pdfHelper/hospitalNocPDFHelper.js
        //
        // Templates:
        // src/modules/templates/*.html
        //
        // Therefore:
        // ../../modules/templates
        // ====================================================
// ============================================================
// TEMPLATE PATH
// ============================================================

const templatesDirectory = path.resolve(
    __dirname,
    "../../templates"
);

const templatePath = path.join(
    templatesDirectory,
    serviceConfig.template
);

console.log("========================================");
console.log("NOC TEMPLATE DEBUG");
console.log("Helper Directory :", __dirname);
console.log("Templates Folder :", templatesDirectory);
console.log("Template File    :", serviceConfig.template);
console.log("Full Path        :", templatePath);
console.log("Exists           :", fs.existsSync(templatePath));
console.log("========================================");

if (!fs.existsSync(templatePath)) {
    throw new Error(
        `NOC template not found: ${templatePath}`
    );
}


        // ====================================================
        // ULB LOGO
        // ====================================================

        let ulbLogo = "";

        if (row.ULBLOGO) {

            ulbLogo = toDataUrl(
                row.ULBLOGO
            );

        } else {

            const ulbLogoPath = path.resolve(
                __dirname,
                "../../../public/tmclogo.jpg"
            );

            ulbLogo = toDataUrl(
                ulbLogoPath
            );
        }


        // ====================================================
        // AAPLE SEVA LOGO
        // ====================================================

        let apleSevaLogo = "";

        if (row.APLESEVA_LOGO) {

            apleSevaLogo = toDataUrl(
                row.APLESEVA_LOGO
            );

        } else {

            const apleSevaLogoPath = path.resolve(
                __dirname,
                "../../../public/Apleseva.png"
            );

            apleSevaLogo = toDataUrl(
                apleSevaLogoPath
            );
        }


        // ====================================================
        // QR CODE
        // ====================================================

        const qrCode = toDataUrl(
            row.QRCODE
        );


        // ====================================================
        // STAMP
        // ====================================================

        const stamp = toDataUrl(
            row.STAMP
        );


        // ====================================================
        // REPORT DATA
        // ====================================================

        const reportData = {

            // -----------------------------------------------
            // SERVICE
            // -----------------------------------------------

            SERVICE_TYPE:
                serviceType,

            SERVICE_NAME:
                row.SERVICE_NAME ||
                row.SERVICENAME ||
                serviceConfig.serviceName,

            FEE:
                row.FEE ||
                row.NOC_FEE ||
                serviceConfig.fee,


            // -----------------------------------------------
            // LOGOS
            // -----------------------------------------------

            ULBLOGO:
                ulbLogo,

            APLESEVA_LOGO:
                apleSevaLogo,


            // -----------------------------------------------
            // CORPORATION
            // -----------------------------------------------

            CORPORATIONNAME:
                row.CORPORATIONNAME ||
                corporationName ||
                "",


            // -----------------------------------------------
            // CERTIFICATE
            // -----------------------------------------------

            CERTIFICATENO:
                row.CERTIFICATENO ||
                row.CERTIFICATE_NO ||
                row.CERTNO ||
                "",

            APPLICATIONDATE:
                formatDate(
                    row.APPLICATIONDATE ||
                    row.APPLICATION_DATE ||
                    row.APPDATE
                ),


            // -----------------------------------------------
            // APPLICANT
            // -----------------------------------------------

            APPLINAME:
                row.APPLINAME ||
                row.APPLICANTNAME ||
                row.APPLICANT_NAME ||
                "",

            APPLIADDRESS:
                row.APPLIADDRESS ||
                row.APPLICANTADDRESS ||
                row.APPLICANT_ADDRESS ||
                "",


            // -----------------------------------------------
            // APPLICATION
            // -----------------------------------------------

            APPLINO:
                row.APPLINO ||
                row.APPLICATIONNO ||
                row.APPLICATION_NO ||
                "",

            APPLDATE:
                formatDate(
                    row.APPLDATE ||
                    row.APPL_DATE
                ),


            // -----------------------------------------------
            // RECEIPT
            // -----------------------------------------------

            RECEIPTNO:
                row.RECEIPTNO ||
                row.RECEIPT_NO ||
                "",

            RECEIPTDATE:
                formatDate(
                    row.RECEIPTDATE ||
                    row.RECEIPT_DATE
                ),


            // -----------------------------------------------
            // BUSINESS
            // -----------------------------------------------

            BUSINESSADDRESS:
                row.BUSINESSADDRESS ||
                row.BUSINESS_ADDRESS ||
                "",

            BUSINESSNAME:
                row.BUSINESSNAME ||
                row.BUSINESS_NAME ||
                "",

            BUSINESSTYPE:
                row.BUSINESSTYPE ||
                row.BUSINESS_TYPE ||
                "",


            // -----------------------------------------------
            // FOOTER
            // -----------------------------------------------

            QRCODE:
                qrCode,

            STAMP:
                stamp,
        };


        // ====================================================
        // DEBUG
        // ====================================================

        console.log(
            "Generating NOC PDF:",
            {
                serviceType,
                serviceName:
                    reportData.SERVICE_NAME,
                template:
                    serviceConfig.template,
                templatePath,
                fee:
                    reportData.FEE,
            }
        );


        // ====================================================
        // READ TEMPLATE
        // ====================================================

        const htmlFile = fs.readFileSync(
            templatePath,
            "utf8"
        );


        // ====================================================
        // HANDLEBARS
        // ====================================================

        const template =
            Handlebars.compile(
                htmlFile,
                {
                    noEscape: true,
                }
            );


        const html =
            template(reportData);


        // ====================================================
        // CHROME PATH
        // ====================================================

        const chromePath = path.resolve(
            __dirname,
            "../../../node_modules/puppeteer/.cache/puppeteer/chrome/win64-135.0.7049.84/chrome-win64/chrome.exe"
        );


        // ====================================================
        // PUPPETEER OPTIONS
        // ====================================================

        const launchOptions = {

            headless: true,

            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        };


        if (fs.existsSync(chromePath)) {

            launchOptions.executablePath =
                chromePath;
        }


        // ====================================================
        // LAUNCH
        // ====================================================

        browser =
            await puppeteer.launch(
                launchOptions
            );


        // ====================================================
        // PAGE
        // ====================================================

        const page =
            await browser.newPage();


        await page.setViewport({

            width: 794,

            height: 1123,

            deviceScaleFactor: 1,
        });


        // ====================================================
        // SET HTML
        // ====================================================

        await page.setContent(
            html,
            {
                waitUntil: "networkidle0",
                timeout: 0,
            }
        );


        // ====================================================
        // WAIT FOR FONTS
        // ====================================================

        await page.evaluate(
            async () => {

                if (
                    document.fonts &&
                    document.fonts.ready
                ) {
                    await document.fonts.ready;
                }
            }
        );


        // ====================================================
        // WAIT FOR IMAGES
        // ====================================================

        await page.evaluate(
            async () => {

                const images =
                    Array.from(
                        document.images
                    );

                await Promise.all(
                    images.map((img) => {

                        if (img.complete) {
                            return Promise.resolve();
                        }

                        return new Promise(
                            (resolve) => {

                                img.onload =
                                    resolve;

                                img.onerror =
                                    resolve;
                            }
                        );
                    })
                );
            }
        );


        // ====================================================
        // GENERATE PDF
        // ====================================================

        const pdfBuffer =
            await page.pdf({

                format: "A4",

                landscape: false,

                printBackground: true,

                preferCSSPageSize: true,

                margin: {
                    top: "0mm",
                    right: "0mm",
                    bottom: "0mm",
                    left: "0mm",
                },

                displayHeaderFooter: false,
            });


        // ====================================================
        // CLOSE
        // ====================================================

        await browser.close();

        browser = null;


        // ====================================================
        // OUTPUT DIRECTORY
        // ====================================================

        const outputDir =
            path.resolve(
                __dirname,
                "../../../public/pdf"
            );


        if (!fs.existsSync(outputDir)) {

            fs.mkdirSync(
                outputDir,
                {
                    recursive: true,
                }
            );
        }


        // ====================================================
        // FILE NAME
        // ====================================================

        const certificateNo =
            String(
                reportData.CERTIFICATENO ||
                "NOC"
            ).replace(
                /[^a-zA-Z0-9_-]/g,
                "_"
            );


        const fileName =
            `${serviceType}_${certificateNo}_${Date.now()}.pdf`;


        const filePath =
            path.join(
                outputDir,
                fileName
            );


        // ====================================================
        // SAVE
        // ====================================================

        fs.writeFileSync(
            filePath,
            pdfBuffer
        );


        // ====================================================
        // RETURN
        // ====================================================

        return {

            fileName,

            filePath,

            serviceType,

            serviceName:
                reportData.SERVICE_NAME,
        };

    } catch (error) {

        if (browser) {

            try {

                await browser.close();

            } catch (closeError) {

                console.error(
                    "Failed to close Puppeteer:",
                    closeError
                );
            }
        }


        console.error(
            "HospitalNocPDFHelper Error:",
            error
        );


        throw error;
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    HospitalNocPDFHelper,
};