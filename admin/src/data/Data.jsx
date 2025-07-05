import { LayoutDashboard, Book, User, Lock } from "lucide-react";

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
];

const AdminProfileMenu = [
  {
    id: 1,
    title: "Prodile",
    path: "/admin-profile",
    icon: <LayoutDashboard />,
  },
];

export { NavMenu, AdminProfileMenu };
