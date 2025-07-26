import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/shared/navbar/Navbar";
import { AuthProvider } from "@/context/authContext";
import TanstackProvider from "@/provider/TanstackProvider";
import Footer from "@/components/footer/Footer";
import CopyRight from "@/shared/copyRight/CopyRight";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "e-Book Application",
  description: "e-Book platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-arp="">
      <body data-new-gr-c-s-check-loaded="14.1233.0" data-gr-ext-installed="">
        <AuthProvider>
          <TanstackProvider>
            <Navbar />
            <div className="pt-[3.8rem]">{children}</div>
            <Footer />
            <CopyRight />
          </TanstackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
