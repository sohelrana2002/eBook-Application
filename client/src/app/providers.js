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

const Website = ({ children }) => {
  const pathname = usePathname();
  const hideSection =
    pathname === "/books" ||
    pathname === "/account-info" ||
    pathname === "/account-info/edit-profile" ||
    pathname === "/requested-book" ||
    pathname === "/cart";

  return (
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
  );
};

export const Providers = ({ children }) => {
  const enableServerGate =
    process.env.NEXT_PUBLIC_ENABLE_SERVER_GATE === "true";

  if (!enableServerGate) {
    return <Website>{children}</Website>;
  }

  return (
    <ServerProvider>
      <Website>{children}</Website>
    </ServerProvider>
  );
};
