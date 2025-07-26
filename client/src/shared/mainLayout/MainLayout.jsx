"use client";

import { AuthProvider } from "@/context/authContext";
import Navbar from "../navbar/Navbar";
import TanstackProvider from "@/provider/TanstackProvider";
import Footer from "@/components/footer/Footer";
import CopyRight from "../copyRight/CopyRight";
import { usePathname } from "next/navigation";

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/books" ||
    pathname === "/profile" ||
    pathname === "/profile/requested-book";

  return (
    <main>
      <AuthProvider>
        <TanstackProvider>
          <Navbar />
          <div className="pt-[3.8rem]">{children}</div>
          {!hideFooter && <Footer />}
          {!hideFooter && <CopyRight />}
        </TanstackProvider>
      </AuthProvider>
    </main>
  );
};

export default MainLayout;
