'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Clock, Truck, PackageCheck, MapPin, ShieldCheck, Copy, Check, Printer, ArrowLeft, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';

const getCourierTrackingUrl = (courierName, resi) => {
  const c = (courierName || '').toLowerCase();
  const cleanResi = encodeURIComponent(resi || '');

  if (c.includes('j&t') || c.includes('jet')) {
    return 'https://www.jet.co.id/track';
  } else if (c.includes('jne')) {
    return 'https://www.jne.co.id/tracking-package';
  } else if (c.includes('sicepat')) {
    return 'https://www.sicepat.com/checkAwb';
  } else if (c.includes('anteraja')) {
    return 'https://anteraja.id/tracking';
  } else if (c.includes('pos')) {
    return 'https://posindonesia.co.id/id/tracking';
  } else if (c.includes('ninja')) {
    return 'https://www.ninjaxpress.co/id-id/tracking';
  } else if (c.includes('id express')) {
    return 'https://idexpress.com/track';
  }
  return `https://cekresi.com/?noresi=${cleanResi}`;
};

const statusBadgeConfig = {
  pending: {
    label: 'Menunggu Pembayaran',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Clock,
  },
  paid: {
    label: 'Sedang Dikemas',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: PackageCheck,
  },
  processing: {
    label: 'Sedang Dikemas',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: PackageCheck,
  },
  shipped: {
    label: 'Sudah Dikirim',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: Truck,
  },
  completed: {
    label: 'Pesanan Selesai',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: Clock,
  },
};

export default function CustomerOrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id;

  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedResi, setCopiedResi] = useState(false);

  // Kosongkan keranjang belanja karena pesanan sudah berhasil dibuat
  useEffect(() => {
    if (typeof clearCart === 'function') {
      clearCart();
    }
  }, [clearCart]);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          toast.error('Pesanan tidak ditemukan');
        }
      } catch (err) {
        console.error('Failed to load order', err);
        toast.error('Gagal memuat informasi pesanan');
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const copyResi = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedResi(true);
    toast.success('Nomor resi berhasil disalin!');
    setTimeout(() => setCopiedResi(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-xs">Memuat pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold">Pesanan Tidak Ditemukan</h1>
        <Link href="/" className="bg-white text-black font-bold px-6 py-2 rounded-full text-xs hover:bg-gray-200 transition-colors">
          Kembali ke Toko
        </Link>
      </div>
    );
  }

  const customer = typeof order.customer === 'object' && order.customer !== null ? order.customer : {};
  const courier = customer.courier || 'Ekspedisi';
  const trackingNumber = customer.trackingNumber;
  const officialTrackingUrl = getCourierTrackingUrl(courier, trackingNumber);

  const currentStatus = statusBadgeConfig[order.status] || statusBadgeConfig.paid;
  const StatusIcon = currentStatus.icon;

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = order.total - subtotal;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog</span>
        </Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors">
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Bukti Pembayaran</span>
        </button>
      </div>

      {/* Main Minimalist Receipt Card */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Detail Pesanan</p>
            <h1 className="text-xl md:text-2xl font-black font-mono text-white mt-0.5">#{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
          </div>

          {/* Minimalist Status Badge */}
          <div className="self-start sm:self-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${currentStatus.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{currentStatus.label}</span>
            </div>
          </div>
        </div>

        {/* Courier & Tracking Section (Simple & Direct) */}
        {trackingNumber ? (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">Pengiriman via {courier}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-base font-black text-white">{trackingNumber}</span>
                <button onClick={() => copyResi(trackingNumber)} className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Salin Resi">
                  {copiedResi ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <a
              href={officialTrackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 self-start sm:self-auto"
            >
              <span>Lacak di Web Resmi {courier}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 flex items-center gap-3 text-xs text-gray-400">
            <PackageCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Nomor resi akan tercantum di sini begitu paket diserahkan ke pihak ekspedisi.</span>
          </div>
        )}

        {/* Clothing Items List */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Item Pembelian</p>
          <div className="divide-y divide-white/5">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden relative shrink-0">
                    <Image src="https://placehold.co/200x200/111/FFF?text=Shirt" alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">Jumlah: {item.quantity} pcs</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal Produk</span>
            <span>Rp {new Intl.NumberFormat('id-ID').format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Ongkos Kirim</span>
            <span>Rp {new Intl.NumberFormat('id-ID').format(shipping > 0 ? shipping : 0)}</span>
          </div>
          <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/5">
            <span>Total Pembayaran</span>
            <span className="text-blue-400">Rp {new Intl.NumberFormat('id-ID').format(order.total)}</span>
          </div>
        </div>

        {/* Delivery Address & Verification (Compact) */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Tujuan Pengiriman
            </p>
            <p className="font-bold text-white">{customer.name || '-'}</p>
            <p className="text-gray-400">{customer.noHp || '-'}</p>
            <p className="text-gray-400">{customer.address || '-'}</p>
            <p className="text-gray-400">
              {customer.city || ''} {customer.postalCode || ''}
            </p>
          </div>

          <div>
            <p className="font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Pembayaran
            </p>
            <p className="text-gray-400">Transaksi sah dan terverifikasi otomatis melalui sistem pembayaran Midtrans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
