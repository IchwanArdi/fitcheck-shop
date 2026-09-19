import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, ChevronRight, Truck, PackageCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

const statusConfig = {
  pending: {
    label: 'Menunggu Bayar',
    color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    icon: Clock,
  },
  paid: {
    label: 'Sudah Bayar',
    color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    icon: CheckCircle2,
  },
  processing: {
    label: 'Dikemas (Packing)',
    color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    icon: PackageCheck,
  },
  shipped: {
    label: 'Sedang Dikirim',
    color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    icon: Truck,
  },
  completed: {
    label: 'Selesai',
    color: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'bg-red-500/10 text-red-400 border border-red-500/20',
    icon: XCircle,
  },
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const counts = {
    total: orders.length,
    paid: orders.filter((o) => o.status === 'paid').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Manajemen Pesanan</h1>
          <p className="text-gray-400 text-sm">Kelola proses fulfillment, pengiriman baju, dan input nomor resi.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {counts.paid} Perlu Diproses
          </div>
          <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-300">{counts.total} Total Pesanan</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                <th className="px-6 py-4 text-[11px] uppercase font-black tracking-wider text-gray-400">Order ID & Tanggal</th>
                <th className="px-6 py-4 text-[11px] uppercase font-black tracking-wider text-gray-400">Pelanggan</th>
                <th className="px-6 py-4 text-[11px] uppercase font-black tracking-wider text-gray-400">Produk Baju</th>
                <th className="px-6 py-4 text-[11px] uppercase font-black tracking-wider text-gray-400">Total Biaya</th>
                <th className="px-6 py-4 text-[11px] uppercase font-black tracking-wider text-gray-400">Status & Ekspedisi</th>
                <th className="px-6 py-4 text-[11px] uppercase font-black tracking-wider text-gray-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  const customer = typeof order.customer === 'object' && order.customer !== null ? order.customer : {};
                  const courier = customer.courier;
                  const trackingNumber = customer.trackingNumber;

                  return (
                    <tr key={order.id} className="hover:bg-white/3 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1">
                          #{order.id.slice(-8).toUpperCase()}
                        </Link>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">{customer.name || 'Pelanggan'}</p>
                        <p className="text-xs text-gray-400">{customer.email || '-'}</p>
                        <p className="text-xs text-gray-400">{customer.noHp || '-'}</p>
                        {customer.city && <p className="text-[11px] text-gray-500">{customer.city}</p>}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{order.items.length} item pakaian</p>
                        <p className="text-xs text-gray-500 truncate max-w-50">{order.items.map((i) => i.name).join(', ')}</p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-white">Rp {new Intl.NumberFormat('id-ID').format(order.total)}</p>
                      </td>

                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{status.label}</span>
                        </div>
                        {trackingNumber && (
                          <p className="text-[11px] text-gray-400 mt-1 font-mono flex items-center gap-1">
                            <Truck className="w-3 h-3 text-purple-400" />
                            {courier || 'Kurir'}: {trackingNumber}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-blue-600 text-gray-300 hover:text-white text-xs font-bold transition-all border border-white/10 hover:border-blue-500"
                        >
                          <span>Kelola</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
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
