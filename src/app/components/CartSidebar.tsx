"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { formatCartPriceLabel, isFreeCoursePrice } from "@/lib/cart-price";
import { useEffect, useRef } from "react";

function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const imageSrc = src || "/images/course1.jpg";
  const useNativeImage = imageSrc.startsWith("data:") || imageSrc.startsWith("blob:");

  if (useNativeImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageSrc} alt={alt} className="size-full object-cover" />
    );
  }

  return <Image src={imageSrc} alt={alt} fill className="object-cover" unoptimized />;
}

export default function CartSidebar() {
  const { cart, isCartOpen, removeFromCart, toggleCart, setCartOpen } = useCart();
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

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

  const totalPrice = cart.reduce((total, item) => total + Number(item.price || 0), 0);
  const formattedTotalPrice = formatCartPriceLabel(totalPrice);

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-[70] flex w-full transform flex-col border-r border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] dark:border-white/10 dark:bg-[#14161c]/30 sm:w-[400px] ${
          isCartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-white">
            <span className="material-symbols-outlined filled text-primary">shopping_cart</span>
            سبد خرید
          </h2>
          <button
            type="button"
            onClick={toggleCart}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/5 text-gray-500 transition-colors hover:bg-white/10 hover:text-red-500 dark:text-gray-400"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined mb-4 text-6xl opacity-50">
                production_quantity_limits
              </span>
              <p className="text-lg font-bold">سبد خرید شما خالی است</p>
              <button
                type="button"
                onClick={toggleCart}
                className="mt-6 cursor-pointer rounded-xl bg-primary/10 px-6 py-2 font-bold text-primary transition-all hover:bg-primary hover:text-white"
              >
                مشاهده دوره‌ها
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="group relative flex gap-4 rounded-2xl border border-white/20 bg-white/40 p-3 transition-all hover:bg-white/60 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                  <CartItemImage src={item.image} alt={item.title} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {item.instructor}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-black text-primary">
                      {formatCartPriceLabel(item.price)}
                      {!isFreeCoursePrice(item.price) ? (
                        <span className="text-[10px] font-bold opacity-80">تومان</span>
                      ) : null}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 ? (
          <div className="border-t border-white/10 bg-white/5 p-6 dark:bg-black/20">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold text-gray-500 dark:text-gray-400">مبلغ قابل پرداخت</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  {formattedTotalPrice}
                </span>
                {!isFreeCoursePrice(totalPrice) ? (
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">تومان</span>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-black text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
            >
              تکمیل خرید
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
