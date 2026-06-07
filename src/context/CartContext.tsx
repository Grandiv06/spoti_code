"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Course = {
  id: string;
  title: string;
  price: string; // Stored as string like "4,500,000"
  image: string;
  instructor: string;
};

interface CartContextType {
  cart: Course[];
  isCartOpen: boolean;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Course[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("spoticode-cart");
    if (!savedCart) return;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(JSON.parse(savedCart) as Course[]);
    } catch {
      // Ignore malformed persisted cart data.
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("spoticode-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (course: Course) => {
    setCart((prevCart) => {
      // Check if course is already in cart to avoid duplicates
      if (prevCart.some((item) => item.id === course.id)) {
        return prevCart;
      }
      return [...prevCart, course];
    });
    setIsCartOpen(true); // Auto open cart when adding
  };

  const removeFromCart = (courseId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== courseId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const setCartOpen = (open: boolean) => {
    setIsCartOpen(open);
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => {
      const price = Number(item.price.replace(/,/g, ""));
      return total + (Number.isFinite(price) ? price : 0);
    }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        toggleCart,
        setCartOpen,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
