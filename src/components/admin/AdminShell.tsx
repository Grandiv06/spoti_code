"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/courses", label: "دوره‌ها", icon: BookOpen },
  { href: "/admin/orders", label: "سفارش‌ها", icon: CreditCard },
  { href: "/admin/content", label: "محتوا", icon: FileText },
  { href: "/admin/reports", label: "گزارش‌ها", icon: BarChart3 },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#14161c] text-gray-900 dark:text-white" dir="rtl">
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-[290px] border-l border-gray-200/50 bg-gray-100/80 p-2 backdrop-blur-md rounded-l-[40px] transition-transform dark:border-white/5 dark:bg-[#0B0D11]/30",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2 text-primary dark:bg-primary/20 dark:text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-bold">Admin Console</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/5">
          <p className="text-xs text-gray-500 dark:text-gray-400">وارد شده به عنوان</p>
          <p className="mt-1 text-sm font-bold">{user?.displayName || "ادمین"}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{user?.phone}</p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const ActiveIcon = item.icon;
            const isActive = item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
                )}
              >
                <ActiveIcon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover dark:bg-primary dark:text-white dark:hover:bg-primary-hover"
          >
            <LogOut className="h-4 w-4" />
            خروج از ادمین
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className="relative lg:mr-[290px]">
        <header className="sticky top-0 z-20 border-b border-gray-200/50 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-white/5 dark:bg-[#0B0D11]/80 md:px-6">
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => setOpen(true)} className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-white/10 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-black">پنل مدیریت اسپاتی‌کد</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">مدیریت کاربران، فروش، محتوای آموزشی و گزارش‌ها</p>
            </div>
            <Link
              href="/panel"
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-white/10"
            >
              مشاهده پنل کاربر
            </Link>
          </div>
        </header>

        <main className="relative p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
