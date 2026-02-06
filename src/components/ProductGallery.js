'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [], name }) {
  const [activeImage, setActiveImage] = useState(images[0] || 'https://placehold.co/600x600/111/FFF?text=No+Image');

  // Sync active image if images prop changes (important for client-side navigation)
  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="bg-[#111] border border-white/5 rounded-2xl aspect-square flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Preview */}
      <div className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 aspect-square flex items-center justify-center overflow-hidden relative">
        <Image 
          src={activeImage} 
          alt={name}
          fill
          className="object-contain p-8 md:p-12 drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-in-out shadow-blue-500/20"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === img ? 'border-blue-500 scale-95 shadow-lg shadow-blue-500/20' : 'border-white/5 hover:border-white/20'
              }`}
            >
              <Image 
                src={img} 
                alt={`${name} thumb ${index}`} 
                fill 
                className="object-cover" 
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
