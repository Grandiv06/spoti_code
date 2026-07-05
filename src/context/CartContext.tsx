"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { formatCartPrice, parseCartPrice } from "@/lib/cart-price";

export type Course = {
  id: string;
  title: string;
  price: string;
  image: string;
  instructor: string;
};

interface CartContextType {
  cart: Course[];
  isCartOpen: boolean;
  addToCart: (course: Course) => boolean;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  isInCart: (courseId: string) => boolean;
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

  const addToCart = useCallback((course: Course) => {
    let added = false;
    setCart((prevCart) => {
      if (prevCart.some((item) => item.id === course.id)) {
        return prevCart;
      }
      added = true;
      return [
        ...prevCart,
        {
          ...course,
          price: formatCartPrice(course.price),
        },
      ];
    });
    if (added) {
      setIsCartOpen(true);
    }
    return added;
  }, []);

  const removeFromCart = useCallback((courseId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== courseId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const setCartOpen = useCallback((open: boolean) => {
    setIsCartOpen(open);
  }, []);

  const isInCart = useCallback(
    (courseId: string) => cart.some((item) => item.id === courseId),
    [cart]
  );

  const getTotalPrice = useCallback(
    () => cart.reduce((total, item) => total + parseCartPrice(item.price), 0),
    [cart]
  );

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
        isInCart,
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
