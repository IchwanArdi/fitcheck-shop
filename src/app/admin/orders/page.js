import prisma from '@/lib/prisma';
import { ShoppingBag, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

const statusColors = {
  pending: 'bg-orange-500/10 text-orange-500',
  paid: 'bg-blue-500/10 text-blue-500',
  shipped: 'bg-purple-500/10 text-purple-500',
  completed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

const statusIcons = {
  pending: Clock,
  paid: ShoppingBag,
  shipped: ShoppingBag,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Orders</h1>
          <p className="text-gray-500">Manage customer purchases and fulfillment.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full">
          <span className="text-sm font-bold">{orders.length} Total Orders</span>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs uppercase font-black tracking-widest text-gray-500">ID & Date</th>
                <th className="px-6 py-4 text-xs uppercase font-black tracking-widest text-gray-500">Customer</th>
                <th className="px-6 py-4 text-xs uppercase font-black tracking-widest text-gray-500">Items</th>
                <th className="px-6 py-4 text-xs uppercase font-black tracking-widest text-gray-500">Total</th>
                <th className="px-6 py-4 text-xs uppercase font-black tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic">No orders found yet.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || Clock;
                  const customer = order.customer;
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{order.items.length} products</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black">Rp {new Intl.NumberFormat('id-ID').format(order.total)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
