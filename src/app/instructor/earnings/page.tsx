"use client";

import React, { useMemo } from "react";
import { CircleDollarSign, TrendingUp } from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";

export default function InstructorEarningsPage() {
  const { courses, transactions } = useInstructorData();

  const stats = useMemo(() => {
    const totalRev = courses.reduce((sum, c) => sum + c.revenue, 0);
    const totalInstructorShare = Math.round(totalRev * 0.7);

    const thisMonthSales = transactions.length;
    const thisMonthRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const thisMonthInstructorShare = Math.round(thisMonthRevenue * 0.7);

    const avgPerSale = thisMonthSales > 0 ? Math.round(totalInstructorShare / thisMonthSales) : 0;

    const courseSalesMap = new Map<string, { count: number; instructorRevenue: number }>();
    for (const t of transactions) {
      const entry = courseSalesMap.get(t.courseTitle) || { count: 0, instructorRevenue: 0 };
      entry.count += 1;
      entry.instructorRevenue += t.instructorShare;
      courseSalesMap.set(t.courseTitle, entry);
    }

    let topCourse = { title: "ثبت نشده", count: 0, instructorRevenue: 0 };
    for (const [title, data] of courseSalesMap.entries()) {
      if (data.count > topCourse.count) {
        topCourse = { title, count: data.count, instructorRevenue: data.instructorRevenue };
      }
    }

    const monthlyIncomeData = [
      { month: "دی", income: Math.round(totalInstructorShare * 0.14) },
      { month: "بهمن", income: Math.round(totalInstructorShare * 0.16) },
      { month: "اسفند", income: Math.round(totalInstructorShare * 0.15) },
      { month: "فروردین", income: Math.round(totalInstructorShare * 0.17) },
      { month: "اردیبهشت", income: Math.round(totalInstructorShare * 0.18) },
      { month: "خرداد", income: Math.round(totalInstructorShare * 0.2) },
    ];

    const maxMonthlyIncome = Math.max(...monthlyIncomeData.map((item) => item.income), 1);

    return {
      totalRev,
      totalInstructorShare,
      thisMonthSales,
      thisMonthInstructorShare,
      avgPerSale,
      topCourse,
      monthlyIncomeData,
      maxMonthlyIncome,
    };
  }, [courses, transactions]);

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">درآمد کل مدرس</span>
          <p className="text-lg md:text-xl font-black text-emerald-500 mb-1">{stats.totalInstructorShare.toLocaleString("fa-IR")} تومان</p>
          <span className="text-[8px] text-gray-400 font-bold">از کل فروش {stats.totalRev.toLocaleString("fa-IR")} تومان</span>
        </div>

        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">درآمد این ماه</span>
          <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-1">{stats.thisMonthInstructorShare.toLocaleString("fa-IR")} تومان</p>
          <span className="text-[8px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>تعداد {stats.thisMonthSales.toLocaleString("fa-IR")} فروش</span>
          </span>
        </div>

        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">درآمد ثبت‌شده</span>
          <p className="text-lg md:text-xl font-black text-primary mb-1">{stats.totalInstructorShare.toLocaleString("fa-IR")} تومان</p>
          <span className="text-[8px] text-gray-400 font-bold">مجموع سهم ثبت‌شده مدرس از فروش‌ها</span>
        </div>

        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">پرفروش‌ترین دوره</span>
          <p className="text-[11px] font-black text-gray-900 dark:text-white mb-1 leading-relaxed truncate">{stats.topCourse.title}</p>
          <span className="text-[8px] text-gray-400 font-bold">{stats.topCourse.count.toLocaleString("fa-IR")} فروش</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-sm font-black text-gray-900 dark:text-white">نمودار درآمد ماهانه</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">روند درآمد مدرس در ماه‌های اخیر</p>
          </div>
          <div className="space-y-4">
            {stats.monthlyIncomeData.map((item) => (
              <div key={item.month} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                  <span>{item.month}</span>
                  <span>{item.income.toLocaleString("fa-IR")} تومان</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                    style={{ width: `${Math.max((item.income / stats.maxMonthlyIncome) * 100, 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8">
          <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4">تفکیک درآمد</h3>
          <div className="space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between"><span className="text-gray-500">درآمد کل فروش دوره‌ها</span><span className="text-gray-900 dark:text-white">{stats.totalRev.toLocaleString("fa-IR")} تومان</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-500">سهم مدرس</span><span className="text-primary">{stats.totalInstructorShare.toLocaleString("fa-IR")} تومان</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-500">سهم پلتفرم</span><span className="text-gray-900 dark:text-white">{Math.round(stats.totalRev * 0.3).toLocaleString("fa-IR")} تومان</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-500">تعداد فروش</span><span className="text-gray-900 dark:text-white">{stats.thisMonthSales.toLocaleString("fa-IR")}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-500">میانگین درآمد هر فروش</span><span className="text-gray-900 dark:text-white">{stats.avgPerSale.toLocaleString("fa-IR")} تومان</span></div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
            <h4 className="text-xs font-black text-gray-900 dark:text-white mb-2">پرفروش‌ترین دوره</h4>
            <div className="rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4">
              <p className="text-xs font-black text-gray-900 dark:text-white truncate">{stats.topCourse.title}</p>
              <p className="text-[10px] text-gray-500 mt-1">تعداد فروش: {stats.topCourse.count.toLocaleString("fa-IR")}</p>
              <p className="text-[10px] text-primary mt-1">درآمد مدرس از این دوره: {stats.topCourse.instructorRevenue.toLocaleString("fa-IR")} تومان</p>
            </div>
          </div>
        </div>
      </div>

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
                  <th className="py-3 px-4 text-left font-black text-primary">سهم مدرس</th>
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
                      <span className="px-2.5 py-0.5 rounded-full text-[8px] bg-emerald-500/10 text-emerald-400">موفق</span>
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
