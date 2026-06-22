"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Download, Search, CheckCircle2, X, Hash, Calendar, User, BookOpen, Wallet, Clock3, BadgeCheck, Receipt, Filter } from "lucide-react";
import { StatusPill } from "@/components/admin/AdminCharts";
import type { AdminOrderItem } from "@/lib/admin-orders";
import CustomSelect from "@/components/ui/CustomSelect";
import { AdminOrdersStatsSkeleton, AdminOrdersTableSkeleton } from "./_components/AdminOrdersSkeletons";
import { mapAdminOrderStatusFilter, useAdminOrdersQuery } from "@/hooks/api/useAdminOrdersQuery";
import { toEnglishDigits } from "@/lib/digits";

function matchesOrderSearch(order: AdminOrderItem, query: string): boolean {
  const normalizedQuery = toEnglishDigits(query.trim()).toLowerCase();
  if (!normalizedQuery) return true;

  const haystack = [order.id, order.user, order.course, order.amount, order.date]
    .map((value) => toEnglishDigits(value).toLowerCase())
    .join(" ");

  return haystack.includes(normalizedQuery);
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

type OrderFilters = {
  status: string;
};

const defaultOrderFilters: OrderFilters = {
  status: "all",
};

const orderStatusFilterOptions = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "paid", label: "پرداخت شده" },
  { value: "pending", label: "در انتظار" },
  { value: "canceled", label: "لغو شده" },
];

const adminFilterSelectClassName =
  "h-full [&>div]:h-full [&_button]:h-full [&_button]:min-h-[46px] [&_button]:text-xs [&_button]:px-4";

function OrdersErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black">بارگذاری لیست سفارش‌ها انجام نشد.</p>
          <p className="mt-2 text-xs leading-relaxed opacity-90">{message}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-red-700"
        >
          <CheckCircle2 className="w-4 h-4" />
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  type OrderItem = AdminOrderItem;

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [debouncedFilters, setDebouncedFilters] = useState<OrderFilters>(defaultOrderFilters);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilters({
        status: statusFilter,
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [statusFilter]);

  const { data, isPending, isFetching, isError, error, refetch } = useAdminOrdersQuery({
    status: mapAdminOrderStatusFilter(debouncedFilters.status),
  });

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  const isLoadingOrders = isPending || isFetching;
  const showOrdersContent = !isError || orders.length > 0;

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).slice(2, 11);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return orders;
    return orders.filter((order) => matchesOrderSearch(order, query));
  }, [orders, searchQuery]);

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.status === "پرداخت شده");
    const pending = orders.filter((o) => o.status === "در انتظار");
    const canceled = orders.filter((o) => o.status === "لغو شده");
    const totalAmount = paid.reduce((sum, o) => sum + o.amountValue, 0);
    return {
      total: orders.length,
      paid: paid.length,
      pending: pending.length,
      canceled: canceled.length,
      totalAmount,
    };
  }, [orders]);

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

      {isError ? (
        <div className="mb-8">
          <OrdersErrorState
            message={error?.message || "لطفاً اتصال شبکه و سطح دسترسی کاربر را بررسی کنید."}
            onRetry={() => void refetch()}
          />
        </div>
      ) : null}

      {isLoadingOrders ? (
        <AdminOrdersStatsSkeleton />
      ) : showOrdersContent ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <MiniStat title="کل سفارش‌ها" value={stats.total.toLocaleString("fa-IR")} desc="کل سفارش‌های ثبت‌شده" icon={<Receipt className="w-5 h-5 text-blue-400" />} color="from-blue-500/10 to-indigo-500/5 border-blue-500/20" bgGlow="bg-blue-500/5" />
          <MiniStat title="پرداخت شده" value={stats.paid.toLocaleString("fa-IR")} desc="سفارش‌های تسویه‌شده" icon={<BadgeCheck className="w-5 h-5 text-emerald-400" />} color="from-emerald-500/10 to-teal-500/5 border-emerald-500/20" bgGlow="bg-emerald-500/5" />
          <MiniStat title="در انتظار" value={stats.pending.toLocaleString("fa-IR")} desc="نیازمند پرداخت" icon={<Clock3 className="w-5 h-5 text-amber-400" />} color="from-amber-500/10 to-orange-500/5 border-amber-500/20" bgGlow="bg-amber-500/5" />
          <MiniStat title="درآمد قطعی" value={`${stats.totalAmount.toLocaleString("fa-IR")} تومان`} desc="جمع مبالغ پرداخت‌شده" icon={<Wallet className="w-5 h-5 text-primary" />} color="from-primary/15 to-emerald-500/5 border-primary/25" bgGlow="bg-primary/10" />
        </div>
      ) : null}

      <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
          <div className="relative md:col-span-2 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس شماره سفارش، کاربر یا عنوان دوره..."
              className="h-full min-h-[46px] w-full rounded-2xl border border-gray-100 bg-gray-50 py-3.5 pr-11 pl-3 text-xs font-bold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <CustomSelect
            options={orderStatusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="وضعیت"
            size="md"
            className={adminFilterSelectClassName}
            icon={<Filter className="w-4 h-4" />}
          />
        </div>
      </div>

      {isLoadingOrders ? (
        <AdminOrdersTableSkeleton />
      ) : showOrdersContent ? (
        <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] shadow-md p-4 md:p-6">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-xs font-black text-gray-500 dark:text-gray-400">
                {searchQuery.trim() ? "سفارشی با این عبارت پیدا نشد." : "سفارشی برای نمایش وجود ندارد."}
              </p>
            </div>
          ) : (
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
                    <td className="py-3 px-3">{order.amount}</td>
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
          )}
        </div>
      ) : null}

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
                <span className="text-3xl font-black text-gray-900 dark:text-white">{selectedOrder.amount}</span>
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
                <OrderDetailItem icon={<Wallet className="w-4 h-4" />} label="مبلغ کل" value={`${selectedOrder.amount} تومان`} />
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

function MiniStat({
  title,
  value,
  desc,
  icon,
  color,
  bgGlow,
}: {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1c1e26] p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between min-h-[124px]">
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgGlow} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400">{title}</span>
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} transition-transform group-hover:scale-110 duration-300`}>
            {icon}
          </div>
        </div>

        <div>
          <p className="text-base md:text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{value}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{desc}</p>
        </div>
      </div>
    </div>
  );
}
