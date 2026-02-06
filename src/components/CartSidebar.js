'use client';

import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartSidebar() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-500 ease-in-out ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={toggleCart}
      />
      
      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#111] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            Your Cart ({cartItems.length})
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {cartItems.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
               <ShoppingBag className="w-12 h-12 opacity-20" />
               <p>Your cart is empty.</p>
               <button onClick={toggleCart} className="text-sm text-blue-400 hover:text-blue-300">
                 Continue Shopping
               </button>
             </div>
           ) : (
             cartItems.map((item) => (
               <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-20 h-20 bg-white/5 rounded-lg border border-white/5 overflow-hidden flex-shrink-0 relative">
                    <Image 
                      src={item.images?.[0] || item.image || 'https://placehold.co/200x200/111/FFF?text=No+Image'} 
                      alt={item.name} 
                      fill
                      className="object-cover" 
                      sizes="80px"
                    />
                  </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start">
                     <h3 className="font-medium text-white">{item.name}</h3>
                     <p className="text-sm font-medium text-gray-300">
                        Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}
                     </p>
                   </div>
                   <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                   
                   <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 bg-white/5 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.size, -1)} className="p-1 hover:text-white text-gray-400">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, 1)} className="p-1 hover:text-white text-gray-400">
                           <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-xs text-red-400 hover:text-red-300 underline">
                        Remove
                      </button>
                   </div>
                 </div>
               </div>
             ))
           )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-[#111]">
            <div className="flex justify-between items-center mb-6 text-lg font-bold">
              <span>Total</span>
              <span>Rp {new Intl.NumberFormat('id-ID').format(total)}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition-colors block text-center"
            >
              Checkout
            </Link>
            <p className="text-center text-xs text-gray-500 mt-4">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        )}

      </div>
    </>
  );
}
