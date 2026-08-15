"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  Headphones,
  Home,
  LogOut,
  ReceiptText,
  Settings,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePrefetchPanelMyCourses } from "@/hooks/api/usePanelMyCourses";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/panel", label: "داشبورد", icon: Home },
  { href: "/panel/courses", label: "دوره‌های من", icon: GraduationCap },
  { href: "/panel/transactions", label: "تراکنش‌ها", icon: ReceiptText },
  { href: "/panel/support", label: "پشتیبانی", icon: Headphones },
  { href: "/panel/profile", label: "پروفایل", icon: User },
  { href: "/panel/settings", label: "تنظیمات", icon: Settings },
];

export default function PanelSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const prefetchMyCourses = usePrefetchPanelMyCourses();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <aside className="hidden lg:flex h-full w-72 shrink-0 bg-white dark:bg-[#14161c] border-l border-gray-200/70 dark:border-white/5 flex-col">
        <div className="relative p-6 flex items-center justify-center border-b border-gray-200/70 dark:border-white/5 min-h-24 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <Image
              src="/favicon.svg"
              alt="اسپاتی‌کد"
              width={48}
              height={48}
              className="h-12 w-auto object-contain transition-transform duration-500 group-hover:-rotate-45"
            />
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                <span className="text-primary">اسپاتی</span> کد
              </span>
              <span className="text-[10px] text-primary tracking-widest uppercase font-bold">
                Coding Academy
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 flex flex-col p-4 overflow-y-auto min-h-0">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/panel"
                  ? pathname === "/panel"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => {
                    if (item.href === "/panel/courses") prefetchMyCourses();
                  }}
                  onFocus={() => {
                    if (item.href === "/panel/courses") prefetchMyCourses();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ring-0 hover:ring-0",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 font-bold shadow-[0_0_15px_rgba(34,197,94,0.12)]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 border border-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-primary"
                        : "text-gray-400 dark:text-slate-500",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-8 mt-auto border-t border-gray-200/70 dark:border-white/5 shrink-0">
            <button
              onClick={() => setShowLogout(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors font-medium cursor-pointer w-fit outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 border border-transparent"
            >
              <LogOut className="w-5 h-5" />
              خروج از حساب
            </button>
          </div>
        </nav>
      </aside>

      {showLogout && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          dir="rtl"
        >
          <button
            className="absolute inset-0 bg-black/60 cursor-pointer"
            onClick={() => setShowLogout(false)}
            aria-label="بستن مودال خروج"
          />
          <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1c1e26] p-6 shadow-2xl">
            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">
              خروج از حساب کاربری
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-5 leading-relaxed">
              آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-white/20 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black cursor-pointer"
              >
                تایید خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
