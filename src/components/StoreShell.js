'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoBanner from '@/components/DemoBanner';
import CartSidebar from '@/components/CartSidebar';
import CookieConsent from '@/components/CookieConsent';
import ScrollToTop from '@/components/ScrollToTop';

export default function StoreShell({ categories, children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white">
        {children}
      </div>
    );
  }

  return (
    <>
      <DemoBanner />
      <Navbar categories={categories} />
      <CartSidebar />
      <CookieConsent />
      <ScrollToTop />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
