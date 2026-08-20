import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/UserID.Login";
import OTPLogin from "./Pages/Login/OTP.Login";
import LandingPage from "./Pages/LandingPage";
import Layout from "./layout/main-layout";
import FrmPropertyAppel from "./Pages/app/FrmPropertyAppel";
import FrmRebateTax from "./Pages/app/FrmRebateTax";
import FrmNoDuesCerti from "./Pages/app/FrmNoDuesCerti";
import FrmAssessmentCerti from "./Pages/app/FrmAssessmentCerti";
import FrmPropertyTransfer from "./Pages/app/FrmPropertyTransfer";
import FrmNewTaxAssesment from "./Pages/app/FrmNewTaxAssesment";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
    {
    path: "/otp-login",
    element: <OTPLogin />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
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