'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Truck, Printer, MessageCircle, Save, ExternalLink, ShieldCheck, MapPin, User, Mail, Phone, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const COURIER_OPTIONS = ['J&T Express', 'JNE Express', 'SiCepat Ekspres', 'Anteraja', 'POS Indonesia', 'Ninja Xpress', 'ID Express', 'GoSend / Grab'];

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
    return 'https://anteraja.id/id/tracking';
  } else if (c.includes('pos')) {
    return 'https://www.posindonesia.co.id/id/tracking';
  } else if (c.includes('ninja')) {
    return 'https://www.ninjaxpress.co/id-id/tracking';
  } else if (c.includes('id express')) {
    return 'https://idexpress.com/lacak-paket';
  }
  return `https://cekresi.com/?noresi=${cleanResi}`;
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [status, setStatus] = useState('paid');
  const [courier, setCourier] = useState('J&T Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [copiedResi, setCopiedResi] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.data) {
          const ord = data.data;
          setOrder(ord);
          setStatus(ord.status || 'paid');
          const cust = typeof ord.customer === 'object' && ord.customer !== null ? ord.customer : {};
          setCourier(cust.courier || 'J&T Express');
          setTrackingNumber(cust.trackingNumber || '');
        } else {
          toast.error('Pesanan tidak ditemukan');
        }
      } catch (err) {
        console.error('Failed to load order', err);
        toast.error('Gagal mengambil data pesanan');
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleUpdate = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          courier,
          trackingNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Status dan data pengiriman berhasil diperbarui!');
        setOrder(data.data);
      } else {
        toast.error(data.error || 'Gagal memperbarui pesanan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedResi(true);
    toast.success('Nomor resi berhasil disalin!');
    setTimeout(() => setCopiedResi(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 text-sm">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Pesanan Tidak Ditemukan</h2>
        <Link href="/admin/orders" className="text-blue-400 text-sm hover:underline">
          &larr; Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  const customer = typeof order.customer === 'object' && order.customer !== null ? order.customer : {};
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = order.total - subtotal;
  const officialTrackingUrl = getCourierTrackingUrl(courier, trackingNumber);

  // WhatsApp Message Generators
  const cleanPhone = (customer.noHp || '').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Template 1: Konfirmasi Pembayaran & Sedang Dikemas
  const waPackingMessage = encodeURIComponent(
    `Halo Kak ${customer.name || ''}, terima kasih telah berbelanja di Fitcheck Store!\n\n` +
      `Pembayaran pesanan baju Anda (Order ID: #${order.id.slice(-8).toUpperCase()}) sebesar Rp ${new Intl.NumberFormat('id-ID').format(order.total)} telah kami terima dengan baik.\n\n` +
      `Saat ini pesanan Anda sedang kami siapkan dan kemas dengan rapi sebelum kami serahkan ke gerai ekspedisi.\n\n` +
      `Detail pesanan Anda dapat dilihat di:\n` +
      `${siteUrl}/orders/${order.id}\n\n` +
      `Terima kasih atas kepercayaan Anda!`,
  );

  // Template 2: Paket Sudah Dikirim ke Ekspedisi & Nomor Resi
  const waShippedMessage = encodeURIComponent(
    `Halo Kak ${customer.name || ''}, kabar baik dari Fitcheck Store!\n\n` +
      `Pesanan baju Anda (#${order.id.slice(-8).toUpperCase()}) sudah kami serahkan ke pihak ekspedisi ${courier}.\n\n` +
      `📦 *Ekspedisi:* ${courier}\n` +
      `🔖 *Nomor Resi:* ${trackingNumber || '-'}\n` +
      `🌐 *Lacak Paket di Website Resmi:* ${officialTrackingUrl}\n\n` +
      `Terima kasih dan semoga suka dengan pakaian pilihan Anda!`,
  );

  return (
    <div className="space-y-8 print:p-0">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-mono text-white">#{order.id.slice(-8).toUpperCase()}</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  order.status === 'paid'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : order.status === 'shipped'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : order.status === 'processing'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-gray-500/10 text-gray-400 border border-white/10'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Dibuat pada {new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
          </div>
        </div>

        {/* Quick Utility Links */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handlePrint} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors">
            <Printer className="w-4 h-4" />
            <span>Cetak Label & Invoice</span>
          </button>

          <Link
            href={`/orders/${order.id}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors"
          >
            <span>Halaman Pembeli</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* WhatsApp Workflow Notification Card */}
      {formattedPhone && (
        <div className="bg-[#111] border border-green-500/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-400 uppercase tracking-wider">Kirim Chat WhatsApp ke Pembeli</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Kirim pesan langsung ke {customer.name} ({customer.noHp}) sesuai tahapan saat ini:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Step 1 WA */}
            <a
              href={`https://wa.me/${formattedPhone}?text=${waPackingMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all"
            >
              <span>1. WA: Sedang Dikemas</span>
            </a>

            {/* Step 2 WA */}
            <a
              href={`https://wa.me/${formattedPhone}?text=${waShippedMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all shadow-lg shadow-green-600/20"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>2. WA: Kirim No. Resi & Link Kurir</span>
            </a>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Fulfillment & Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status & Shipping Fulfillment Form */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl print:border-black print:bg-white print:text-black">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 print:text-black">
              <Truck className="w-5 h-5 text-blue-400 print:text-black" />
              Kelola Pengiriman Baju
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 print:text-black">Status Pesanan</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors print:text-black print:border-gray-300"
                  >
                    <option value="paid" className="bg-black text-white">
                      Sudah Bayar (Paid)
                    </option>
                    <option value="processing" className="bg-black text-white">
                      Sedang Dikemas (Packing)
                    </option>
                    <option value="shipped" className="bg-black text-white">
                      Sudah Diserahkan ke Kurir (Shipped)
                    </option>
                    <option value="completed" className="bg-black text-white">
                      Pesanan Selesai (Completed)
                    </option>
                    <option value="cancelled" className="bg-black text-white">
                      Dibatalkan (Cancelled)
                    </option>
                  </select>
                </div>

                {/* Courier Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 print:text-black">Pilihan Ekspedisi</label>
                  <select
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors print:text-black print:border-gray-300"
                  >
                    {COURIER_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-black text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tracking Number Input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 print:text-black">Nomor Resi dari Ekspedisi</label>
                <div className="relative">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Masukkan no resi dari struk ekspedisi (misal: JNT99881122)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500 transition-colors print:text-black print:border-gray-300"
                  />
                  {trackingNumber && (
                    <button type="button" onClick={() => copyToClipboard(trackingNumber)} className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg print:hidden">
                      {copiedResi ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedResi ? 'Disalin' : 'Salin'}</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 print:hidden">💡 Saat nomor resi disimpan, halaman pembeli akan otomatis menampilkan tombol langsung ke website resmi {courier} untuk pelacakan real-time.</p>
              </div>

              <div className="pt-2 flex items-center gap-3 print:hidden">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>

                {trackingNumber && (
                  <a
                    href={officialTrackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    <span>Buka Web Resmi {courier}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </form>
          </div>

          {/* Customer & Shipping Details */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl print:border-black print:bg-white print:text-black">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 print:text-black">
              <MapPin className="w-5 h-5 text-purple-400 print:text-black" />
              Alamat Pengiriman & Data Pembeli
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-500 mt-0.5 shrink-0 print:text-black" />
                  <div>
                    <p className="text-xs text-gray-500 print:text-black">Nama Pembeli</p>
                    <p className="font-bold text-white print:text-black">{customer.name || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-500 mt-0.5 shrink-0 print:text-black" />
                  <div>
                    <p className="text-xs text-gray-500 print:text-black">Nomor WhatsApp / HP</p>
                    <p className="font-medium text-white print:text-black">{customer.noHp || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-500 mt-0.5 shrink-0 print:text-black" />
                  <div>
                    <p className="text-xs text-gray-500 print:text-black">Email</p>
                    <p className="font-medium text-white print:text-black">{customer.email || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0 print:text-black" />
                  <div>
                    <p className="text-xs text-gray-500 print:text-black">Alamat Rumah</p>
                    <p className="font-medium text-white print:text-black">{customer.address || '-'}</p>
                    <p className="text-xs text-gray-400 mt-1 print:text-black">
                      Kota: {customer.city || '-'} | Kode Pos: {customer.postalCode || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Items & Payment Summary */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl print:border-black print:bg-white print:text-black">
            <h2 className="text-base font-bold text-white mb-4 print:text-black">Item Pakaian ({order.items.length})</h2>

            <div className="divide-y divide-white/5 print:divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-lg overflow-hidden shrink-0 relative print:border-gray-300">
                    <Image src="https://placehold.co/200x200/111/FFF?text=Shirt" alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate print:text-black">{item.name}</p>
                    <p className="text-xs text-gray-400 print:text-black">Jumlah: {item.quantity} pcs</p>
                    <p className="text-xs text-blue-400 font-medium mt-0.5 print:text-black">Rp {new Intl.NumberFormat('id-ID').format(item.price)} / pcs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white print:text-black">Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs print:border-gray-300 print:text-black">
              <div className="flex justify-between text-gray-400 print:text-black">
                <span>Subtotal Produk</span>
                <span>Rp {new Intl.NumberFormat('id-ID').format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400 print:text-black">
                <span>Ongkos Kirim</span>
                <span>Rp {new Intl.NumberFormat('id-ID').format(shipping > 0 ? shipping : 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/5 print:text-black print:border-gray-300">
                <span>Total Pembayaran</span>
                <span className="text-blue-400 print:text-black">Rp {new Intl.NumberFormat('id-ID').format(order.total)}</span>
              </div>
            </div>

            {/* Payment Badge */}
            <div className="mt-6 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2.5 print:hidden">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Pembayaran Diverifikasi</p>
                <p className="text-[10px] text-gray-400">Diproses resmi melalui Midtrans Payment Gateway</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
