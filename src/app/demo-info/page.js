import Link from 'next/link';
import { ArrowLeft, ShoppingBag, ShieldCheck, Database } from 'lucide-react';

export const metadata = {
  title: 'Demo Information',
  description: 'Information regarding the Fitcheck Store demonstration mode.'
};

export default function DemoInfoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-20 md:py-32">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-12 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Store
      </Link>

      <div className="space-y-12">
        <header>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">Demo Information</h1>
          <p className="text-xl text-gray-400 leading-relaxed font-medium">
            Fitcheck is a high-performance e-commerce demonstration built to showcase modern web technologies and premium design aesthetics.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Shopping & Checkout</h2>
            </div>
            {/* Karakter " pada "checkout" sudah diganti dengan &quot; */}
            <p className="text-gray-400 text-sm leading-relaxed">
              All products listed are for demonstration purposes. While you can complete the &quot;checkout&quot; process, no actual payments are processed, and no physical items will be shipped.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Data & Privacy</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              We respect your privacy. This store does not track your geographic location. Personal information entered during checkout is stored in a demonstration database for Order Management simulation.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <Database className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Technology Stack</h2>
            </div>
            {/* Mengganti sintaks markdown ** dengan tag <strong> agar aman di JSX */}
            <p className="text-gray-400 text-sm leading-relaxed">
              Built with <strong className="text-white font-bold">Next.js 15</strong>, <strong className="text-white font-bold">Prisma ORM</strong>, <strong className="text-white font-bold">PostgreSQL</strong>, and <strong className="text-white font-bold">Redis Caching</strong>. The store features real-time search, dynamic inventory management, and a secure admin dashboard.
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5">
          <p className="text-sm text-gray-500 italic">
            &copy; {new Date().getFullYear()} Fitcheck Elite Demo. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
