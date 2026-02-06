'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCarousel({ products }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    // Disable smooth scroll during drag for better responsiveness
    scrollRef.current.style.scrollBehavior = 'auto';
    scrollRef.current.style.scrollSnapType = 'none';
  };

  const onMouseLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Re-enable snap
    scrollRef.current.style.scrollBehavior = 'smooth';
    scrollRef.current.style.scrollSnapType = 'x mandatory';
  };

  const onMouseUp = () => {
    setIsDragging(false);
    // Re-enable snap
    scrollRef.current.style.scrollBehavior = 'smooth';
    scrollRef.current.style.scrollSnapType = 'x mandatory';
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    if (Math.abs(walk) > 5) setDragMoved(true);
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleLinkClick = (e) => {
    // If we were dragging, prevent the link from being followed
    if (dragMoved) {
      e.preventDefault();
    }
  };

  return (
    <div className="mt-20 border-t border-white/5 pt-12 relative select-none">
      <div className="flex items-center justify-between mb-8 px-4 md:px-0">
        <h2 className="text-xl font-bold text-gray-400 tracking-tight uppercase text-xs">Curated Selection</h2>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => scroll('left')}
                className="p-2 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-gray-400"
                aria-label="Scroll Left"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
                onClick={() => scroll('right')}
                className="p-2 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-gray-400"
                aria-label="Scroll Right"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>
      
      <div className="relative group">
        {/* Manual Scroll Container */}
        <div 
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className={`flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {products.map((product) => (
             <Link 
               href={`/product/${product.id}`} 
               key={product.id} 
               onClick={handleLinkClick}
               className="block w-64 md:w-80 flex-shrink-0 group/card snap-start pointer-events-auto"
               draggable="false"
             >
                <div className="bg-[#111] border border-white/5 rounded-2xl aspect-[4/3] overflow-hidden mb-4 relative pointer-events-none">
                   <Image 
                     src={product.images?.[0] || 'https://placehold.co/400x400/111/FFF?text=No+Image'} 
                     alt={product.name} 
                     fill
                     className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-in-out"
                     draggable="false"
                     sizes="(max-width: 768px) 256px, 320px"
                   />
                </div>
                <div className="px-2 pointer-events-none">
                  <h3 className="font-bold text-base text-gray-200 group-hover/card:text-white transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
                </div>
             </Link>
          ))}
          {/* Spatial padding at the end */}
          <div className="w-4 md:w-20 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
