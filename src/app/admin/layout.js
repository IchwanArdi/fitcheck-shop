'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, LogOut, Package, ArrowUpRight, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      isActive: pathname === '/admin/dashboard',
    },
    {
      name: 'Orders',
      icon: ShoppingBag,
      href: '/admin/orders',
      isActive: pathname.startsWith('/admin/orders'),
    },
    {
      name: 'Products',
      icon: Package,
      href: '/admin/products',
      isActive: pathname.startsWith('/admin/products'),
    },
  ];

  const handleLogout = () => {
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  // Skip layout for login page
  if (pathname === '/admin/login') return children;

  const currentTitle = menuItems.find((m) => m.isActive)?.name || 'Admin Panel';

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 border-r border-white/10 bg-[#0d0d0d] flex flex-col z-50 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">FC</div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">FITCHECK</span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase block">Commerce Admin</span>
            </div>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Menu Utama</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-6">
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Toko Publik</p>
            <Link href="/" target="_blank" className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Buka Website Toko
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </Link>
          </div>
        </nav>

        {/* User profile & logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Admin Store</p>
              <p className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
                Online
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full">
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5" aria-label="Open Menu">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-black text-sm uppercase tracking-widest text-white">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span>Lihat Toko</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
