'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowRight, ShoppingBag, ShieldCheck, MapPin, PackageCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function OrderConfirmedPage() {
  const params = useParams();
  const orderId = params?.id;
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pastikan keranjang bersih begitu sampai di halaman konfirmasi ini
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
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-xs">Memuat konfirmasi pesanan...</p>
      </div>
    );
  }

  const customer = typeof order?.customer === 'object' && order?.customer !== null ? order.customer : {};

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/10">
          <Check className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Title & Description */}
        <div>
          <span className="text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full uppercase tracking-wider">Pembayaran Berhasil</span>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white mt-3">Pesanan Dikonfirmasi!</h1>
          <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed">Terima kasih telah berbelanja di Fitcheck Store. Pembayaran Anda telah kami terima dan pesanan akan segera disiapkan.</p>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 text-left space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Nomor Pesanan</span>
              <span className="font-mono text-xs font-black text-blue-400">#{order.id.slice(-8).toUpperCase()}</span>
            </div>

            {/* Product summary */}
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-gray-500">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-white">Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Total Paid */}
            <div className="pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">Total Dibayar</span>
              <span className="text-sm font-black text-white">Rp {new Intl.NumberFormat('id-ID').format(order.total)}</span>
            </div>
          </div>
        )}

        {/* Destination Snippet */}
        {customer.address && (
          <div className="flex items-center gap-2.5 text-xs text-gray-400 bg-white/1 border border-white/5 px-3.5 py-2.5 rounded-xl text-left">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">
              Tujuan: {customer.name} - {customer.address}, {customer.city}
            </span>
          </div>
        )}

        {/* Two Clear Choice Buttons */}
        <div className="space-y-2.5 pt-2">
          {order && (
            <Link
              href={`/orders/${order.id}`}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-all shadow-lg shadow-blue-600/30"
            >
              <span>Lacak Pesanan & Cek Resi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-all border border-white/10"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Lanjut Berbelanja</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
