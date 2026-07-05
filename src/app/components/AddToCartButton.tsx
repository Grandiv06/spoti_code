"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type CourseOrderPayload = {
  id: string;
  title: string;
  price: string;
  image: string;
  instructor: string;
};

export default function AddToCartButton({ course }: { course: CourseOrderPayload }) {
  const router = useRouter();
  const { addToCart, isInCart, setCartOpen } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inCart = isInCart(course.id);

  useEffect(() => {
    if (!justAdded) return;
    const timeoutId = window.setTimeout(() => setJustAdded(false), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [justAdded]);

  const handleAddToCart = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const added = addToCart({
        id: course.id,
        title: course.title,
        price: course.price,
        image: course.image || "/images/course1.jpg",
        instructor: course.instructor,
      });

      if (added) {
        setJustAdded(true);
        setCartOpen(true);
        return;
      }

      setCartOpen(true);
    } catch {
      setErrorMessage("افزودن به سبد خرید انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  if (inCart) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center">
          <p className="text-sm font-black text-emerald-600 dark:text-emerald-300">
            {justAdded ? "دوره به سبد خرید اضافه شد" : "این دوره در سبد خرید شماست"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="w-full cursor-pointer rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-black text-gray-800 transition-all hover:border-primary/30 hover:bg-primary/5 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
          >
            مشاهده سبد خرید
          </button>
          <button
            type="button"
            onClick={handleCheckout}
            className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-primary to-emerald-400 px-4 py-4 text-sm font-black text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] transition-all hover:-translate-y-0.5"
          >
            تکمیل خرید
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isSubmitting}
        className={`group/btn relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/20 py-4 text-base font-black text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all md:gap-3 md:rounded-[2rem] md:py-6 md:text-xl ${
          isSubmitting
            ? "cursor-wait bg-gray-500"
            : "bg-gradient-to-r from-primary to-emerald-400 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] active:scale-95"
        }`}
      >
        <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover/btn:translate-y-0" />
        <span className="material-symbols-outlined relative z-10 text-2xl md:text-[28px]">
          {isSubmitting ? "hourglass_top" : "local_mall"}
        </span>
        <span className="relative z-10">
          {isSubmitting ? "در حال افزودن..." : "ثبت‌نام در دوره"}
        </span>
      </button>

      {errorMessage ? (
        <p className="text-center text-xs font-bold text-red-500 md:text-sm">{errorMessage}</p>
      ) : null}
    </div>
  );
}
