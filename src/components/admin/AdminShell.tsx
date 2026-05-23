"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: "dashboard" },
  { href: "/admin/users", label: "کاربران", icon: "group" },
  { href: "/admin/courses", label: "دوره‌ها", icon: "school" },
  { href: "/admin/discount-codes", label: "کدهای تخفیف", icon: "sell" },
  { href: "/admin/orders", label: "سفارش‌ها", icon: "receipt_long" },
  { href: "/admin/tickets", label: "تیکت‌ها", icon: "support_agent" },
  { href: "/admin/settings", label: "تنظیمات", icon: "settings" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#14161c] text-gray-900 dark:text-white" dir="rtl">
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden cursor-pointer"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-[294px] transition-all duration-500 ease-in-out",
          "rounded-l-[40px] border-l border-gray-200/50 dark:border-white/5 bg-gray-100/80 dark:bg-[#0B0D11]/30 backdrop-blur-md p-2 flex flex-col",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile Close */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute left-4 top-4 z-10 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo Section */}
        <div className="flex justify-center pt-6 pb-6 px-4">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <Image
              src="/favicon.svg"
              alt="اسپاتی‌کد"
              width={36}
              height={36}
              className="transition-all duration-500 group-hover:-rotate-45"
            />
            <div className="overflow-hidden transition-all duration-300">
              <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white whitespace-nowrap">
                <span className="text-primary">اسپاتی</span> کد
              </span>
            </div>
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="px-4 mb-4">
          <div className="rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 p-4 flex flex-row-reverse items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-primary/50 overflow-hidden flex items-center justify-center bg-primary/10 dark:bg-primary/20 shrink-0">
              {user?.avatarUrl ? (
                <Image src={user.avatarUrl} alt="" width={48} height={48} className="object-cover w-full h-full" />
              ) : (
                <User className="text-primary w-6 h-6" strokeWidth={2} />
              )}
            </div>
            <div className="flex flex-col items-end min-w-0 flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate w-full text-right">
                {user?.displayName || "ادمین تست"}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full text-right">
                {user?.phone || "۰۹۱۲۳۴۵۶۷۸۹"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide flex flex-col" dir="rtl">
          {navItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group relative flex items-center py-3.5 px-4 rounded-[14px] transition-all duration-300 cursor-pointer gap-3",
                  isActive
                    ? "bg-white dark:bg-white text-primary dark:text-primary shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white",
                  isActive && "before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-[60%] before:h-[5px] before:rounded-t-full before:bg-primary"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[12px] shrink-0 transition-all",
                    isActive ? "scale-110 text-primary" : "group-hover:scale-110"
                  )}
                >
                  {item.icon}
                </span>
                <span className={cn("font-medium whitespace-nowrap px-2", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-6 mt-auto">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-[14px] bg-primary text-white hover:bg-primary-hover transition-all cursor-pointer shadow-lg shadow-primary/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="whitespace-nowrap text-sm font-bold">خروج از ادمین</span>
          </button>
        </div>
      </aside>

      <div className="relative lg:mr-[294px]">
        <header className="sticky top-0 z-20 border-b border-gray-200/50 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-white/5 dark:bg-[#14161c]/80 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setOpen(true)} className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-white/10 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-black text-gray-900 dark:text-white">پنل مدیریت اسپاتی‌کد</h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">مدیریت کاربران، فروش و محتوای آموزشی</p>
              </div>
            </div>
            <Link
              href="/panel"
              className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[10px] font-black text-gray-700 dark:text-gray-200 hover:border-primary transition-all"
            >
              مشاهده پنل کاربر
            </Link>
          </div>
        </header>

        <main className="relative p-6 md:p-8">{children}</main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" dir="rtl">
          <button className="absolute inset-0 bg-black/60" onClick={() => setShowLogoutModal(false)} aria-label="بستن مودال خروج" />
          <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1c1e26] p-6 shadow-2xl">
            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">خروج از حساب کاربری</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-5 leading-relaxed">آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowLogoutModal(false)} className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-white/20">
                انصراف
              </button>
              <button type="button" onClick={handleLogout} className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black">
                تایید خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
