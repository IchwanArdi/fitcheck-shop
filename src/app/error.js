'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-[#111] border border-white/10 rounded-[3rem] shadow-2xl animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">System Glitch</h1>
          <p className="text-gray-400">Something went wrong while processing your request. Our team has been notified.</p>
        </div>

        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
