import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/UserID.Login";
import OTPLogin from "./Pages/Login/OTP.Login";
import LandingPage from "./Pages/LandingPage";

import RtsServiceForm from "./Pages/Trade/rtsService/RtsServiceForm"
import FrmRenewalLicenseForm from "./Pages/Trade/FrmRenewalLicenseForm/FrmRenewalLicenseForm";
import FrmTradeLicenseApplication from "./Pages/Trade/FrmTradeLicenseApplication/FrmTradeLicenseApplication";
import FrmMarketEntry from "./Pages/Trade/FrmMarketEntry/FrmMarketEntry";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/otp-login",
    element: <OTPLogin />,
  },

  // Trade 

  {
    path: "/tmc/rtsService",
    element: <RtsServiceForm/>
  },
  {
    path:"/tmc/RenewalLicenseForm",
    element:<FrmRenewalLicenseForm/>
  },

  {
    path:"/tmc/TradeApplicationForm",
    element:<FrmTradeLicenseApplication/>
  },

  {
    path:"/tmc/RenewalLicenseForm",
    element:<FrmRenewalLicenseForm/>
  },

  {
    path:"/app/FrmMarketEntry",
    element: <FrmMarketEntry/>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;