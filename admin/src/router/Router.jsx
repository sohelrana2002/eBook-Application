import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import AuthLayout from "@/layout/authLayout/AuthLayout";
import Login from "../auth/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Books from "../pages/books/Books";

import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "books",
        element: <Books />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
