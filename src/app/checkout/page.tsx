"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiPostNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";
import { formatCartPriceLabel } from "@/lib/cart-price";

type DiscountPreview = {
  subtotal: number;
  discountAmount: number;
  total: number;
  applied: {
    code: string;
    title: string;
    applyType: "user" | "admin" | "both";
    discountAmount: number;
  } | null;
};

function CheckoutItemImage({ src, alt }: { src: string; alt: string }) {
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

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { cart, removeFromCart, clearCart, getTotalPrice, setCartOpen } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [preview, setPreview] = useState<DiscountPreview | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successTrackingCode, setSuccessTrackingCode] = useState<string | null>(null);

  const isStaff = user?.role === "admin" || user?.role === "instructor";
  const courseIds = useMemo(() => cart.map((item) => item.id), [cart]);
  const subtotal = appliedCode ? (preview?.subtotal ?? getTotalPrice()) : getTotalPrice();
  const discountAmount = appliedCode ? (preview?.discountAmount ?? 0) : 0;
  const total = appliedCode ? (preview?.total ?? subtotal) : subtotal;

  const loadPreview = useCallback(
    async (manualCode: string) => {
      if (courseIds.length === 0) return;

      setIsPreviewLoading(true);
      try {
        const response = await apiPostNoMock<{ data?: DiscountPreview }>(
          "/api/discounts/preview",
          {
            courseIds,
            discountCode: manualCode,
          },
          isAuthenticated ? getAuthHeaders() : undefined
        );
        setPreview(response?.data ?? null);
      } catch {
        setPreview(null);
      } finally {
        setIsPreviewLoading(false);
      }
    },
    [courseIds, isAuthenticated]
  );

  useEffect(() => {
    setCartOpen(false);
  }, [setCartOpen]);

  const formatted = useMemo(
    () => ({
      subtotal: formatCartPriceLabel(subtotal),
      discountAmount: formatCartPriceLabel(discountAmount),
      total: formatCartPriceLabel(total),
    }),
    [subtotal, discountAmount, total]
  );

  const handleApplyDiscount = async () => {
    const normalized = discountCode.trim().toUpperCase();
    if (!normalized) {
      setAppliedCode(null);
      setPreview(null);
      setDiscountError(null);
      return;
    }

    setDiscountError(null);
    try {
      const response = await apiPostNoMock<{ data?: DiscountPreview; message?: string }>(
        "/api/discounts/preview",
        {
          courseIds,
          discountCode: normalized,
        },
        isAuthenticated ? getAuthHeaders() : undefined
      );

      const nextPreview = response?.data;
      if (!nextPreview?.applied || nextPreview.discountAmount <= 0) {
        setAppliedCode(null);
        setPreview(nextPreview ?? null);
        setDiscountError("کد تخفیف معتبر نیست");
        return;
      }

      setAppliedCode(normalized);
      setPreview(nextPreview);
      setDiscountError(null);
    } catch (error) {
      setAppliedCode(null);
      setPreview(null);
      setDiscountError(error instanceof Error ? error.message : "کد تخفیف معتبر نیست");
    }
  };

  const handleCompletePurchase = async () => {
    if (isSubmitting || cart.length === 0) return;

    if (!isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent("/checkout")}`);
      return;
    }

    if (isStaff) {
      setSubmitError("مدرس و ادمین امکان خرید دوره برای خود ندارند.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await apiPostNoMock<{
        data?: { trackingCode?: string };
      }>(
        "/api/dashboard/checkout",
        {
          courseIds: cart.map((item) => item.id),
          discountCode: appliedCode,
        },
        getAuthHeaders()
      );

      const trackingCode = response?.data?.trackingCode ?? null;
      clearCart();
      setSuccessTrackingCode(trackingCode);
    } catch (error) {
      const message = error instanceof Error ? error.message : "تکمیل خرید انجام نشد";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successTrackingCode) {
    return (
      <div dir="rtl" className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
        <div className="mesh-bg" />
        <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16 md:px-8">
          <div className="w-full rounded-[2rem] border border-emerald-500/20 bg-white/85 p-8 text-center shadow-learning-card-light backdrop-blur-xl dark:border-emerald-500/15 dark:bg-white/[0.04] md:p-10">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-[1.35rem] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="material-symbols-outlined filled text-4xl">check_circle</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">خرید با موفقیت انجام شد</h1>
            <p className="mt-3 text-sm font-medium leading-7 text-gray-600 dark:text-gray-300">
              ثبت‌نام شما انجام شد و دوره‌ها به پنل کاربری اضافه شدند.
            </p>
            {successTrackingCode ? (
              <p className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 dark:bg-white/[0.03] dark:text-gray-200">
                کد پیگیری: <span className="font-mono">{successTrackingCode}</span>
              </p>
            ) : null}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/panel/courses"
                className="rounded-2xl bg-primary px-5 py-4 text-sm font-black text-white transition hover:opacity-90"
              >
                مشاهده دوره‌های من
              </Link>
              <Link
                href="/panel/transactions"
                className="rounded-2xl border border-gray-200 px-5 py-4 text-sm font-black text-gray-700 transition hover:border-primary/30 dark:border-white/10 dark:text-gray-200"
              >
                مشاهده تراکنش‌ها
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <div className="mesh-bg" />
      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-10 md:px-8 lg:grid-cols-12 lg:px-12">
        <section className="lg:col-span-8">
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-learning-card-light backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] md:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">تکمیل خرید</h1>
                <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  دوره‌های انتخاب‌شده را بررسی کنید و پرداخت را نهایی کنید.
                </p>
              </div>
              <Link
                href="/courses"
                className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
              >
                بازگشت به دوره‌ها
              </Link>
            </div>

            {!authLoading && isStaff ? (
              <div className="mb-6 rounded-[1.5rem] border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm font-bold text-amber-700 dark:text-amber-300">
                مدرس و ادمین امکان خرید دوره برای خود ندارند.
              </div>
            ) : null}

            {!authLoading && !isAuthenticated ? (
              <div className="mb-6 rounded-[1.5rem] border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm font-bold text-amber-700 dark:text-amber-300">
                برای تکمیل خرید باید وارد حساب کاربری شوید.
                <Link href={`/login?returnUrl=${encodeURIComponent("/checkout")}`} className="mr-2 text-primary underline">
                  ورود به حساب
                </Link>
              </div>
            ) : null}

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
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-gray-200/80 bg-white p-4 transition-all hover:border-primary/20 dark:border-white/10 dark:bg-white/[0.03] md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
                        <CheckoutItemImage src={item.image} alt={item.title} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-gray-900 dark:text-white">{item.title}</p>
                        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{item.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:justify-end">
                      <span className="text-lg font-black text-primary">
                        {formatCartPriceLabel(item.price)} تومان
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="cursor-pointer rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10"
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
                    className="cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white transition hover:opacity-90"
                  >
                    اعمال
                  </button>
                </div>
                {appliedCode ? (
                  <p className="mt-2 text-xs font-bold text-emerald-500">کد {appliedCode} با موفقیت اعمال شد.</p>
                ) : null}
                {isPreviewLoading ? (
                  <p className="mt-2 text-xs font-bold text-gray-400">در حال محاسبه تخفیف...</p>
                ) : null}
                {discountError ? (
                  <p className="mt-2 text-xs font-bold text-red-500">{discountError}</p>
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
                disabled={cart.length === 0 || isSubmitting || authLoading || isStaff}
                className="w-full cursor-pointer rounded-2xl bg-primary px-5 py-4 text-base font-black text-white shadow-[0_0_24px_rgba(34,197,94,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(34,197,94,0.35)] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? "در حال پردازش..." : "پرداخت و تکمیل خرید"}
              </button>

              {submitError ? (
                <p className="text-center text-xs font-bold text-red-500">{submitError}</p>
              ) : null}

              <p className="text-center text-xs font-bold text-gray-500 dark:text-gray-400">
                پس از پرداخت، دوره‌ها در پنل کاربری و تراکنش‌ها در بخش مالی ثبت می‌شوند.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
