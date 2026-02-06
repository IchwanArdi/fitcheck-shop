'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-white transition-colors flex-shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 flex-shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300 font-medium truncate max-w-[150px] md:max-w-none">
                {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
