import prisma from '@/lib/prisma';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  const [productCount, userCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({
      select: { total: true }
    })
  ]);

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

  return [
    { name: 'Total Products', value: productCount, icon: Package, color: 'text-blue-500' },
    { name: 'Total Customers', value: userCount, icon: Users, color: 'text-purple-500' },
    { name: 'Total Revenue', value: `Rp ${new Intl.NumberFormat('id-ID').format(totalSales)}`, icon: ShoppingCart, color: 'text-green-500' },
    { name: 'Total Orders', value: orders.length, icon: TrendingUp, color: 'text-orange-500' },
  ];
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-[#111] border border-white/10 p-6 rounded-3xl shadow-sm">
            <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm mb-1 font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 lg:col-span-1">
           <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
           <div className="space-y-4">
             <Link href="/admin/products" className="block w-full text-center bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Manage Products</Link>
             <Link href="/admin/orders" className="block w-full text-center bg-white/5 border border-white/10 font-bold py-3 rounded-xl hover:bg-white/10 transition-colors">View Orders</Link>
             <button className="w-full bg-white/5 border border-white/10 font-bold py-3 rounded-xl hover:bg-white/10 transition-colors">Internal Analytics</button>
           </div>
        </div>

        <div className="lg:col-span-2 bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
            <Package className="w-12 h-12 text-gray-700 mb-4" />
            <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-2">System Notice</h4>
            <p className="text-gray-600 text-sm max-w-sm">Dashboard simplified. External tracking removed for improved performance and privacy.</p>
        </div>
      </div>
    </div>
  );
}
