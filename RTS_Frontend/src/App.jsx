import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login/UserID.Login";
import OTPLogin from "./Pages/Login/OTP.Login";
import LandingPage from "./Pages/LandingPage";
import Layout from "./layout/main-layout";

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
    ]
  },

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;