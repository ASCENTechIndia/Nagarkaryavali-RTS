import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/UserID.Login";
import OTPLogin from "./Pages/Login/OTP.Login";
import LandingPage from "./Pages/LandingPage";
import Layout from "./layout/main-layout";
import PageLayout from "./layout/page-layout";

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

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;