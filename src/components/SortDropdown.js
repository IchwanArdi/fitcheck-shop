'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentSort = searchParams.get('sort') || 'latest';

  const options = [
    { label: 'Latest Arrivals', value: 'latest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ];

  const currentLabel = options.find(opt => opt.value === currentSort)?.label || 'Latest';

  const handleSort = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-full text-sm font-medium hover:border-white/20 transition-all text-gray-300 hover:text-white"
      >
        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        <span>Sort: {currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 z-50 animate-in fade-in zoom-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2 backdrop-blur-xl">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  currentSort === option.value 
                    ? 'bg-white/10 text-white font-bold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
