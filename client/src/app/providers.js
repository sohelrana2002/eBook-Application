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
import ServerGate from "@/components/common/ServerGate";
import { ToastContainer } from "react-toastify";

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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 99999 }}
      />
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
      <ServerGate>
        <Website>{children}</Website>
      </ServerGate>
    </ServerProvider>
  );
};
