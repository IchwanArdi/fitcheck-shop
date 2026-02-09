'use client';

import Link from 'next/link';
import { Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-600/10 border-b border-blue-500/20 backdrop-blur-md relative z-[60]">
      <div className="mx-auto max-w-7xl px-4 py-2 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs md:text-sm font-medium text-blue-400">
          <Info className="w-4 h-4 flex-shrink-0" />
          <p className="flex flex-wrap items-center gap-x-2">
            <span>Fitcheck is currently in Demo Mode.</span>
            <Link 
              href="/demo-info" 
              className="text-white underline hover:text-blue-300 transition-colors font-bold uppercase tracking-widest text-[10px] decoration-white/30"
            >
              Learn More
            </Link>
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/5 rounded-full transition-colors text-blue-400/50 hover:text-white"
          aria-label="Close Banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
