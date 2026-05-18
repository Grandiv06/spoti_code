"use client";

import React, { useState, useMemo } from "react";
import {
  CircleDollarSign,
  TrendingUp,
  CreditCard,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown
} from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";

export default function InstructorEarningsPage() {
  const { courses, transactions, payouts, requestPayout } = useInstructorData();

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [shabaNumber, setShabaNumber] = useState("IR120120000000012345678901");

  // Computations
  const stats = useMemo(() => {
    // Total course revenue
    const totalRev = courses.reduce((sum, c) => sum + c.revenue, 0);
    // Net instructor share (70%)
    const totalInstructorShare = Math.round(totalRev * 0.7);
    
    // Total paid out so far
    const totalPaidOut = payouts
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
      
    // Total pending payouts
    const totalPending = payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    // Withdrawable Balance = Net Share - Paid Out - Pending
    const withdrawable = Math.max(0, totalInstructorShare - totalPaidOut - totalPending);

    // Sales this month
    const thisMonthSales = transactions.length;
    const thisMonthRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const thisMonthInstructorShare = Math.round(thisMonthRevenue * 0.7);

    // Find top selling course
    let topCourse = "ثبت نشده";
    if (courses.length > 0) {
      const sorted = [...courses].sort((a, b) => b.revenue - a.revenue);
      topCourse = sorted[0].title;
    }

    return {
      totalRev,
      totalInstructorShare,
      totalPaidOut,
      totalPending,
      withdrawable,
      thisMonthSales,
      thisMonthRevenue,
      thisMonthInstructorShare,
      topCourse,
    };
  }, [courses, payouts, transactions]);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      alert("لطفاً مبلغ معتبری وارد کنید.");
      return;
    }
    if (amount > stats.withdrawable) {
      alert("مبلغ درخواستی بیشتر از موجودی قابل برداشت شماست.");
      return;
    }
    if (!shabaNumber.startsWith("IR") || shabaNumber.length !== 26) {
      alert("شماره شبا وارد شده نامعتبر است. شبا باید ۲۶ کاراکتر داشته و با IR شروع شود.");
      return;
    }

    const success = requestPayout(amount, shabaNumber);
    if (success) {
      setWithdrawAmount("");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* 1. Header Banner */}
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
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">درآمد و فروش مدرس</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                مشاهده آمار درآمد حاصل از فروش دوره‌ها، تاریخچه تراکنش‌ها و ثبت درخواست تسویه حساب
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* Total net earnings */}
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">درآمد کل مدرس (سهم ۷۰٪)</span>
          <p className="text-lg md:text-xl font-black text-emerald-500 mb-1">{stats.totalInstructorShare.toLocaleString("fa-IR")} تومان</p>
          <span className="text-[8px] text-gray-400 font-bold">از کل ناخالص {stats.totalRev.toLocaleString("fa-IR")} تومان</span>
        </div>

        {/* Monthly share */}
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">درآمد این ماه (سهم ۷۰٪)</span>
          <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-1">{stats.thisMonthInstructorShare.toLocaleString("fa-IR")} تومان</p>
          <span className="text-[8px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>تعداد {stats.thisMonthSales.toLocaleString("fa-IR")} فروش</span>
          </span>
        </div>

        {/* Withdrawable */}
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">موجودی قابل برداشت</span>
          <p className="text-lg md:text-xl font-black text-primary mb-1">{stats.withdrawable.toLocaleString("fa-IR")} تومان</p>
          <span className="text-[8px] text-gray-400 font-bold">بدون احتساب درخواست‌های در جریان</span>
        </div>

        {/* Top Course */}
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">پرفروش‌ترین دوره آموزشی</span>
          <p className="text-[11px] font-black text-gray-900 dark:text-white mb-1 leading-relaxed truncate">{stats.topCourse}</p>
          <span className="text-[8px] text-gray-400 font-bold">بیشترین سهم از سبد درآمدی</span>
        </div>

      </div>

      {/* 3. Withdraw payout & Requests history split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left: Request Payout Card */}
        <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
          <h3 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3 mb-6">درخواست تسویه حساب جدید</h3>
          
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            
            {/* Withdrawable info display */}
            <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl flex justify-between items-center text-xs font-bold">
              <span className="text-gray-500">موجودی در دسترس:</span>
              <span className="text-primary font-black">{stats.withdrawable.toLocaleString("fa-IR")} تومان</span>
            </div>

            {/* Amount input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">مبلغ درخواستی (تومان)</label>
              <input
                type="number"
                required
                placeholder="مثال: ۵۰۰۰۰۰۰"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Bank Shaba */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">شماره شبا حساب بانکی</label>
              <input
                type="text"
                required
                placeholder="IR120120000000012345678901"
                value={shabaNumber}
                onChange={(e) => setShabaNumber(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={stats.withdrawable === 0}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
            >
              ثبت درخواست تسویه حساب
            </button>

          </form>
        </div>

        {/* Right: Payout requests history list (Col-Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
          <h3 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3 mb-6">سوابق درخواست‌های تسویه</h3>

          {payouts.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-xs font-bold text-gray-400">هنوز هیچ درخواست تسویه‌ای ثبت نکرده‌اید.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      p.status === "paid" ? "bg-emerald-500/10 text-emerald-500" :
                      p.status === "pending" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-900 dark:text-white">{p.amount.toLocaleString("fa-IR")} تومان</p>
                      <p className="text-[8px] text-gray-400 font-bold mt-0.5">درخواست: {p.requestDate} • شبا: {p.shaba.slice(0, 10)}...</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {p.status === "paid" && (
                      <div className="text-right">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">واریز شده</span>
                        <span className="text-[8px] text-gray-400 font-bold block mt-0.5">تاریخ: {p.payDate}</span>
                      </div>
                    )}
                    {p.status === "pending" && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">در حال بررسی</span>
                    )}
                    {p.status === "rejected" && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-red-500/10 text-red-500">رد شده</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 4. Sales Transactions Audit log table */}
      <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white">تراکنش‌های اخیر و فروش‌ها</h3>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">جزئیات خریدهای انجام شده توسط دانشجویان در دوره‌های شما</p>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs font-bold text-gray-400">تراکنشی یافت نشد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px] font-bold">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 text-right">
                  <th className="py-3 px-4 font-black">کد تراکنش</th>
                  <th className="py-3 px-4 font-black">عنوان دوره</th>
                  <th className="py-3 px-4 font-black">دانشجو</th>
                  <th className="py-3 px-4 font-black text-left">مبلغ کل</th>
                  <th className="py-3 px-4 text-left font-black text-primary">سهم مدرس (۷۰٪)</th>
                  <th className="py-3 px-4 font-black">تاریخ ثبت</th>
                  <th className="py-3 px-4 font-black">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {transactions.map((t) => (
                  <tr key={t.id} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/5">
                    <td className="py-3 px-4 font-black">{t.id}</td>
                    <td className="py-3 px-4 font-black">{t.courseTitle}</td>
                    <td className="py-3 px-4 font-bold">{t.studentName}</td>
                    <td className="py-3 px-4 text-left font-black">{t.amount.toLocaleString("fa-IR")} تومان</td>
                    <td className="py-3 px-4 text-left font-black text-primary">{t.instructorShare.toLocaleString("fa-IR")} تومان</td>
                    <td className="py-3 px-4 font-semibold">{t.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[8px] bg-emerald-500/10 text-emerald-400">
                        موفق
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
