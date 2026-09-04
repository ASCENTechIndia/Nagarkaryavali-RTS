// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { NODE_ENV } = require("./config/env");
const errorMiddleware = require("./middlewares/error.middleware");
const { rateLimitMiddleware } = require("./middlewares/rateLimit.middleware");
const requestLogger = require("./middlewares/requestLogger.middleware");
const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const healthRoutes = require("./routes/health.routes");
const path = require("path");
const { paymentResponseController } = require("./modules/TrackApplication/FrmAfterTransactionTMC/FrmAfterTransactionTMC.controller");

const app = express();

// trust proxy (important for rate-limit & IP)
app.set("trust proxy", 1);

// security & parsing
// app.use(cors({ origin: NODE_ENV === "production" ? ["https://yourdomain.com"] : "*", credentials: true }));
const allowedOrigins = [
  "https://rts.nagarkaryavalinewuat.com", 

  "http://localhost:5173"];

app.post(
    "/api/payment-response",
    express.urlencoded({extended: true}),
    paymentResponseController
);


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

// logging
if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/pdf", express.static(path.join(__dirname, "../public/pdf")));

// health first (no rate limit)
app.use("/api", healthRoutes);

// global limiter
app.use(rateLimitMiddleware());

// root
app.get("/", (req, res) => res.send("API Running ✅"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

//Dashboard
app.use("/api/Dashboard", require("./modules/Dashboard/Dashboard.route"));

// Property
app.use("/api/FrmAssessmentCerti", require("./modules/Property/FrmAssessmentCerti/FrmAssessmentCerti.routes"));
app.use("/api/FrmPropertyTransfer", require("./modules/Property/FrmPropertyTransfer/FrmPropertyTransfer.routes"));
app.use("/api/FrmRebateTax", require("./modules/Property/FrmRebateTax/FrmRebateTax.routes"));
app.use("/api/FrmNoDuesCerti", require("./modules/Property/FrmNoDuesCerti/FrmNoDuesCerti.routes"));
app.use("/api/FrmNewTaxAssesment", require("./modules/Property/FrmNewTaxAssesment/FrmNewTaxAssesment.route"));
app.use("/api/FrmPropertyAppel", require("./modules/Property/FrmPropertyAppel/FrmPropertyAppel.route"));
app.use("/api/FrmAfterTransactionTMC", require("./modules/Property/FrmAfterTransactionTMC/FrmAfterTransactionTMC.routes"))

//Water module 
app.use("/api/watermodule", require("./modules/WaterModule/WaterBillCopy/Stepnew.route"))
app.use("/api/FrmWaterRegister", require("./modules/WaterModule/FrmWaterRegister/FrmWaterRegister.route"))
app.use("/api/FrmPlumberLicense", require("./modules/WaterModule/FrmPlumberLicense/FrmPlumberLicense.route"))
app.use("/api/FrmWaterAppliEntry", require("./modules/WaterModule/FrmWaterAppliEntry/FrmWaterAppliEntry.routes"));
app.use("/api/FrmWaterAppliDetails", require("./modules/WaterModule/FrmWaterAppliDetails/FrmWaterAppliDetails.route"))

//Trade
app.use("/api/FrmMarketEntry", require("./modules/Trade/FrmMarketEntry/FrmMarketEntry.routes"));
app.use("/api/FrmMarketLicenseupdt", require("./modules/Trade/FrmMarketLicenseupdt/FrmMarketLicenseupdt.route"));

//TrackApplication
app.use("/api/FrmTrackApplication", require("./modules/TrackApplication/FrmTrackApplication/FrmTrackApplication.routes"));
app.use("/api/FrmAppeal", require("./modules/TrackApplication/FrmAppeal/FrmAppeal.route"));
app.use("/api/FrmAppliFee", require("./modules/TrackApplication/FrmAppliFee/FrmAppliFee.route"));
app.use("/api/FrmAppFrmAfterTransactionTMCliFee", require("./modules/TrackApplication/FrmAfterTransactionTMC/FrmAfterTransactionTMC.route"));
app.use("/api/FrmFirstAppealDocUpload", require("./modules/FrmFirstAppealDocUpload/FrmFirstAppealDocUpload.route"));

//Solid Health

app.use("/api/FrmServiceApplicationMst", require("./modules/SolidHealth/FrmServiceApplicationMst/FrmServiceApplicationMst.routes"))

// Marriage
app.use("/api/FrmMarriageRgstn", require("./modules/Marriage/FrmMarriageRgstn/FrmMarriageRgstn.routes"));
app.use("/api/FrmAppoints", require("./modules/Marriage/FrmAppoints/FrmAppoints.route"));


// PWD
app.use("/api/FrmRoadCutting", require("./modules/PWD/FrmRoadCutting.route"));



//AdminDepartmet
app.use("/api/FrmMappingConfig", require("./modules/admin/FrmMappingConfig/FrmMappingConfig.route"));
app.use("/api/FrmDeptMappingConfig", require("./modules/admin/FrmDeptMappingConfig/FrmDeptMappingConfig.route"));

//AFrmAppAutherisation
app.use("/api/frmAppAuth", require("./modules/AdminDepartment/FrmAppAuth/frmAppAuth.routes"));





app.use(errorMiddleware);

module.exports = app;