import prisma from '@/lib/prisma';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

async function getStats() {
  const [productCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
  ]);

  return [
    { name: 'Total Products', value: productCount, icon: Package, color: 'text-blue-500' },
    { name: 'Total Customers', value: userCount, icon: Users, color: 'text-purple-500' },
    { name: 'Total Sales', value: 'Rp 1.250.000', icon: ShoppingCart, color: 'text-green-500' },
    { name: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'text-orange-500' },
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
        {/* Recent Traffic Table Mockup */}
        <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-bold text-lg">Site Activity</h3>
          </div>
          <div className="p-6">
             <div className="space-y-4">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <p className="text-sm font-medium">New visit from Jakarta, ID</p>
                    </div>
                    <span className="text-xs text-gray-500">2 mins ago</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
           <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
           <div className="space-y-4">
             <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Add New Product</button>
             <button className="w-full bg-white/5 border border-white/10 font-bold py-3 rounded-xl hover:bg-white/10 transition-colors">View Orders</button>
             <button className="w-full bg-white/5 border border-white/10 font-bold py-3 rounded-xl hover:bg-white/10 transition-colors">Generate Report</button>
           </div>
        </div>
      </div>
    </div>
  );
}
