"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { downloadTransactionReceipt } from "@/lib/transaction-receipt";
import type { Transaction } from "@/app/panel/transactions/data";

type PaymentDetails = {
  id: string;
  orderId: string;
  trackId: string | null;
  status: string;
  amount: number;
  refNumber: string | null;
  cardNumber: string | null;
  description: string | null;
  paidAt: string | null;
  createdAt: string;
  orders: {
    id: string;
    productTitle: string | null;
    amount: number;
    trackingCode: string | null;
    status: string;
  }[];
};

function CheckoutResultContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const statusParam = searchParams.get("status") || "pending";
  const trackIdParam = searchParams.get("trackId") || "";
  const refNumberParam = searchParams.get("refNumber") || "";
  const orderIdParam = searchParams.get("orderId") || "";
  const amountParam = searchParams.get("amount") || "";
  const messageParam = searchParams.get("message") || "";

  const isSuccess = statusParam === "success";
  const isCanceled = statusParam === "canceled";

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // پاک کردن سبد خرید در صورت موفقیت‌آمیز بودن پرداخت
  useEffect(() => {
    if (isSuccess) {
      clearCart();
    }
  }, [isSuccess, clearCart]);

  // دریافت اطلاعات تکمیلی تراکنش از سرور
  useEffect(() => {
    if (!trackIdParam && !orderIdParam) return;

    let isMounted = true;
    setIsLoadingDetails(true);

    fetch(`/api/payment/status?trackId=${encodeURIComponent(trackIdParam || orderIdParam)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json?.data) {
          setPaymentDetails(json.data);
        }
      })
      .catch(() => {
        // نادیده گرفتن خطا
      })
      .finally(() => {
        if (isMounted) setIsLoadingDetails(false);
      });

    return () => {
      isMounted = false;
    };
  }, [trackIdParam, orderIdParam]);

  const displayAmount = paymentDetails?.amount
    ? paymentDetails.amount
    : amountParam && Number(amountParam) > 0
      ? Number(amountParam)
      : null;

  const displayRefNumber = paymentDetails?.refNumber || refNumberParam || "---";
  const displayTrackId = paymentDetails?.trackId || trackIdParam || "---";
  const displayCardNumber = paymentDetails?.cardNumber || null;

  const handleDownloadReceipt = async () => {
    const trxData: Transaction = {
      id: paymentDetails?.id || orderIdParam || displayTrackId,
      type: "payment",
      description: paymentDetails?.description || "خرید دوره در اسپاتی‌کد",
      amount: displayAmount || 0,
      status: isSuccess ? "success" : "failed",
      date: new Date().toLocaleDateString("fa-IR"),
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      paymentMethod: "درگاه پرداخت زیبال",
      trackingCode: displayRefNumber !== "---" ? displayRefNumber : displayTrackId,
      productTitle: paymentDetails?.orders?.map((o) => o.productTitle).filter(Boolean).join("، ") || "خرید دوره",
    };

    await downloadTransactionReceipt(trxData);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <div className="mesh-bg" />

      <main className="mx-auto flex min-h-[85vh] max-w-2xl items-center px-4 py-16 md:px-8">
        <div className="w-full rounded-[2.5rem] border border-white/60 bg-white/85 p-6 text-center shadow-learning-card-light backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] md:p-10">
          {/* آیکون وضعیت */}
          {isSuccess ? (
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.75rem] bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5 dark:bg-emerald-500/15">
              <span className="material-symbols-outlined filled text-5xl">check_circle</span>
            </div>
          ) : (
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[1.75rem] bg-red-500/10 text-red-500 ring-8 ring-red-500/5 dark:bg-red-500/15">
              <span className="material-symbols-outlined filled text-5xl">
                {isCanceled ? "cancel" : "error"}
              </span>
            </div>
          )}

          {/* تیتر */}
          <h1 className="text-2xl font-black text-gray-900 dark:text-white md:text-3xl">
            {isSuccess
              ? "پرداخت شما با موفقیت انجام شد"
              : isCanceled
                ? "پرداخت توسط شما لغو شد"
                : "پرداخت ناموفق بود"}
          </h1>

          <p className="mt-3 text-sm font-medium leading-7 text-gray-600 dark:text-gray-300">
            {isSuccess
              ? "ثبت‌نام شما نهایی گردید و دوره‌های خریداری‌شده به حساب کاربری شما اضافه شدند."
              : messageParam || "متاسفانه پرداخت انجام نشد یا ارتباط با درگاه بانکی برقرار نگردید."}
          </p>

          {/* باکس جزئیات فاکتور و تراکنش */}
          <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-200/80 bg-gray-50/70 p-5 text-sm dark:divide-white/5 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between py-2.5">
              <span className="font-bold text-gray-500 dark:text-gray-400">درگاه پرداخت</span>
              <span className="font-black text-gray-900 dark:text-white">زیبال (Zibal IPG)</span>
            </div>

            {displayAmount != null ? (
              <div className="flex items-center justify-between py-2.5">
                <span className="font-bold text-gray-500 dark:text-gray-400">مبلغ پرداختی</span>
                <span className="font-black text-primary">
                  {displayAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            ) : null}

            {displayRefNumber !== "---" ? (
              <div className="flex items-center justify-between py-2.5">
                <span className="font-bold text-gray-500 dark:text-gray-400">شماره مرجع بانکی (Ref)</span>
                <span className="font-mono font-black text-gray-800 dark:text-gray-200">
                  {displayRefNumber}
                </span>
              </div>
            ) : null}

            {displayTrackId !== "---" ? (
              <div className="flex items-center justify-between py-2.5">
                <span className="font-bold text-gray-500 dark:text-gray-400">شناسه پیگیری زیبال (Track ID)</span>
                <span className="font-mono font-black text-gray-800 dark:text-gray-200">
                  {displayTrackId}
                </span>
              </div>
            ) : null}

            {displayCardNumber ? (
              <div className="flex items-center justify-between py-2.5">
                <span className="font-bold text-gray-500 dark:text-gray-400">شماره کارت</span>
                <span className="font-mono font-black text-gray-800 dark:text-gray-200" dir="ltr">
                  {displayCardNumber}
                </span>
              </div>
            ) : null}

            {paymentDetails?.orders && paymentDetails.orders.length > 0 ? (
              <div className="py-2.5 text-right">
                <span className="block mb-2 font-bold text-gray-500 dark:text-gray-400">دوره‌های خریداری‌شده:</span>
                <div className="space-y-1">
                  {paymentDetails.orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                      <span>• {o.productTitle}</span>
                      <span>{o.amount.toLocaleString("fa-IR")} تومان</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* دکمه‌های اقدام */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isSuccess ? (
              <>
                <Link
                  href="/panel/courses"
                  className="flex-1 rounded-2xl bg-primary px-5 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
                >
                  مشاهده دوره‌های من
                </Link>
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="flex-1 rounded-2xl border border-gray-200 px-5 py-4 text-sm font-black text-gray-700 transition hover:border-primary/40 dark:border-white/10 dark:text-gray-200"
                >
                  دانلود رسید پرداخت
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/checkout"
                  className="flex-1 rounded-2xl bg-primary px-5 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
                >
                  بازگشت به سبد خرید و تلاش مجدد
                </Link>
                <Link
                  href="/panel/support"
                  className="flex-1 rounded-2xl border border-gray-200 px-5 py-4 text-sm font-black text-gray-700 transition hover:border-primary/40 dark:border-white/10 dark:text-gray-200"
                >
                  ارتباط با پشتیبانی
                </Link>
              </>
            )}
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-xs font-bold text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" dir="rtl">
          <p className="text-base font-bold text-gray-500">در حال دریافت وضعیت پرداخت...</p>
        </div>
      }
    >
      <CheckoutResultContent />
    </Suspense>
  );
}
