'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fitcheck_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('fitcheck_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('fitcheck_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100]"
        >
          <div className="bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Cookie className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg tracking-tighter">Cookie Policy</h3>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    We use cookies to enhance your experience, analyze site traffic, and serve personalized content. By clicking "Accept", you agree to our use of cookies.
                    <Link href="/privacy" className="text-blue-400 hover:underline ml-1">Learn more</Link>
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={handleAccept}
                        className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                    >
                        Accept All
                    </button>
                    <button 
                        onClick={handleDecline}
                        className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm text-gray-400"
                    >
                        Decline
                    </button>
                </div>
            </div>

            <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
