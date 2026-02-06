"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Navbar({ categories = ['Shirts', 'Objects'] }) {
  const { toggleCart, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Failed to fetch suggestions", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false); 
      setIsSearchOpen(false); 
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          
          {/* Left: Logo & Desktop Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tighter text-white mr-4">
              FITCHECK
            </Link>
            {/* Desktop Nav */}
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400 items-center">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              
              {/* Dynamic Collections Dropdown */}
              <div 
                className="relative group py-2"
                onMouseEnter={() => setIsCollectionsOpen(true)}
                onMouseLeave={() => setIsCollectionsOpen(false)}
              >
                <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                  Shop <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollectionsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full -left-4 pt-2 w-48 transition-all duration-300 ${
                  isCollectionsOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}>
                  <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2 backdrop-blur-xl">
                    <Link 
                      href="/category/all" 
                      onClick={() => setIsCollectionsOpen(false)}
                      className="block px-4 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                    >
                      All Products
                    </Link>
                    <div className="w-full h-px bg-white/5 my-1" />
                    {categories.map((cat) => (
                      <Link 
                        key={cat}
                        href={`/category/${cat.toLowerCase()}`}
                        onClick={() => setIsCollectionsOpen(false)}
                        className="block px-4 py-2.5 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/faq" className="hover:text-white transition-colors">Help</Link>
            </div>
          </div>

          {/* Center: Search (Hidden on Mobile) */}
          <div className="hidden md:block flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                placeholder="Search products..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all hover:bg-white/[0.08]"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                <div className="p-2">
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-black border border-white/5 overflow-hidden flex-shrink-0 relative">
                        <Image src={product.images?.[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
                        <ArrowRight className="w-3 h-3 text-gray-700 ml-auto mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
                <button 
                  onClick={handleSearch}
                  className="w-full p-3 bg-white/5 border-t border-white/5 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  See all results for "{searchQuery}"
                </button>
              </div>
            )}
          </div>

          {/* Right: Icons & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors"
                aria-label="Toggle Search"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={toggleCart}
              className="relative text-white p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Mobile Search Overlay */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5 ${
            isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
            <div className="p-4 bg-black">
                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        autoFocus={isSearchOpen}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </form>
            </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] bg-black transform transition-transform duration-500 ease-in-out md:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
          <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="text-xl font-bold text-white uppercase tracking-tighter">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex flex-col gap-6 p-8 text-2xl font-bold uppercase tracking-tighter overflow-y-auto">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-400 transition-colors">Home</Link>
            <div className="w-full h-px bg-white/5" />
            <Link href="/category/all" onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors">All Collection</Link>
            {categories.map((cat) => (
              <Link 
                key={cat}
                href={`/category/${cat.toLowerCase()}`} 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="mt-auto p-8 border-t border-white/10">
            <p className="text-sm text-gray-500 mb-4 uppercase tracking-widest">Connect with us</p>
            <div className="flex gap-4 text-sm font-medium">
               <span>Instagram</span>
               <span>Twitter</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
