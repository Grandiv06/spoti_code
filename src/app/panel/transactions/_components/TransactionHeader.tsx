"use client";

import { Wallet } from "lucide-react";

export default function TransactionHeader() {
  return (
    <section className="rounded-3xl border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26]/80 sm:p-6 lg:p-7">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Wallet className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
            امور مالی
          </p>
          <h1 className="text-xl font-black leading-tight text-gray-900 dark:text-white sm:text-2xl">
            تراکنش‌های من
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            تاریخچه پرداخت‌ها، خرید دوره‌ها و وضعیت تراکنش‌های شما
          </p>
        </div>
      </div>
    </section>
  );
}
