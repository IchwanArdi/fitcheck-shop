'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fitcheck_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('fitcheck_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = 'M') => {
    // Basic safety check
    if (typeof toast !== 'undefined') {
      toast.success(`${product.name} added to cart`, {
        description: `Size: ${size} • Rp ${new Intl.NumberFormat('id-ID').format(product.price)}`,
      });
    } else {
      console.error("Toast is undefined in CartContext");
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id && item.size === size);
      
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, change) => {
    setCartItems((prev) => prev.map((item) => {
        if (item.id === id && item.size === size) {
            const newQuantity = Math.max(1, item.quantity + change);
            return { ...item, quantity: newQuantity };
        }
        return item;
    }));
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, addToCart, removeFromCart, updateQuantity, toggleCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
