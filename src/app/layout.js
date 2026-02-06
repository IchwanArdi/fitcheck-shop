import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Fitcheck Store | Premium Minimalist Essentials",
    template: "%s | Fitcheck Store"
  },
  description: "Curated collection of high-quality minimalist goods for the modern lifestyle.",
  metadataBase: new URL('https://fitcheck-store.vercel.app'), // Placeholder
  openGraph: {
    title: "Fitcheck Store",
    description: "Premium Minimalist Essentials",
    url: "https://fitcheck-store.vercel.app",
    siteName: "Fitcheck",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitcheck Store",
    description: "Premium Minimalist Essentials",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { getCategories } from "@/lib/data";
import { Toaster } from 'sonner';
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";

export default async function RootLayout({ children }) {
  const categories = await getCategories();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Navbar categories={categories} />
          <CartSidebar />
          <Toaster richColors closeButton theme="dark" position="top-center" />
          <CookieConsent />
          <ScrollToTop />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
