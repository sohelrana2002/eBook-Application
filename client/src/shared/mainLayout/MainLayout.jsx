"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "../navbar/Navbar";
import TanstackProvider from "@/provider/TanstackProvider";
import Footer from "@/components/footer/Footer";
import CopyRight from "../copyRight/CopyRight";
import { usePathname } from "next/navigation";
import { NotificationProvider } from "@/context/NotificationContext";
import { CartProvide } from "@/context/CartContext";

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const hideSection =
    pathname === "/books" ||
    pathname === "/profile" ||
    pathname === "/profile/requested-book" ||
    pathname === "/profile/edit-profile";

  return (
    <main>
      <AuthProvider>
        <TanstackProvider>
          <NotificationProvider>
            <CartProvide>
              <Navbar />
              <div className="pt-[3.8rem]">{children}</div>
              {!hideSection && <Footer />}
              {!hideSection && <CopyRight />}
            </CartProvide>
          </NotificationProvider>
        </TanstackProvider>
      </AuthProvider>
    </main>
  );
};

export default MainLayout;
