import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import AuthLayout from "@/layout/authLayout/AuthLayout";
import Login from "../auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Books from "../pages/books/Books";
import ViewProfile from "@/shared/viewProfile/ViewProfile";
import Logout from "@/auth/Logout";
import AddBook from "@/pages/addBook/AddBook";
import DeleteBook from "@/pages/deleteBook/DeleteBook";
import UpdateBook from "@/pages/updateBook/UpdateBook";
import Users from "@/pages/users/Users";
import DeleteUser from "@/pages/deleteUser/DeleteUser";
import Admins from "@/pages/admins/Admins";
import AdminProfileLayout from "@/layout/AdminProfileLayout/AdminProfileLayout";
import EditProfile from "@/pages/editProfile/EditProfile";
import RequestedBook from "@/pages/requestedBook/RequestedBook";

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
      {
        path: "users/delete-user/:id",
        element: <DeleteUser />,
      },
      {
        path: "admins",
        element: <Admins />,
      },
      {
        path: "requested-book",
        element: <RequestedBook />,
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

  {
    path: "/admin-profile",
    element: <AdminProfileLayout />,
    children: [
      {
        index: true,
        element: <ViewProfile />,
      },
      {
        path: "edit-profile",
        element: <EditProfile />,
      },
    ],
  },
]);

export default router;
