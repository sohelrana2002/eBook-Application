import { LayoutDashboard, Book, User, Lock, HandHelping } from "lucide-react";

const NavMenu = [
  {
    id: 1,
    title: "Dashboard",
    path: "/",
    icon: <LayoutDashboard />,
  },
  {
    id: 2,
    title: "Books",
    path: "/books",
    icon: <Book />,
  },
  {
    id: 3,
    title: "Admins",
    path: "admins",
    icon: <Lock />,
  },
  {
    id: 4,
    title: "Users",
    path: "/users",
    icon: <User />,
  },
  {
    id: 5,
    title: "Requested Book",
    path: "/requested-book",
    icon: <HandHelping />,
  },
];

const AdminProfileMenu = [
  {
    id: 1,
    title: "Admin Profile",
    path: "/admin-profile",
    icon: <LayoutDashboard />,
  },
];

export { NavMenu, AdminProfileMenu };
