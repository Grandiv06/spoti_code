"use client";

import React from "react";
import { CircleDollarSign, Clock } from "lucide-react";

export default function InstructorEarningsPage() {
  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500 text-right" dir="rtl">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                <CircleDollarSign className="w-8 h-8" />
              </div>
            </div>

            <div className="text-center md:text-right">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">گزارش درآمد مدرس</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                مشاهده آمار درآمد حاصل از فروش دوره‌ها، تراکنش‌ها و عملکرد مالی مدرس
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] px-6 py-16 md:py-24 text-center shadow-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Clock className="h-10 w-10" />
        </div>
        <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">بزودی اضافه می‌شود</h2>
        <p className="mx-auto mt-3 max-w-md text-xs md:text-sm font-bold leading-7 text-gray-500 dark:text-gray-400">
          بخش گزارش درآمد، تراکنش‌ها و تسویه‌حساب مدرس در حال توسعه است و به‌زودی در دسترس قرار می‌گیرد.
        </p>
      </div>
    </div>
  );
}
