"use client";

import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { useEffect, useRef } from "react";

export default function CartSidebar() {
  const { cart, isCartOpen, removeFromCart, toggleCart } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isCartOpen
      ) {
        toggleCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, toggleCart]);

  // Convert price string to number for calculation
  const totalPrice = cart.reduce((total, item) => {
    const price = parseInt(item.price.replace(/,/g, ""));
    return total + price;
  }, 0);

  const formattedTotalPrice = totalPrice.toLocaleString();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-full sm:w-[400px] bg-white/10 dark:bg-[#14161c]/30 backdrop-blur-xl border-r border-white/20 dark:border-white/10 shadow-2xl z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
          isCartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined filled text-primary">
              shopping_cart
            </span>
            سبد خرید
          </h2>
          <button
            onClick={toggleCart}
            className="size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">
                production_quantity_limits
              </span>
              <p className="text-lg font-bold">سبد خرید شما خالی است</p>
              <button
                onClick={toggleCart}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all"
              >
                مشاهده دوره‌ها
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/40 dark:bg-white/5 rounded-2xl p-3 border border-white/20 dark:border-white/5 flex gap-4 transition-all hover:bg-white/60 dark:hover:bg-white/10"
              >
                <div className="relative size-20 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {item.instructor}
                    </span>
                    <span className="flex items-center gap-1 font-black text-primary text-sm">
                      {item.price}
                      <span className="text-[10px] opacity-80 font-bold">
                        تومان
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-white/5 dark:bg-black/20">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-500 dark:text-gray-400 font-bold">
                مبلغ قابل پرداخت
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  {formattedTotalPrice}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  تومان
                </span>
              </div>
            </div>
            <button className="w-full py-4 bg-primary text-white text-lg font-black rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
              تکمیل خرید
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
