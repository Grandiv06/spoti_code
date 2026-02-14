"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePanelSidebar } from "@/context/PanelSidebarContext";
import { useSocial } from "@/context/SocialContext";
import { cn } from "@/lib/utils";
import { User, LogOut, X } from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "spoticode-sidebar-collapsed";

const menuItems = [
  { label: "داشبورد", href: "/panel", icon: "dashboard" },
  { label: "دوره‌های من", href: "/panel/courses", icon: "school" },
  { label: "اسپاتی هاب", href: "/social", icon: "hub" },
  { label: "اعلان‌ها", href: "/panel/notifications", icon: "notifications" },
  { label: "تراکنش‌ها", href: "/panel/transactions", icon: "receipt_long" },
  { label: "پروفایل", href: "/panel/profile", icon: "person" },
];

export default function PanelSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { notifications } = useSocial();
  const { isMobileOpen, setMobileOpen } = usePanelSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const unreadNotifications = notifications?.filter((n) => !n.isRead).length ?? 0;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored !== null) setIsCollapsed(stored === "true");
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed top-0 h-full z-[50] w-[294px] max-w-[85vw] transition-all duration-500 ease-in-out",
          "right-0",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "h-full flex flex-col shadow-lg border p-2 transition-colors duration-300",
            "rounded-l-[40px]",
            "bg-gray-100/80 dark:bg-[#0B0D11]/30 border-gray-200/50 dark:border-white/5 backdrop-blur-md"
          )}
        >
          {/* Mobile Close */}
          <button
            onClick={closeMobile}
            className="lg:hidden absolute right-4 top-4 z-10 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
            aria-label="بستن منو"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex justify-center pt-6 pb-4">
            <Link href="/" className="flex items-center gap-2 group" onClick={closeMobile}>
              <Image
                src="/favicon.svg"
                alt="اسپاتی‌کد"
                width={48}
                height={48}
                className="w-12 h-12 group-hover:-rotate-45 transition-transform"
              />
              <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
                <span className="text-primary">اسپاتی</span> کد
              </span>
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="px-4 mb-4">
            <div className="rounded-xl p-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5">
              <div className="flex flex-row-reverse items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full border-2 border-primary/50 overflow-hidden flex items-center justify-center bg-primary/10 dark:bg-primary/20 shrink-0">
                  {user?.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="" width={56} height={56} className="object-cover w-full h-full" />
                  ) : (
                    <User className="w-7 h-7 text-primary" strokeWidth={2} />
                  )}
                </div>
                <div className="flex flex-col items-end min-w-0 flex-1">
                  <p className="text-base font-bold text-gray-900 dark:text-white truncate w-full text-right">
                    {user?.displayName || "کاربر مهمان"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate w-full text-right">
                    {user?.phone || "۰۹۱۲۳۴۵۶۷۸۹"}
                  </p>
                </div>
              </div>
              <div className="flex flex-row-reverse items-center justify-between gap-2">
                <Link
                  href="/panel/profile"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 rounded-[14px] py-2 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors"
                >
                  تنظیمات حساب
                </Link>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 overflow-y-auto py-4 space-y-3" dir="rtl">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/social" ? pathname?.startsWith("/social") : pathname === item.href;
              const showBadge = item.href === "/panel/notifications" && unreadNotifications > 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={cn(
                    "group relative flex items-center gap-3 py-3.5 px-4 rounded-[14px] transition-all duration-200 w-full min-h-[48px]",
                    "justify-start text-right",
                    isActive
                      ? "bg-white dark:bg-white text-primary dark:text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white",
                    isActive && "before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-[60%] before:h-[5px] before:rounded-t-full before:bg-primary"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-xl shrink-0 transition-transform relative",
                      isActive ? "scale-110 text-primary" : "group-hover:scale-105"
                    )}
                  >
                    {item.icon}
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-[#0B0D11]">
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </span>
                  <span className={cn("truncate font-medium", isActive && "font-semibold")}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 pb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors"
              aria-label="خروج"
            >
              <LogOut size={18} strokeWidth={1.5} />
              <span>خروج از پنل کاربری</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
