"use client";

import Footer from "@/components/footer/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvide } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ServerProvider } from "@/context/ServerContext";
import TanstackProvider from "@/provider/TanstackProvider";
import CopyRight from "@/shared/copyRight/CopyRight";
import Navbar from "@/shared/navbar/Navbar";
import { usePathname } from "next/navigation";

export const Providers = ({ children }) => {
  const pathname = usePathname();
  const hideSection =
    pathname === "/books" ||
    pathname === "/account-info" ||
    pathname === "/account-info/edit-profile" ||
    pathname === "/requested-book" ||
    pathname === "/cart";

  return (
    <ServerProvider>
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
    </ServerProvider>
  );
};
