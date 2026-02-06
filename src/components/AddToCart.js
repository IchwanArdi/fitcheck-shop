'use client';

import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function AddToCart({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');

  return (
    <div>
        <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Select Size</h3>
            <div className="flex gap-4">
                {['S', 'M', 'L', 'XL'].map((size) => (
                    <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-all 
                        ${selectedSize === size 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-white/5 border-white/10 hover:border-blue-500 hover:text-blue-500'}`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>

        <button 
            onClick={() => addToCart(product, selectedSize)}
            className="w-full md:w-auto bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
            <Plus className="w-5 h-5" />
            Add to Cart
        </button>
    </div>
  );
}
