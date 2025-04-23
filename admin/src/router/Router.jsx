import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import AuthLayout from "@/layout/authLayout/AuthLayout";
import Login from "../auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Books from "../pages/books/Books";
import ViewProfile from "@/shared/viewProfile/ViewProfile";
import Logout from "@/auth/Logout";
import AddBook from "@/pages/addBook/AddBook";

import App from "../App";
import DeleteBook from "@/pages/deleteBook/DeleteBook";
import UpdateBook from "@/pages/updateBook/UpdateBook";
import Users from "@/pages/users/Users";

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
      {
        path: "profile",
        element: <ViewProfile />,
      },
      {
        path: "auth/logout",
        element: <Logout />,
      },
      {
        path: "book/add-book",
        element: <AddBook />,
      },
      {
        path: "book/delete/:id",
        element: <DeleteBook />,
      },
      {
        path: "book/update/:id",
        element: <UpdateBook />,
      },
      {
        path: "users",
        element: <Users />,
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
