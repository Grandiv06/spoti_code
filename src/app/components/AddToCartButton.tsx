"use client";

import { useCart, Course } from "../../context/CartContext";

export default function AddToCartButton({ course }: { course: Course }) {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some((item) => item.id === course.id);

  return (
    <button
      onClick={() => addToCart(course)}
      disabled={isInCart}
      className={`w-full text-white text-xl font-black py-6 rounded-[2rem] shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-3 group/btn border border-white/20 relative overflow-hidden ${
        isInCart
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-primary to-emerald-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:-translate-y-1 active:scale-95 cursor-pointer"
      }`}
    >
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
      <span className="material-symbols-outlined text-[28px] relative z-10">
        {isInCart ? "check_circle" : "local_mall"}
      </span>
      <span className="relative z-10">
        {isInCart ? "در سبد خرید موجود است" : "ثبت‌نام در دوره"}
      </span>
    </button>
  );
}
