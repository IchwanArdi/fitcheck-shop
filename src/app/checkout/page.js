'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, CreditCard, ShieldCheck, Check } from 'lucide-react';
import { createOrder as createOrderAction } from '@/lib/actions'; // Renamed to avoid conflict
import { useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cartItems, cartCount, clearCart } = useCart(); // Removed createOrder from here
  const [isProcessing, setIsProcessing] = useState(false);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 25000 : 0; // Flat shipping rate
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate payment process and save to DB
    const customerData = { 
      name: `${firstName} ${lastName}`, 
      email, 
      address, 
      city, 
      postalCode 
    };
    const result = await createOrderAction(customerData, cartItems, total);

    if (result.success) {
      setOrderId(result.orderId);
      setTimeout(() => {
        setIsSubmitting(false);
        setOrderConfirmed(true);
        clearCart();
      }, 1500);
    } else {
      setIsSubmitting(false);
      toast.error("Order failed. Please try again.");
    }
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Order Success</h1>
          <p className="text-gray-400">Thank you for your purchase. We will notify you when your order is shipped.</p>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
             <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Order ID</p>
             <p className="font-mono text-sm">#{orderId}</p>
          </div>
          <div className="pt-4">
            <Link 
              href="/" 
              className="inline-block w-full bg-white text-black font-extrabold py-4 rounded-full uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartCount === 0 && !isSubmitting) { // Changed isProcessing to isSubmitting
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some items to your cart to proceed to checkout.</p>
        <Link href="/" className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full">
          Back to Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left: Checkout Form */}
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          
          <h1 className="text-3xl font-bold mb-10">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <input 
                  required
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </section>

            {/* Shipping Info */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold">2</span>
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  required
                  placeholder="First Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input 
                  required
                  placeholder="Last Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <div className="md:col-span-2">
                  <input 
                    required
                    placeholder="Address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <input 
                  required
                  placeholder="City"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input 
                   required
                   placeholder="Postal Code"
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold">3</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <label className="relative flex items-center p-4 border border-blue-500 bg-blue-500/5 rounded-xl cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="hidden" />
                    <CreditCard className="w-5 h-5 mr-3 text-blue-400" />
                    <div className="flex-1">
                       <p className="text-sm font-bold">Bank Transfer</p>
                       <p className="text-xs text-gray-500">BCA, Mandiri, BNI</p>
                    </div>
                 </label>
                 <label className="relative flex items-center p-4 border border-white/10 bg-white/5 rounded-xl cursor-pointer hover:border-white/20">
                    <input type="radio" name="payment" className="hidden" />
                    <ShieldCheck className="w-5 h-5 mr-3 text-gray-400" />
                    <div className="flex-1">
                       <p className="text-sm font-bold">E-Wallet</p>
                       <p className="text-xs text-gray-500">GoPay, OVO, Dana</p>
                    </div>
                 </label>
              </div>
            </section>

            <button 
              disabled={isProcessing}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Pay Rp ${new Intl.NumberFormat('id-ID').format(total)}`}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-[400px]">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sticky top-32">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 no-scrollbar">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                   <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image 
                        src={item.images?.[0] || item.image || 'https://placehold.co/200x200/111/FFF?text=No+Image'} 
                        alt={item.name} 
                        fill
                        className="object-cover" 
                        sizes="64px"
                      />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-sm font-bold truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} • Size: {item.size}</p>
                   </div>
                   <p className="text-sm font-medium">Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>Rp {new Intl.NumberFormat('id-ID').format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>Rp {new Intl.NumberFormat('id-ID').format(shipping)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-extrabold pt-3 text-white">
                <span>Total</span>
                <span className="text-blue-400">Rp {new Intl.NumberFormat('id-ID').format(total)}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping on orders over Rp 500.000</span>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
