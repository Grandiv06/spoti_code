"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Activity, 
  Clock, 
  ShoppingBag, 
  CheckCircle, 
  MessageSquare, 
  FileText,
  Edit3,
  ExternalLink,
  Shield,
  Inbox,
  Save,
  Video,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { User, PurchasedCourse, UserTransaction, UserTicket, UserActivity } from "../_components/types";
import { UserStatusBadge, UserRoleBadge } from "../_components/Badges";
import { toPersianDigits, formatPrice, formatPhone, formatPersianDate } from "../_components/utils";
import EditUserModal from "../_components/EditUserModal";
import {
  UserActivityTabSkeleton,
  UserAdminNotesTabSkeleton,
  UserCoursesTabSkeleton,
  UserDetailHeaderSkeleton,
  UserDetailTabsSkeleton,
  UserOverviewTabSkeleton,
  UserTicketsTabSkeleton,
  UserTransactionsTabSkeleton,
} from "../_components/UserDetailSkeletons";
import {
  useAdminUserActivitiesQuery,
  useAdminUserCoursesQuery,
  useAdminUserInternalNoteQuery,
  useAdminUserOverviewQuery,
  useAdminUserTicketsQuery,
  useAdminUserTransactionsQuery,
  useUpdateAdminUserInternalNoteMutation,
} from "@/hooks/api/useAdminUserDetailQueries";
import AdminTablePagination from "@/components/admin/AdminTablePagination";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface UserDetailViewProps {
  userId: string;
}

type UserDetailTab = "overview" | "courses" | "transactions" | "tickets" | "activity" | "notes";

function TabErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <p className="text-xs font-black">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-[10px] font-bold text-white transition-colors hover:bg-red-700"
        >
          تلاش مجدد
        </button>
      ) : null}
    </div>
  );
}

// ----------------------------------------------------
// 1. Overview Tab Component
// ----------------------------------------------------
interface UserOverviewTabProps {
  user: User;
}

export function UserOverviewTab({ user }: UserOverviewTabProps) {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[1][0]}`;
    }
    return name.slice(0, 2);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300" dir="rtl">
      {/* Right Column - Profile Card & Core Info (Span 4) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-8 rounded-[2rem] text-center relative overflow-hidden shadow-sm">
          <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${user.avatarColor || 'from-emerald-400 to-teal-600'} opacity-10 rounded-full blur-[50px] -translate-y-1/3 translate-x-1/3`} />
          
          <div className="relative mb-5 inline-block">
            <div className={`absolute inset-0 bg-gradient-to-br ${user.avatarColor || 'from-emerald-400 to-teal-600'} rounded-[2.2rem] blur-[8px] opacity-35`} />
            <div className={`relative w-24 h-24 rounded-[2rem] bg-gradient-to-br ${user.avatarColor || 'from-emerald-400 to-teal-600'} flex items-center justify-center text-white text-3xl font-black shadow-lg`}>
              {getInitials(user.name)}
            </div>
          </div>
          
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">{user.name}</h2>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <UserRoleBadge role={user.role} />
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-4 text-xs font-bold">
            <div className="bg-gray-50/50 dark:bg-black/10 p-3 rounded-xl border border-gray-100/50 dark:border-white/5 text-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 block mb-1">دوره‌ها</span>
              <span className="text-sm font-black text-gray-800 dark:text-white">{toPersianDigits(user.courses)} دوره</span>
            </div>
            <div className="bg-gray-50/50 dark:bg-black/10 p-3 rounded-xl border border-gray-100/50 dark:border-white/5 text-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 block mb-1">کل خرید</span>
              <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">{toPersianDigits(user.purchasesCount)} بار</span>
            </div>
          </div>
        </div>

        {/* Core Information Details */}
        <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] space-y-3.5 shadow-sm">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 mb-4 pb-2 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
            <span className="w-1.5 h-3 rounded-sm bg-primary" />
            <span>اطلاعات پایه‌ای حساب</span>
          </h3>

          {[
            { label: "شناسه کاربر", val: toPersianDigits(user.id), isMono: true, icon: UserIcon },
            { label: "شماره موبایل", val: formatPhone(user.phone), isLtr: true, icon: Phone },
            { label: "ایمیل", val: user.email, isLtr: true, isSelectable: true, icon: Mail },
            { label: "تاریخ عضویت", val: formatPersianDate(user.joinedAt), icon: Calendar },
            { label: "مجموع پرداختی (LTV)", val: formatPrice(user.ltv), isPrice: true, icon: CreditCard },
          ].map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/40 dark:bg-black/15 border border-gray-100/50 dark:border-white/5"
            >
              <div className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{item.label}</span>
              </div>
              
              <span className={`text-xs font-black text-gray-800 dark:text-gray-200 ${
                item.isMono ? 'font-mono bg-white dark:bg-black/35 px-2.5 py-0.5 border border-gray-100 dark:border-white/5 rounded-lg text-gray-500' :
                item.isPrice ? 'text-emerald-500 dark:text-emerald-400 text-sm' :
                item.isLtr ? '[unicode-bidi:plaintext] text-left' : ''
              } ${item.isSelectable ? 'select-all' : ''}`} dir={item.isLtr ? 'ltr' : 'rtl'}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Left Column - Spaced Stats & Notes (Span 8) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Quick Stats Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span>خلاصه وضعیت فعالیت</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "آخرین ورود", val: user.lastLogin, color: "text-blue-400 bg-blue-500/10 border-blue-500/10", icon: Clock },
              { label: "تراکنش موفق", val: `${toPersianDigits(user.successfulTransactionsCount)} موفق`, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10", icon: CheckCircle },
              { label: "تیکت پشتیبانی", val: `${toPersianDigits(user.supportTicketsCount)} تیکت`, color: "text-amber-400 bg-amber-500/10 border-amber-500/10", icon: MessageSquare },
              { label: "آخرین دوره مشاهده‌شده", val: user.lastCourseViewed, color: "text-purple-400 bg-purple-500/10 border-purple-500/10", icon: BookOpen, isTruncated: true }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-5 rounded-3xl shadow-sm flex flex-col justify-between min-h-[120px] hover:border-gray-200 dark:hover:border-white/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-xs font-black text-gray-800 dark:text-white ${item.isTruncated ? 'truncate font-medium text-[11px]' : ''}`} title={item.isTruncated ? item.val : undefined}>
                    {item.val}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning progress summary card */}
        <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 pb-2 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>خلاصه پیشرفت یادگیری</span>
          </h3>
          
          {user.purchasedCourses.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">دوره‌ای خریداری نشده است.</p>
          ) : (
            <div className="space-y-4">
              {user.purchasedCourses.slice(0, 2).map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-gray-50/30 dark:bg-black/10">
                  <span className="text-xs font-black text-gray-900 dark:text-white truncate max-w-[200px]">
                    {c.name}
                  </span>
                  
                  <div className="flex items-center gap-3 flex-1 justify-end max-w-xs">
                    <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden relative">
                      <div className="absolute top-0 right-0 h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 w-8 text-left">{toPersianDigits(c.progress)}٪</span>
                  </div>
                </div>
              ))}
              {user.purchasedCourses.length > 2 && (
                <p className="text-[10px] text-gray-400 text-center font-bold">
                  و {toPersianDigits(user.purchasedCourses.length - 2)} دوره دیگر خریداری شده (برای بررسی کامل به تب دوره‌ها مراجعه کنید).
                </p>
              )}
            </div>
          )}
        </div>

        {/* Note preview card */}
        <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] shadow-sm space-y-3">
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 pb-2 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-400" />
            <span>یادداشت داخلی ادمین</span>
          </h3>
          <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 font-medium bg-gray-50/50 dark:bg-black/15 border border-gray-100/50 dark:border-white/5 p-4 rounded-2xl relative">
            <div className="absolute top-0 right-0 w-1 h-full bg-red-400 rounded-r-2xl" />
            <p className="pr-2 truncate">
              {user.internalNotes || "هیچ یادداشتی ثبت نشده است."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. Courses Tab Component
// ----------------------------------------------------
interface UserCoursesTabProps {
  courses: PurchasedCourse[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function UserCoursesTab({ courses, isLoading, isError, onRetry, showToast }: UserCoursesTabProps) {
  if (isLoading) {
    return <UserCoursesTabSkeleton />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300" dir="rtl">
      <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-purple-400" />
        <span>دوره‌های خریداری شده و پیشرفت یادگیری</span>
      </h3>

      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 space-y-4 shadow-sm">
        {isError ? (
          <TabErrorState message="بارگذاری دوره‌های کاربر انجام نشد." onRetry={onRetry} />
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700 mb-3 animate-bounce" />
            <p className="text-xs font-black text-gray-500 dark:text-gray-400">این کاربر هنوز دوره‌ای خریداری نکرده است.</p>
          </div>
        ) : (
          courses.map((c, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center gap-5 p-4 rounded-2xl bg-gray-50/30 dark:bg-black/15 border border-gray-100/50 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all animate-in slide-in-from-bottom duration-300">
              
              {/* Course Title & Date */}
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/15 flex items-center justify-center shrink-0 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-gray-900 dark:text-white block mb-1 truncate font-sans" title={c.name}>
                    {c.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500">
                    <span>خریداری شده در: {formatPersianDate(c.purchaseDate)}</span>
                  </div>
                </div>
              </div>
              
              {/* Learning Progress Bar */}
              <div className="w-full md:w-52 flex items-center gap-3 shrink-0">
                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden relative">
                  <div 
                    className="absolute top-0 right-0 h-full bg-gradient-to-l from-primary to-emerald-400 rounded-full" 
                    style={{ width: `${c.progress}%` }} 
                  />
                </div>
                <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 w-8 text-left">
                  {toPersianDigits(c.progress)}٪
                </span>
              </div>

              {/* Badge and action button */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                <span className={`inline-flex px-2.5 py-1 text-[10px] font-black rounded-md ${
                  c.status === "فعال" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  c.status === "دسترسی محدود" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {c.status}
                </span>
                
                <button 
                  onClick={() => showToast(`انتقال به بخش مشاهده دوره «${c.name}» (به صورت نمایشی)`, "info")}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-hover px-3.5 py-2 rounded-xl border border-primary/10 hover:bg-primary/5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>مشاهده دوره</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. Transactions Tab Component
// ----------------------------------------------------
interface UserTransactionsTabProps {
  transactions: UserTransaction[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function UserTransactionsTab({ transactions, isLoading, isError, onRetry, showToast }: UserTransactionsTabProps) {
  const [filter, setFilter] = useState<"all" | "موفق" | "ناموفق" | "در انتظار">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filtered.length);
  const paginatedTransactions = filtered.slice(startIndex, endIndex);

  if (isLoading) {
    return <UserTransactionsTabSkeleton />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>تراکنش‌های مالی کاربر</span>
        </h3>
        
        {/* Horizontal filter controls */}
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-black/35 border border-gray-100 dark:border-white/5 p-1 rounded-2xl text-[10px] font-bold self-start sm:self-auto">
          {[
            { id: "all", label: "همه" },
            { id: "موفق", label: "موفق" },
            { id: "ناموفق", label: "ناموفق" },
            { id: "در انتظار", label: "در انتظار" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as typeof filter)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                (btn.id === filter)
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
        {isError ? (
          <TabErrorState message="بارگذاری تراکنش‌های کاربر انجام نشد." onRetry={onRetry} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 animate-pulse">
            <CreditCard className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
            <p className="text-xs font-black text-gray-500 dark:text-gray-400">تراکنشی با فیلتر انتخابی ثبت نشده است.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs text-right font-semibold">
                <thead>
                  <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5 pb-3">
                    <th className="pb-3 pr-2">شناسه تراکنش</th>
                    <th className="pb-3">محصول مرتبط</th>
                    <th className="pb-3">تاریخ</th>
                    <th className="pb-3">روش پرداخت</th>
                    <th className="pb-3">مبلغ</th>
                    <th className="pb-3">وضعیت</th>
                    <th className="pb-3 text-left pl-2">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {paginatedTransactions.map((t) => (
                    <tr key={t.id} className="text-gray-800 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                      <td className="py-4 pr-2 font-mono text-[10px] font-bold text-gray-500">{toPersianDigits(t.id)}</td>
                      <td className="py-4 font-bold text-gray-900 dark:text-white">{t.productTitle || "—"}</td>
                      <td className="py-4 text-gray-400 dark:text-gray-500">{formatPersianDate(t.date)}</td>
                      <td className="py-4">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                          {t.paymentMethod || "—"}
                        </span>
                      </td>
                      <td className="py-4 font-black text-gray-900 dark:text-white">{formatPrice(t.amount)}</td>
                      <td className="py-4">
                        <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded ${
                          t.status === "موفق" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          t.status === "در انتظار" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 text-left pl-2">
                        <button 
                          onClick={() => showToast(`جزئیات تراکنش ${t.id}: ${t.productTitle || "—"} به مبلغ ${formatPrice(t.amount)}`, "info")}
                          className="text-[10px] font-bold text-primary hover:text-primary-hover px-2.5 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/5 transition-all"
                        >
                          مشاهده جزئیات تراکنش
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-3.5">
              {paginatedTransactions.map((t) => (
                <div 
                  key={t.id} 
                  className="p-4 rounded-2xl bg-gray-50/20 dark:bg-black/15 border border-gray-100/50 dark:border-white/5 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-gray-400 block mb-1">{toPersianDigits(t.id)}</span>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white">{t.productTitle || "—"}</h4>
                    </div>
                    <span className={`inline-block text-[9px] font-black px-1.5 py-0.5 rounded ${
                      t.status === "موفق" ? "bg-emerald-500/10 text-emerald-400" :
                      t.status === "در انتظار" ? "bg-amber-500/10 text-amber-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 font-semibold border-t border-b border-gray-100 dark:border-white/5 py-2">
                    <span>تاریخ: {formatPersianDate(t.date)}</span>
                    <span>روش: {t.paymentMethod || "—"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-900 dark:text-white">{formatPrice(t.amount)}</span>
                    <button 
                      onClick={() => showToast(`جزئیات تراکنش ${t.id} (به صورت نمایشی)`, "info")}
                      className="text-[9px] font-bold text-primary px-2.5 py-1.5 rounded-lg border border-primary/10"
                    >
                      مشاهده جزئیات
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <AdminTablePagination
              totalItems={filtered.length}
              currentPage={safePage}
              rowsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
              itemLabel="تراکنش"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. Tickets Tab Component
// ----------------------------------------------------
interface UserTicketsTabProps {
  tickets: UserTicket[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function UserTicketsTab({ tickets, isLoading, isError, onRetry, showToast }: UserTicketsTabProps) {
  if (isLoading) {
    return <UserTicketsTabSkeleton />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300" dir="rtl">
      <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-2">
        <MessageSquare className="w-4.5 h-4.5 text-blue-400" />
        <span>تیکت‌های پشتیبانی کاربر</span>
      </h3>

      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
        {isError ? (
          <TabErrorState message="بارگذاری تیکت‌های کاربر انجام نشد." onRetry={onRetry} />
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
            <p className="text-xs font-black text-gray-500 dark:text-gray-400">این کاربر هیچ تیکتی ثبت نکرده است.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((tk, idx) => (
              <div 
                key={idx} 
                className="flex flex-col md:flex-row md:items-center justify-between text-xs p-4 rounded-2xl bg-gray-50/20 dark:bg-black/15 border border-gray-100/50 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all gap-4 animate-in slide-in-from-right duration-300"
              >
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tk.status === "باز" ? "bg-red-500/10 text-red-400" :
                    tk.status === "در حال بررسی" ? "bg-amber-500/10 text-amber-400" :
                    "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  
                  <div className="min-w-0">
                    <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1 truncate text-xs sm:text-sm font-sans" title={tk.title}>
                      {tk.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                      <span className="font-mono text-[9px] font-bold text-gray-400 bg-gray-50 dark:bg-black/20 px-1 py-0.5 rounded">{toPersianDigits(tk.id)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700" />
                      <span>ثبت: {formatPersianDate(tk.date)}</span>
                      {tk.updatedAt ? (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700" />
                          <span>بروزرسانی: {formatPersianDate(tk.updatedAt)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-gray-100 dark:border-white/5 pt-3 md:pt-0">
                  <span className={`inline-block px-2.5 py-1 rounded text-[9px] font-black ${
                    tk.status === "باز" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    tk.status === "در حال بررسی" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    tk.status === "بسته شده" ? "bg-gray-500/10 text-gray-400 border border-gray-500/20" :
                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {tk.status}
                  </span>
                  
                  <button 
                    onClick={() => showToast(`انتقال به جزئیات تیکت ${tk.id} (به صورت نمایشی)`, "info")}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-hover px-3 py-1.5 rounded-xl border border-primary/10 hover:bg-primary/5 transition-all"
                  >
                    <span>مشاهده تیکت</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. Activity Tab Component
// ----------------------------------------------------
const ACTIVITY_ICON_MAP: Record<UserActivity["kind"], { icon: LucideIcon; className: string }> = {
  login: { icon: Clock, className: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  payment: { icon: CheckCircle, className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  lesson: { icon: Video, className: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ticket: { icon: MessageSquare, className: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  profile: { icon: Settings, className: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  order: { icon: ShoppingBag, className: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  other: { icon: Activity, className: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
};

export function UserActivityTab({
  activities,
  isLoading,
  isError,
  onRetry,
}: {
  activities: UserActivity[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}) {
  if (isLoading) {
    return <UserActivityTabSkeleton />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300" dir="rtl">
      <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        <span>تایم‌لاین فعالیت‌های کاربر</span>
      </h3>

      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
        {isError ? (
          <TabErrorState message="بارگذاری فعالیت‌های کاربر انجام نشد." onRetry={onRetry} />
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Activity className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700 mb-3" />
            <p className="text-xs font-black text-gray-500 dark:text-gray-400">برای این کاربر فعالیتی ثبت نشده است.</p>
          </div>
        ) : (
          <div className="relative border-r-2 border-gray-100 dark:border-white/5 pr-6 mr-3 space-y-8 py-3">
            {activities.map((act) => {
              const activityIcon = ACTIVITY_ICON_MAP[act.kind] ?? ACTIVITY_ICON_MAP.other;
              const IconComponent = activityIcon.icon;
              return (
                <div key={act.id} className="relative flex flex-col md:flex-row md:items-start gap-4 animate-in fade-in slide-in-from-right duration-350">
                  <div className={`absolute -right-[37px] top-0 w-8 h-8 rounded-xl flex items-center justify-center border ${activityIcon.className} z-10 shrink-0`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <h4 className="text-xs font-black text-gray-900 dark:text-white font-sans">{act.title}</h4>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{toPersianDigits(act.timestamp)}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 font-semibold">
                      {toPersianDigits(act.description)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. Notes Tab Component
// ----------------------------------------------------
interface UserAdminNotesTabProps {
  notes: string;
  isLoading?: boolean;
  isError?: boolean;
  isSaving?: boolean;
  onRetry?: () => void;
  onSaveNotes: (updatedNotes: string) => void;
}

export function UserAdminNotesTab({ notes, isLoading, isError, isSaving, onRetry, onSaveNotes }: UserAdminNotesTabProps) {
  const [currentNotes, setCurrentNotes] = useState(notes);

  useEffect(() => {
    setCurrentNotes(notes);
  }, [notes]);

  const handleSave = () => {
    onSaveNotes(currentNotes);
  };

  if (isLoading) {
    return <UserAdminNotesTabSkeleton />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300" dir="rtl">
      <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-2">
        <FileText className="w-4 h-4 text-red-400" />
        <span>یادداشت داخلی ادمین</span>
      </h3>

      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm space-y-6">
        {isError ? (
          <TabErrorState message="بارگذاری یادداشت داخلی انجام نشد." onRetry={onRetry} />
        ) : (
        <>
        <div className="flex items-center justify-between mb-2 text-[10px] font-semibold text-gray-400 dark:text-gray-500 pb-3 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-red-400" />
            <span>ثبت شده توسط: <strong className="text-gray-600 dark:text-gray-300">ادمین</strong></span>
          </div>
          <span>آخرین ویرایش: به‌روز از سرور</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-2">یادداشت اداری کاربر</label>
            <textarea
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              placeholder="یادداشتی درباره سوابق کاربر، وضعیت پرداختی‌ها، تخفیف‌ها یا تعاملات با ادمین‌ها بنویسید..."
                className="w-full min-h-[150px] p-4 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl focus:outline-none focus:border-primary/30 transition-all font-sans resize-y"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "در حال ذخیره..." : "ذخیره یادداشت"}</span>
              </button>
            </div>
          </div>
        </>
        )}
        </div>
      </div>
  );
}

// ----------------------------------------------------
// Main Client View Component
// ----------------------------------------------------
export default function UserDetailView({ userId }: UserDetailViewProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<UserDetailTab>("overview");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);
  const overviewQuery = useAdminUserOverviewQuery(userId);
  const coursesQuery = useAdminUserCoursesQuery(userId, activeTab === "courses");
  const transactionsQuery = useAdminUserTransactionsQuery(userId, activeTab === "transactions");
  const ticketsQuery = useAdminUserTicketsQuery(userId, activeTab === "tickets");
  const activitiesQuery = useAdminUserActivitiesQuery(userId, activeTab === "activity");
  const internalNoteQuery = useAdminUserInternalNoteQuery(userId, activeTab === "notes");
  const updateInternalNoteMutation = useUpdateAdminUserInternalNoteMutation(userId);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUser((prev) => ({ ...(prev ?? overviewQuery.data ?? updatedUser), ...updatedUser }));
    setIsEditModalOpen(false);
    showToast(`مشخصات کاربر «${updatedUser.name}» با موفقیت ویرایش شد.`, "success");
    void overviewQuery.refetch();
  };

  const displayUser = user ?? overviewQuery.data ?? null;
  const isLoadingOverview = overviewQuery.isPending || overviewQuery.isFetching;
  const displayedCourses = useMemo(() => coursesQuery.data ?? [], [coursesQuery.data]);
  const displayedTransactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data]);
  const displayedTickets = useMemo(() => ticketsQuery.data ?? [], [ticketsQuery.data]);
  const displayedActivities = useMemo(() => activitiesQuery.data ?? [], [activitiesQuery.data]);
  const displayedInternalNote = useMemo(() => internalNoteQuery.data ?? "", [internalNoteQuery.data]);

  const isLoadingCourses = coursesQuery.isPending || coursesQuery.isFetching;
  const isLoadingTransactions = transactionsQuery.isPending || transactionsQuery.isFetching;
  const isLoadingTickets = ticketsQuery.isPending || ticketsQuery.isFetching;
  const isLoadingActivities = activitiesQuery.isPending || activitiesQuery.isFetching;
  const isLoadingNotes = internalNoteQuery.isPending || internalNoteQuery.isFetching;

  const tabsList: { id: UserDetailTab; label: string; icon: LucideIcon }[] = [
    { id: "overview", label: "مشخصات کلی", icon: UserIcon },
    { id: "courses", label: "دوره‌ها", icon: BookOpen },
    { id: "transactions", label: "تراکنش‌ها", icon: CreditCard },
    { id: "tickets", label: "تیکت‌ها", icon: MessageSquare },
    { id: "activity", label: "فعالیت‌ها", icon: Activity },
    { id: "notes", label: "یادداشت ادمین", icon: FileText }
  ];

  if (!userId) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-[#1c1e26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 text-center shadow-xl animate-in fade-in duration-500" dir="rtl">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-3 font-sans">شناسه کاربر نامعتبر است</h2>
        <button
          onClick={() => router.push("/admin/users")}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
        >
          <ChevronRight className="w-4 h-4" />
          <span>بازگشت به لیست کاربران</span>
        </button>
      </div>
    );
  }

  if (overviewQuery.isError && !displayUser) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-[#1c1e26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 text-center shadow-xl animate-in fade-in duration-500" dir="rtl">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-3 font-sans">کاربر مورد نظر پیدا نشد</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-8 font-sans">
          {overviewQuery.error?.message || "داده‌های کاربر از سرور دریافت نشد. لطفاً دوباره تلاش کنید."}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => void overviewQuery.refetch()}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            <span>تلاش مجدد</span>
          </button>
          <button
            onClick={() => router.push("/admin/users")}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-100 dark:bg-black/25 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-2xl transition-all"
          >
            <ChevronRight className="w-4 h-4" />
            <span>بازگشت به لیست کاربران</span>
          </button>
        </div>
      </div>
    );
  }

  if (!displayUser && !isLoadingOverview) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-[#1c1e26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 text-center shadow-xl animate-in fade-in duration-500" dir="rtl">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-3 font-sans">کاربر مورد نظر پیدا نشد</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-8 font-sans">
          کاربری با شناسه <span className="font-mono font-black text-red-400">{userId}</span> در سیستم وجود ندارد یا ممکن است حذف شده باشد. لطفاً شناسه را مجدداً بررسی کنید.
        </p>
        <button
          onClick={() => router.push("/admin/users")}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
        >
          <ChevronRight className="w-4 h-4" />
          <span>بازگشت به لیست کاربران</span>
        </button>
      </div>
    );
  }

  const currentUser = displayUser as User;

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-500" dir="rtl">
      {isLoadingOverview && !displayUser ? (
        <>
          <UserDetailHeaderSkeleton />
          <UserDetailTabsSkeleton />
          <UserOverviewTabSkeleton />
        </>
      ) : displayUser ? (
        <>
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 bg-white dark:bg-[#1c1e26]/80 backdrop-blur-md border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <button 
            onClick={() => router.push("/admin/users")} 
            className="group flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all bg-gray-50 dark:bg-black/25 hover:bg-gray-100 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-white/5 font-bold"
          >
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>بازگشت</span>
          </button>
          
          <div className="hidden md:block w-px h-8 bg-gray-100 dark:bg-white/5" />

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white font-sans">جزئیات حساب کاربر</h1>
            <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 px-3 py-1 rounded-xl">
              {toPersianDigits(currentUser.id)}
            </span>
            <UserStatusBadge status={currentUser.status} />
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            <Edit3 className="w-4 h-4" />
            <span>ویرایش مشخصات کاربر</span>
          </button>
        </div>
      </div>

      {/* Horizontal Tabs Menu Container */}
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-[1.5rem] p-2 mb-8 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-nowrap py-1 px-1 select-none" style={{ WebkitOverflowScrolling: "touch" }}>
          {tabsList.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/10 scale-[1.02]"
                    : "text-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                <TabIcon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Layout Area */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          isLoadingOverview ? <UserOverviewTabSkeleton /> : <UserOverviewTab user={currentUser} />
        )}
        {activeTab === "courses" && (
          <UserCoursesTab
            courses={displayedCourses}
            isLoading={isLoadingCourses}
            isError={coursesQuery.isError}
            onRetry={() => void coursesQuery.refetch()}
            showToast={showToast}
          />
        )}
        {activeTab === "transactions" && (
          <UserTransactionsTab
            transactions={displayedTransactions}
            isLoading={isLoadingTransactions}
            isError={transactionsQuery.isError}
            onRetry={() => void transactionsQuery.refetch()}
            showToast={showToast}
          />
        )}
        {activeTab === "tickets" && (
          <UserTicketsTab
            tickets={displayedTickets}
            isLoading={isLoadingTickets}
            isError={ticketsQuery.isError}
            onRetry={() => void ticketsQuery.refetch()}
            showToast={showToast}
          />
        )}
        {activeTab === "activity" && (
          <UserActivityTab
            activities={displayedActivities}
            isLoading={isLoadingActivities}
            isError={activitiesQuery.isError}
            onRetry={() => void activitiesQuery.refetch()}
          />
        )}
        {activeTab === "notes" && (
          <UserAdminNotesTab 
            notes={displayedInternalNote}
            isLoading={isLoadingNotes}
            isError={internalNoteQuery.isError}
            isSaving={updateInternalNoteMutation.isPending}
            onRetry={() => void internalNoteQuery.refetch()}
            onSaveNotes={(updatedNotes) => {
              updateInternalNoteMutation.mutate(updatedNotes, {
                onSuccess: (savedNote) => {
                  const updatedUser = { ...currentUser, internalNotes: savedNote };
                  setUser(updatedUser);
                  showToast("یادداشت داخلی با موفقیت ذخیره شد.", "success");
                },
                onError: () => {
                  showToast("ذخیره یادداشت داخلی ناموفق بود.", "error");
                },
              });
            }} 
          />
        )}
      </div>
        </>
      ) : null}

      {/* Edit User Modal Overlay */}
      <EditUserModal
        userId={userId}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
        onError={(message) => showToast(message, "error")}
      />

      {/* Dynamic Toast Notifications Overlay */}
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
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
