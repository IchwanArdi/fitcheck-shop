import Link from 'next/link';
import { Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
          <Ghost className="w-24 h-24 mx-auto text-white/20 relative z-10" />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-black italic uppercase tracking-tighter opacity-10">404</h1>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Lost in Style?</h2>
          {/* Karakter ' pada you're sudah diganti dengan &apos; */}
          <p className="text-gray-400">The collection you&apos;re looking for doesn&apos;t exist or has been moved to a secret vault.</p>
        </div>

        <div className="pt-8">
          <Link
            href="/"
            className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
          >
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
