"use client";

import React, { useMemo, useState } from "react";
import { ShoppingCart, Download, Search, SlidersHorizontal, CheckCircle2, X, Hash, Calendar, User, BookOpen, Wallet } from "lucide-react";
import { StatusPill } from "@/components/admin/AdminCharts";
import { recentOrders } from "@/components/admin/admin-data";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function AdminOrdersPage() {
  type OrderItem = (typeof recentOrders)[number];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).slice(2, 11);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const hasActiveFilters = useMemo(() => {
    return searchQuery !== "" || statusFilter !== "all";
  }, [searchQuery, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("newest");
    showToast("فیلترهای سفارش با موفقیت پاک شدند.", "info");
  };

  const filteredOrders = useMemo(() => {
    let result = [...recentOrders];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.user.toLowerCase().includes(q) ||
          o.course.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "highest_amount") {
        const aAmount = Number(a.amount.replace(/,/g, ""));
        const bAmount = Number(b.amount.replace(/,/g, ""));
        return bAmount - aAmount;
      }
      return b.id.localeCompare(a.id);
    });

    return result;
  }, [searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const paid = recentOrders.filter((o) => o.status === "پرداخت شده");
    const pending = recentOrders.filter((o) => o.status === "در انتظار");
    const canceled = recentOrders.filter((o) => o.status === "لغو شده");
    const totalAmount = paid.reduce((sum, o) => sum + Number(o.amount.replace(/,/g, "")), 0);
    return {
      total: recentOrders.length,
      paid: paid.length,
      pending: pending.length,
      canceled: canceled.length,
      totalAmount,
    };
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
                <ShoppingCart className="w-8 h-8" />
              </div>
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">مدیریت سفارش‌ها</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                بررسی وضعیت سفارش‌ها، پرداخت‌ها و پایش مغایرت‌های مالی
              </p>
            </div>
          </div>

          <button
            onClick={() => showToast("فایل خروجی سفارش‌ها آماده‌سازی شد.", "success")}
            className="flex items-center gap-1.5 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>خروجی سفارش‌ها</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">کل سفارش‌ها</span>
          <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{stats.total.toLocaleString("fa-IR")}</p>
        </div>
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">پرداخت شده</span>
          <p className="text-lg md:text-xl font-black text-emerald-500">{stats.paid.toLocaleString("fa-IR")}</p>
        </div>
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">در انتظار</span>
          <p className="text-lg md:text-xl font-black text-amber-500">{stats.pending.toLocaleString("fa-IR")}</p>
        </div>
        <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
          <span className="text-[10px] text-gray-500 font-bold block mb-2">درآمد قطعی</span>
          <p className="text-lg md:text-xl font-black text-primary">{stats.totalAmount.toLocaleString("fa-IR")} تومان</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsFiltersExpanded((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-black"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isFiltersExpanded ? "بستن فیلترها" : "نمایش فیلترها"}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[10px] font-black text-rose-500">
              پاکسازی فیلترها
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس شماره سفارش، کاربر یا عنوان دوره..."
              className="w-full h-11 rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 pr-10 pl-3 text-xs font-bold outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 text-xs font-bold outline-none focus:border-primary"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="پرداخت شده">پرداخت شده</option>
            <option value="در انتظار">در انتظار</option>
            <option value="لغو شده">لغو شده</option>
          </select>
        </div>

        {isFiltersExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 animate-in fade-in duration-300">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 text-xs font-bold outline-none focus:border-primary"
            >
              <option value="newest">جدیدترین سفارش‌ها</option>
              <option value="highest_amount">بیشترین مبلغ</option>
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] shadow-md p-4 md:p-6">
        <table className="w-full border-collapse text-[12px] font-bold min-w-[880px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 text-right">
              <th className="py-3 px-3 font-black">شناسه سفارش</th>
              <th className="py-3 px-3 font-black">کاربر</th>
              <th className="py-3 px-3 font-black">عنوان دوره</th>
              <th className="py-3 px-3 font-black">مبلغ (تومان)</th>
              <th className="py-3 px-3 font-black">تاریخ ثبت</th>
              <th className="py-3 px-3 font-black">وضعیت</th>
              <th className="py-3 px-3 font-black">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="py-3 px-3 font-black">{order.id}</td>
                <td className="py-3 px-3">{order.user}</td>
                <td className="py-3 px-3">{order.course}</td>
                <td className="py-3 px-3">{order.amount.toLocaleString("fa-IR")}</td>
                <td className="py-3 px-3">{order.date}</td>
                <td className="py-3 px-3">
                  <StatusPill status={order.status} />
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-lg border border-gray-200 dark:border-white/10 px-2.5 py-1 text-[10px] font-black"
                    >
                      جزئیات
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full" dir="rtl">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-left duration-300 ${
              t.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : t.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-blue-500/10 border-blue-500/20 text-blue-400"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{t.message}</span>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" dir="rtl">
          <button
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            aria-label="بستن مودال"
          />

          <div className="relative w-full max-w-xl bg-white dark:bg-[#1c1e26] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 left-6 p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-10 text-center bg-primary/10">
              <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-primary mb-2">جزئیات سفارش</h3>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{selectedOrder.amount.toLocaleString("fa-IR")}</span>
                <span className="text-xs font-bold text-gray-400">تومان</span>
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-8">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <OrderDetailItem icon={<Hash className="w-4 h-4" />} label="شناسه سفارش" value={selectedOrder.id} />
                <OrderDetailItem icon={<Calendar className="w-4 h-4" />} label="تاریخ ثبت" value={selectedOrder.date} />
                <OrderDetailItem icon={<User className="w-4 h-4" />} label="نام کاربر" value={selectedOrder.user} />
                <OrderDetailItem icon={<BookOpen className="w-4 h-4" />} label="دوره خریداری شده" value={selectedOrder.course} />
                <OrderDetailItem icon={<Wallet className="w-4 h-4" />} label="وضعیت پرداخت" value={selectedOrder.status} />
                <OrderDetailItem icon={<Wallet className="w-4 h-4" />} label="مبلغ کل" value={`${selectedOrder.amount.toLocaleString("fa-IR")} تومان`} />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => showToast(`رسید سفارش ${selectedOrder.id} آماده دانلود شد.`, "success")}
                  className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  <span>دریافت رسید</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  بستن پنجره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderDetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-black text-gray-900 dark:text-gray-100 pr-6">{value}</p>
    </div>
  );
}
