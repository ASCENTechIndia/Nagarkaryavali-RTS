import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/UserID.Login";
import OTPLogin from "./Pages/Login/OTP.Login";
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
import Registration from "./Pages/Login/Registration";
import ForgotPassword from "./Pages/Login/ForgotPassword";

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
    element: <PageLayout allowPublic={true}/>,
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
    ]
  },
  {
    path: "/",
    element: <PageLayout/>,
    children: [
      {
        path: "app/Step0New",
        element: <Watermodule/>
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
    ]
  },

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;