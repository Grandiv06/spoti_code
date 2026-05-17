import React from "react";
import { 
  X, 
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
  Edit3
} from "lucide-react";
import { User } from "./types";
import { UserStatusBadge, UserPlanBadge, UserRoleBadge } from "./Badges";
import { toPersianDigits, formatPrice, formatPhone, formatPersianDate } from "./utils";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (user: User) => void;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onEditClick,
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  // Get user initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[1][0]}`;
    }
    return name.slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto" dir="rtl">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#12141a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-300 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h2 className="text-base font-black text-gray-900 dark:text-white">جزئیات کامل حساب کاربر</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar Column - Profile Overview */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="bg-gray-50/50 dark:bg-black/15 border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${user.avatarColor || 'from-emerald-400 to-teal-600'} opacity-10 rounded-full blur-2xl -translate-x-1/3 -translate-y-1/3`} />
                
                <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${user.avatarColor || 'from-emerald-400 to-teal-600'} flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/10 mb-4`}>
                  {getInitials(user.name)}
                </div>
                
                <h3 className="text-base font-black text-gray-900 dark:text-white mb-1.5">{user.name}</h3>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <UserRoleBadge role={user.role} />
                  <UserPlanBadge plan={user.plan} />
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-bold">وضعیت حساب:</span>
                  <UserStatusBadge status={user.status} />
                </div>
              </div>

              {/* Core Information Details */}
              <div className="bg-gray-50/50 dark:bg-black/15 border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] space-y-4 text-xs font-semibold">
                <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
                  اطلاعات پایه‌ای کاربر
                </h4>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <UserIcon className="w-4 h-4" />
                    <span>شناسه کاربر</span>
                  </div>
                  <span className="font-mono bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 px-2 py-0.5 rounded-lg text-gray-500">
                    {toPersianDigits(user.id)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>شماره موبایل</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold" dir="ltr">
                    {formatPhone(user.phone)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>پست الکترونیک</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 select-all" dir="ltr">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>تاریخ عضویت</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold">
                    {formatPersianDate(user.joinedAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CreditCard className="w-4 h-4" />
                    <span>مجموع پرداختی (LTV)</span>
                  </div>
                  <span className="text-emerald-500 dark:text-emerald-400 font-black">
                    {formatPrice(user.ltv)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>تعداد دوره‌های خرید شده</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-black bg-white dark:bg-black/20 w-7 h-7 rounded-xl flex items-center justify-center border border-gray-100 dark:border-white/5">
                    {toPersianDigits(user.courses)}
                  </span>
                </div>

                {user.internalNotes && (
                  <div className="pt-3 border-t border-gray-100 dark:border-white/5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>یادداشت داخلی ادمین</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed bg-white dark:bg-black/20 p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                      {user.internalNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Main Columns - Detailed Activity and Stats */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Activity Summary Row */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>خلاصه فعالیت‌های اخیر کاربر</span>
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-white/5 p-4 rounded-2xl text-center">
                    <Clock className="w-4 h-4 mx-auto mb-2 text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-400 mb-1">آخرین ورود</p>
                    <p className="text-xs font-black text-gray-800 dark:text-white truncate">{user.lastLogin}</p>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-white/5 p-4 rounded-2xl text-center">
                    <ShoppingBag className="w-4 h-4 mx-auto mb-2 text-primary" />
                    <p className="text-[10px] font-bold text-gray-400 mb-1">کل خریدها</p>
                    <p className="text-xs font-black text-gray-800 dark:text-white">{toPersianDigits(user.purchasesCount)} بار</p>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-white/5 p-4 rounded-2xl text-center">
                    <CheckCircle className="w-4 h-4 mx-auto mb-2 text-emerald-400" />
                    <p className="text-[10px] font-bold text-gray-400 mb-1">تراکنش موفق</p>
                    <p className="text-xs font-black text-gray-800 dark:text-white">{toPersianDigits(user.successfulTransactionsCount)} موفق</p>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-white/5 p-4 rounded-2xl text-center">
                    <MessageSquare className="w-4 h-4 mx-auto mb-2 text-blue-400" />
                    <p className="text-[10px] font-bold text-gray-400 mb-1">تیکت پشتیبانی</p>
                    <p className="text-xs font-black text-gray-800 dark:text-white">{toPersianDigits(user.supportTicketsCount)} تیکت</p>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-white/5 p-4 rounded-2xl text-center col-span-2 md:col-span-1">
                    <BookOpen className="w-4 h-4 mx-auto mb-2 text-purple-400" />
                    <p className="text-[10px] font-bold text-gray-400 mb-1">آخرین دوره</p>
                    <p className="text-xs font-black text-gray-800 dark:text-white truncate" title={user.lastCourseViewed}>
                      {user.lastCourseViewed}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchased Courses Mini-list */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>دوره‌های خریداری شده و پیشرفت یادگیری</span>
                </h4>

                <div className="bg-gray-50/30 dark:bg-black/10 border border-gray-100 dark:border-white/5 rounded-3xl p-4 md:p-6 space-y-4">
                  {user.purchasedCourses.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">هیچ دوره‌ای خریداری نشده است.</p>
                  ) : (
                    user.purchasedCourses.map((c, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 py-3 first:pt-0 last:pb-0 border-b border-gray-100 dark:border-white/5 last:border-b-0">
                        <div className="flex-1">
                          <span className="text-xs font-black text-gray-900 dark:text-white block mb-1">
                            {c.name}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-400">
                            خریداری شده در تاریخ: {formatPersianDate(c.purchaseDate)}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full md:w-48 flex items-center gap-3">
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

                        {/* Course Access Status Badges */}
                        <div className="shrink-0 w-24 text-left">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-black rounded-md ${
                            c.status === "فعال" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            c.status === "دسترسی محدود" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Transactions & Tickets Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recent Transactions List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>تراکنش‌های اخیر کاربر</span>
                  </h4>
                  
                  <div className="bg-gray-50/30 dark:bg-black/10 border border-gray-100 dark:border-white/5 rounded-3xl p-4 md:p-5 space-y-3.5">
                    {user.recentTransactions.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">تراکنشی ثبت نشده است.</p>
                    ) : (
                      user.recentTransactions.map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0 first:pt-0">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-gray-400 dark:text-zinc-500 block mb-1">
                              {toPersianDigits(t.id)}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">
                              {formatPersianDate(t.date)}
                            </span>
                          </div>
                          
                          <div className="text-left">
                            <span className="font-black text-gray-900 dark:text-white block mb-1">
                              {formatPrice(t.amount)}
                            </span>
                            <span className={`inline-block text-[9px] font-bold ${
                              t.status === "موفق" ? "text-emerald-400" :
                              t.status === "در انتظار" ? "text-amber-400" :
                              "text-red-400"
                            }`}>
                              {t.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Support Tickets list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>تیکت‌های پشتیبانی اخیر</span>
                  </h4>

                  <div className="bg-gray-50/30 dark:bg-black/10 border border-gray-100 dark:border-white/5 rounded-3xl p-4 md:p-5 space-y-3.5">
                    {user.recentTickets.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">تیکتی ثبت نشده است.</p>
                    ) : (
                      user.recentTickets.map((tk, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0 first:pt-0">
                          <div className="flex-1 min-w-0 pl-3">
                            <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1 truncate" title={tk.title}>
                              {tk.title}
                            </span>
                            <span className="text-[10px] font-semibold text-gray-400">
                              {formatPersianDate(tk.date)}
                            </span>
                          </div>
                          
                          <div className="shrink-0 text-left">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black ${
                              tk.status === "باز" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                              tk.status === "در حال بررسی" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {tk.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10 shrink-0">
          <button
            onClick={() => onEditClick(user)}
            className="flex items-center gap-1.5 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            <Edit3 className="w-4 h-4" />
            <span>ویرایش مشخصات این کاربر</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
}
