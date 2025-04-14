import { LayoutDashboard, Book } from "lucide-react";

const NavMenu = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: 2,
    title: "Books",
    path: "/books",
    icon: <Book />,
  },
];

export { NavMenu };
