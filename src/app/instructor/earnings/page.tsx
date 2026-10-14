"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CircleDollarSign,
  TrendingUp,
  Wallet,
  Users,
  CreditCard,
  Search,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Layers,
  Calendar,
} from "lucide-react";
import { useInstructorEarnings } from "@/hooks/api/useInstructorDashboard";
import type {
  InstructorCourseEarningsRow,
  InstructorTransactionItem,
} from "@/server/services/instructor-earnings.service";

const formatCurrency = (val: number) => val.toLocaleString("fa-IR") + " تومان";
const formatPersian = (val: string | number) => val.toLocaleString("fa-IR");

function formatTransactionDate(value?: string | null) {
  if (!value) return "نامشخص";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "نامشخص";

  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleDateString("fa-IR");
  }
}

export default function InstructorEarningsPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useInstructorEarnings();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const summary = data?.summary;
  const coursesBreakdown = data?.coursesBreakdown ?? [];
  const transactions = data?.recentTransactions ?? [];

  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesCourse =
        selectedCourseFilter === "all" || tx.courseId === selectedCourseFilter;

      if (!matchesCourse) return false;

      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase().trim();
      return (
        tx.courseTitle.toLowerCase().includes(q) ||
        tx.studentName.toLowerCase().includes(q) ||
        tx.trackingCode.toLowerCase().includes(q) ||
        (tx.refNumber && tx.refNumber.toLowerCase().includes(q)) ||
        (tx.trackId && tx.trackId.toLowerCase().includes(q)) ||
        (tx.studentPhone && tx.studentPhone.includes(q))
      );
    });
  }, [transactions, selectedCourseFilter, searchTerm]);

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500 text-right" dir="rtl">
      {/* هدر صفحه */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[90px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-6 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-right">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                <CircleDollarSign className="w-8 h-8" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
                <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                  گزارش درآمد و تراکنش‌ها
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  درگاه پرداخت شاپرک زیبال
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
                مشاهده درآمدهای ثبت‌شده حاصل از خریدهای قطعی دوره‌ها، محاسبه دقیق سهم مدرس (۷۰٪) و فهرست کامل تراکنش‌ها
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-xs md:text-sm font-bold transition-all disabled:opacity-50"
              title="به‌روزرسانی داده‌ها"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
              <span>به‌روزرسانی</span>
            </button>
          </div>
        </div>
      </div>

      {/* وضعیت خطا */}
      {isError && (
        <div className="rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-6 mb-8 text-red-700 dark:text-red-400 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div className="text-sm font-bold">
            {error instanceof Error ? error.message : "خطا در دریافت اطلاعات مالی مدرس. لطفاً دوباره تلاش کنید."}
          </div>
        </div>
      )}

      {/* کارت‌های آمار اصلی (Stats Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* کارت سهم مدرس (خالص دریافتی) */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">سهم خالص مدرس (۷۰٪)</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
              {isPending ? (
                <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
              ) : (
                formatCurrency(summary?.totalInstructorEarnings ?? 0)
              )}
            </div>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              درآمد نهایی قابل تسویه با شماره شبا
            </p>
          </div>
        </div>

        {/* کارت کل فروش ناخالص */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">مجموع فروش کل دوره‌ها</span>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
              {isPending ? (
                <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
              ) : (
                formatCurrency(summary?.totalGrossRevenue ?? 0)
              )}
            </div>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              ارزش کل فاکتورهای پرداخت‌شده
            </p>
          </div>
        </div>

        {/* کارت درآمد ماه جاری */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">فروش ۳۰ روز اخیر</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
              {isPending ? (
                <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
              ) : (
                formatCurrency(summary?.thisMonthInstructorEarnings ?? 0)
              )}
            </div>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              {isPending
                ? "در حال محاسبه..."
                : `${formatPersian(summary?.thisMonthSalesCount ?? 0)} دوره در ۳۰ روز اخیر`}
            </p>
          </div>
        </div>

        {/* کارت دانشجویان و فروش‌ها */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">خریداران و تراکنش‌ها</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-baseline gap-2">
              {isPending ? (
                <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
              ) : (
                <>
                  <span>{formatPersian(summary?.totalStudentsCount ?? 0)}</span>
                  <span className="text-xs font-bold text-gray-400">دانشجو</span>
                </>
              )}
            </div>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              {isPending
                ? "در حال محاسبه..."
                : `${formatPersian(summary?.totalSalesCount ?? 0)} تراکنش خرید موفق`}
            </p>
          </div>
        </div>
      </div>

      {/* بنر توضیح تسویه حساب زیبال */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/5 via-primary/[0.02] to-emerald-500/5 dark:from-primary/10 dark:via-transparent dark:to-emerald-500/10 border border-primary/10 dark:border-white/5 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
              شفافیت مالی و تسویه‌حساب خودکار
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              سهم مدرس معادل ۷۰٪ از هر خرید قطعی است که بلافاصله پس از تایید توسط شاپرک و درگاه زیبال در پنل منظور می‌گردد. ۳۰٪ مابقی سهم نگهداری زیرساخت و پلتفرم اسپاتی‌کد است.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <Link
            href="/instructor/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#252836] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:text-primary transition-colors shadow-sm"
          >
            <span>تنظیم شماره شبا بانکی</span>
            <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </div>

      {/* تفکیک درآمد بر اساس دوره‌ها (Course Breakdown) */}
      <div className="rounded-[2.5rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 md:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white">
                تفکیک درآمد دوره‌ها
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                عملکرد فروش و سهم دریافتی به ازای هر دوره آموزشی
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
            {formatPersian(coursesBreakdown.length)} دوره ثبت‌شده
          </span>
        </div>

        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-3xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : coursesBreakdown.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            هیچ دوره‌ای برای این مدرس یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coursesBreakdown.map((course) => {
              const maxGross = Math.max(...coursesBreakdown.map((c) => c.grossRevenue), 1);
              const percentOfTop = Math.round((course.grossRevenue / maxGross) * 100);

              return (
                <div
                  key={course.courseId}
                  className="rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] p-5 hover:border-primary/20 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/10 shrink-0 border border-gray-100 dark:border-white/10">
                        <Image
                          src={course.cover}
                          alt={course.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          قیمت دوره: {course.price > 0 ? formatCurrency(course.price) : "رایگان"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-200/50 dark:border-white/5 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">تعداد فروش:</span>
                        <span className="font-black text-gray-900 dark:text-white text-sm">
                          {formatPersian(course.salesCount)} عدد
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">دانشجویان:</span>
                        <span className="font-black text-gray-900 dark:text-white text-sm">
                          {formatPersian(course.studentsCount)} نفر
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 dark:text-gray-400">سهم مدرس (۷۰٪):</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                          {formatCurrency(course.instructorEarnings)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-400">
                        <span>کل فروش:</span>
                        <span>{formatCurrency(course.grossRevenue)}</span>
                      </div>
                    </div>
                  </div>

                  {/* نوار سهم */}
                  <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-white/5">
                    <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentOfTop}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* بخش جدول تاریخچه تراکنش‌ها (Transactions Table) */}
      <div className="rounded-[2.5rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-gray-900 dark:text-white">
                ریز تراکنش‌های خرید دوره‌ها
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                لیست زنده و مستند سفارشات تکمیل‌شده، کد‌های پیگیری زیبال و مبالغ واریزی
              </p>
            </div>
          </div>

          {/* فیلترها و جستجو */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* جستجو */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="جستجوی دانشجو، کد رهگیری، دوره..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* فیلتر دوره */}
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
            >
              <option value="all">همه دوره‌ها</option>
              {coursesBreakdown.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* لیست تراکنش‌ها */}
        {isPending ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              هیچ تراکنشی یافت نشد
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              {searchTerm || selectedCourseFilter !== "all"
                ? "تراکنشی مطابق با فیلترهای جستجوی شما پیدا نشد."
                : "هنوز سفارشی برای دوره‌های شما ثبت نشده است. با انتشار دوره‌ها و آغاز خرید دانشجویان، مبالغ به صورت زنده در این جدول ثبت می‌گردد."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 md:mx-0">
            <div className="inline-block min-w-full align-middle px-6 md:px-0">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5 text-right">
                <thead>
                  <tr className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">دانشجو (خریدار)</th>
                    <th className="py-3 px-4">عنوان دوره</th>
                    <th className="py-3 px-4">مبلغ پرداختی</th>
                    <th className="py-3 px-4">سهم مدرس (۷۰٪)</th>
                    <th className="py-3 px-4">کد پیگیری / شناسه مرجع</th>
                    <th className="py-3 px-4">درگاه / شیوه</th>
                    <th className="py-3 px-4">تاریخ پرداخت</th>
                    <th className="py-3 px-4">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs font-medium">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.orderId}
                      className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* دانشجو */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 shrink-0">
                            <Image
                              src={tx.studentAvatar}
                              alt={tx.studentName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {tx.studentName}
                            </div>
                            {tx.studentMaskedPhone && (
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5" dir="ltr">
                                {tx.studentMaskedPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* عنوان دوره */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900 dark:text-white max-w-[200px] truncate" title={tx.courseTitle}>
                          {tx.courseTitle}
                        </div>
                      </td>

                      {/* مبلغ کل فاکتور */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* سهم مدرس */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(tx.instructorShare)}
                        </span>
                      </td>

                      {/* کد رهگیری */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-xl w-fit">
                          <span>{tx.refNumber || tx.trackingCode}</span>
                          <button
                            onClick={() => handleCopy(tx.refNumber || tx.trackingCode)}
                            className="text-gray-400 hover:text-primary transition-colors p-0.5"
                            title="کپی کد رهگیری"
                          >
                            {copiedCode === (tx.refNumber || tx.trackingCode) ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* شیوه پرداخت */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          {tx.paymentMethod}
                        </span>
                        {tx.cardNumber && (
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5" dir="ltr">
                            {tx.cardNumber}
                          </div>
                        )}
                      </td>

                      {/* تاریخ */}
                      <td className="py-4 px-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatTransactionDate(tx.paidAt || tx.createdAt)}
                      </td>

                      {/* وضعیت */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{tx.statusLabel}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
