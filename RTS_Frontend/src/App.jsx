import "./App.css"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/UserID.Login";
import OTPLogin from "./Pages/Login/OTP.Login";
import Registration from "./Pages/Login/Registration";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import LandingPage from "./Pages/LandingPage";
import Layout from "./layout/main-layout";
import PageLayout from "./layout/page-layout";
import Watermodule from "./Pages/WaterModule/WaterbillCopy/Step0New"
import FrmPropertyAppel from "./Pages/Property/FrmPropertyAppel";
import FrmRebateTax from "./Pages/Property/FrmRebateTax";
import FrmNoDuesCerti from "./Pages/Property/FrmNoDuesCerti";
import FrmAssessmentCerti from "./Pages/Property/FrmAssessmentCerti";
import FrmPropertyTransfer from "./Pages/Property/FrmPropertyTransfer";
import FrmNewTaxAssesment from "./Pages/Property/FrmNewTaxAssesment";
import FrmMarketEntry from "./Pages/Trade/FrmMarketEntry/FrmMarketEntry";
import FrmWaterRegister from "./Pages/WaterModule/FrmWaterRegister";
import FrmPlumberLicense from "./Pages/WaterModule/FrmPlumberLicense";
import FrmTrackApplication from "./Pages/FrmTrackApplication/FrmTrackApplication";
import FrmAppeal from "./Pages/FrmTrackApplication/FrmAppeal";
import FrmAppliFee from "./Pages/FrmTrackApplication/FrmAppliFee";
import FrmMarketLicenseupdt from "./Pages/Trade/FrmMarketLicenseupdt";
import FrmServiceApplicationMst from "./Pages/SolidHealth/FrmServiceApplicationMst";
import FrmAfterTransactionTMC from "./Pages/FrmTrackApplication/FrmAfterTransactionTMC";
import FrmFirstAppeal from "./Pages/FrmFirstAppeal";
import FrmFirstAppealDocUpload from "./Pages/FrmFirstAppealDocUpload";
import FrmMarketLicenseUpdt from "./Pages/Trade/FrmMarketLicenseupdt";
import FrmMarriageRgstn from "./Pages/Marriage/FrmMarriageRgstn";
import FrmServiceApplicationMstNew from "./Pages/PWD/FrmServiceApplicationMstNew";
import FrmAppoints from "./Pages/Marriage/FrmAppoints";
import FrmWaterAppliEntry from "./Pages/WaterModule/FrmWaterAppliEntry";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
    ]
  },
  {
    path: "/",
    element: <PageLayout allowPublic={true} />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/otp-login",
        element: <OTPLogin />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/app/FrmAfterTransactionTMC",
        element: <FrmAfterTransactionTMC />
      },
    ]
  },
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        path: "/app/FrmTrackApplication",
        element: <FrmTrackApplication />
      },
      {
        path: "/app/FrmAppeal",
        element: <FrmAppeal />
      },
      {
        path: "/app/FrmAppliFee",
        element: <FrmAppliFee />
      },

      {
        path: "app/Step0New",
        element: <Watermodule />
      },
      {
        path: "app/FrmWaterRegister",
        element: <FrmWaterRegister />
      },
      {
        path: "app/FrmPlumberLicense",
        element: <FrmPlumberLicense />
      },
      {
        path: "/app/FrmAssessmentCerti",
        element: <FrmAssessmentCerti />,
      },
      {
        path: "/app/FrmPropertyTransfer",
        element: <FrmPropertyTransfer />,
      },
      {
        path: "/app/FrmNewTaxAssesment",
        element: <FrmNewTaxAssesment />,
      },
      {
        path: "/app/FrmNoDuesCerti",
        element: <FrmNoDuesCerti />,
      },
      {
        path: "/app/FrmRebateTax",
        element: <FrmRebateTax />,
      },
      {
        path: "/app/FrmPropertyAppel",
        element: <FrmPropertyAppel />,
      },
      {
        path: "/app/FrmMarketEntry",
        element: <FrmMarketEntry />
      },
      {
        path: "app/FrmMarketLicenseupdt",
        element: <FrmMarketLicenseUpdt />
      },
      {
        path: "/app/FrmMarketLicenseupdt",
        element: <FrmMarketLicenseupdt />,
      },
      {
        path: "/app/FrmFirstAppealDocUpload",
        element: <FrmFirstAppealDocUpload />,
      },
      {
        path: "/app/FrmFirstAppeal",
        element: <FrmFirstAppeal />,
      },
      // {
      //   path: "/app/FrmSecondAppeal",
      //   element: <FrmSecondAppeal />,
      // },
      {
        path: "/app/FrmMarriageRgstn",
        element: <FrmMarriageRgstn />
      },
      {
        path: "/app/FrmServiceApplicationMst",
        element: <FrmServiceApplicationMst />,
      },
      {
        path: "/app/FrmServiceApplicationMstNew",
        element: <FrmServiceApplicationMstNew />
      },
      {
         path: "/app/FrmAppoints",
        element: <FrmAppoints />
      },

      {
        path:"/app/FrmWaterAppliEntry",
        element:<FrmWaterAppliEntry />
      }

    ]
  },

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;