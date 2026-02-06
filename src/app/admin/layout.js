'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: ShoppingBag, href: '/admin/products' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  // Skip layout for login page
  if (pathname === '/admin/login') return children;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col">
        <div className="p-8 border-b border-white/10">
          <Link href="/admin" className="font-bold text-xl tracking-tighter text-blue-400">FITCHECK ADMIN</Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                pathname === item.href ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 md:px-12 sticky top-0 bg-black/80 backdrop-blur-md z-10">
           <h1 className="font-bold text-lg uppercase tracking-widest text-gray-500">
             {menuItems.find(m => m.href === pathname)?.name || 'Dashboard'}
           </h1>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold">Admin Fitcheck</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">A</div>
           </div>
        </header>

        <div className="p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
