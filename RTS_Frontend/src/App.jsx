import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/UserID.Login";
import OTPLogin from "./Pages/Login/OTP.Login";
import LandingPage from "./Pages/LandingPage";
import Layout from "./layout/main-layout";
import PageLayout from "./layout/page-layout";
import Watermodule from "./Pages/WaterModule/WaterbillCopy/Step0New"

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
    ]
  },

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;