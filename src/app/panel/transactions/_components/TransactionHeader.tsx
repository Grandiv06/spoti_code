"use client";

import React from "react";
import { Wallet, History, TrendingUp } from "lucide-react";

export default function TransactionHeader() {
  return (
    <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none mb-8">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 px-8 py-12 md:px-16 flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">تراکنش‌های من</h1>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
            تاریخچه کامل پرداخت‌ها، خرید دوره‌ها و وضعیت تمدید اشتراک‌های شما
          </p>
        </div>
      </div>
    </div>
  );
}
