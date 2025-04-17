import { LayoutDashboard, Book } from "lucide-react";

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
];

export { NavMenu };
