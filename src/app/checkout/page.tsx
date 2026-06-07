"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const DISCOUNT_CODES: Record<string, number> = {
  SPOTI10: 0.1,
  NEWUSER15: 0.15,
  WELCOME20: 0.2,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, getTotalPrice, setCartOpen } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const discountRate = appliedCode ? DISCOUNT_CODES[appliedCode] ?? 0 : 0;

  const subtotal = getTotalPrice();
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount;

  useEffect(() => {
    setCartOpen(false);
  }, [setCartOpen]);

  const formatted = useMemo(
    () => ({
      subtotal: subtotal.toLocaleString("fa-IR"),
      discountAmount: discountAmount.toLocaleString("fa-IR"),
      total: total.toLocaleString("fa-IR"),
    }),
    [subtotal, discountAmount, total]
  );

  const handleApplyDiscount = () => {
    const normalized = discountCode.trim().toUpperCase();
    if (normalized && DISCOUNT_CODES[normalized]) {
      setAppliedCode(normalized);
      return;
    }
    setAppliedCode(null);
  };

  const handleCompletePurchase = () => {
    clearCart();
    router.push("/panel/transactions");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="mesh-bg" />
      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-10 md:px-8 lg:grid-cols-12 lg:px-12">
        <section className="lg:col-span-8">
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-learning-card-light backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] md:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">تکمیل خرید</h1>
                <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  دوره‌های انتخاب‌شده را بررسی کنید و کد تخفیف را اعمال کنید.
                </p>
              </div>
              <Link href="/courses" className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20">
                بازگشت به دوره‌ها
              </Link>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-white/60 p-10 text-center dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-lg font-black text-gray-900 dark:text-white">سبد خرید خالی است</p>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  ابتدا یک دوره را به سبد اضافه کنید و سپس به این صفحه برگردید.
                </p>
                <Link href="/courses" className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white">
                  مشاهده دوره‌ها
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-gray-200/80 bg-white p-4 transition-all hover:border-primary/20 dark:border-white/10 dark:bg-white/[0.03] md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative size-20 overflow-hidden rounded-2xl shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-gray-900 dark:text-white">{item.title}</p>
                        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{item.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:justify-end">
                      <span className="text-lg font-black text-primary">{Number(item.price).toLocaleString("fa-IR")} تومان</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-100 cursor-pointer dark:border-red-500/20 dark:bg-red-500/10"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-[2rem] border border-white/60 bg-white/85 p-5 shadow-learning-card-light backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] md:p-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">خلاصه سفارش</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/[0.03]">
                <label className="mb-2 block text-xs font-bold text-gray-500 dark:text-gray-400">کد تخفیف</label>
                <div className="flex gap-2">
                  <input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="SPOTI10"
                    className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-primary dark:border-white/10 dark:bg-[#1a1c23]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white transition hover:opacity-90 cursor-pointer"
                  >
                    اعمال
                  </button>
                </div>
                {appliedCode ? (
                  <p className="mt-2 text-xs font-bold text-emerald-500">
                    کد {appliedCode} با موفقیت اعمال شد.
                  </p>
                ) : null}
              </div>

              <div className="space-y-3 rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between text-sm font-bold text-gray-500 dark:text-gray-400">
                  <span>جمع جزء</span>
                  <span>{formatted.subtotal} تومان</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-gray-500 dark:text-gray-400">
                  <span>تخفیف</span>
                  <span>- {formatted.discountAmount} تومان</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200/80 pt-3 text-lg font-black text-gray-900 dark:border-white/10 dark:text-white">
                  <span>مبلغ نهایی</span>
                  <span>{formatted.total} تومان</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompletePurchase}
                disabled={cart.length === 0}
                className="w-full rounded-2xl bg-primary px-5 py-4 text-base font-black text-white shadow-[0_0_24px_rgba(34,197,94,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(34,197,94,0.35)] cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                تکمیل خرید
              </button>

              <p className="text-center text-xs font-bold text-gray-500 dark:text-gray-400">
                با تکمیل خرید، سفارش به بخش تراکنش‌ها منتقل می‌شود.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
