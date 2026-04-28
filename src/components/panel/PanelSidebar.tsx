"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePanelSidebar } from "@/context/PanelSidebarContext";
import { useSocial } from "@/context/SocialContext";
import { cn } from "@/lib/utils";
import { User, LogOut, X, ChevronRight, ChevronLeft } from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "spoticode-sidebar-collapsed";

const menuItems = [
  { label: "داشبورد", href: "/panel", icon: "dashboard" },
  { label: "دوره‌های من", href: "/panel/courses", icon: "school" },
  { label: "اسپاتی هاب", href: "/social", icon: "hub" },
  { label: "اعلان‌ها", href: "/panel/notifications", icon: "notifications" },
  { label: "تراکنش‌ها", href: "/panel/transactions", icon: "receipt_long" },
  { label: "پروفایل", href: "/panel/profile", icon: "person" },
  { label: "تنظیمات", href: "/panel/settings", icon: "settings" },
];

export default function PanelSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { notifications } = useSocial();
  const { isMobileOpen, setMobileOpen, isCollapsed, setIsCollapsed, toggleCollapsed } = usePanelSidebar();
  const unreadNotifications = notifications?.filter((n) => !n.isRead).length ?? 0;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored !== null) setIsCollapsed(stored === "true");
    } catch {}
  }, [setIsCollapsed]);

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
    } catch {}
    toggleCollapsed();
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
          className="fixed inset-0 bg-black/50 z-[40] lg:hidden cursor-pointer"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed top-0 h-full z-[50] transition-all duration-500 ease-in-out",
          "right-0",
          isCollapsed ? "w-[294px] lg:w-[100px]" : "w-[294px]",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "h-full flex flex-col shadow-lg border p-2 transition-all duration-300 relative",
            "rounded-l-[40px]",
            "bg-gray-100/80 dark:bg-[#0B0D11]/30 border-gray-200/50 dark:border-white/5 backdrop-blur-md"
          )}
        >
          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            onClick={handleToggleCollapse}
            className="hidden lg:flex absolute -left-4 top-12 z-[60] w-8 h-8 items-center justify-center rounded-full bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-white/10 shadow-md text-gray-600 dark:text-gray-300 hover:text-primary transition-all cursor-pointer group"
          >
            {isCollapsed ? (
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            ) : (
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>

          {/* Mobile Close */}
          <button
            onClick={closeMobile}
            className="lg:hidden absolute right-4 top-4 z-10 p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="بستن منو"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className={cn("flex justify-center pt-6 pb-4 transition-all duration-300", isCollapsed ? "px-0" : "px-4")}>
            <Link href="/" className="flex items-center gap-2 group cursor-pointer" onClick={closeMobile}>
              <Image
                src="/favicon.svg"
                alt="اسپاتی‌کد"
                width={48}
                height={48}
                className={cn("transition-all duration-500 group-hover:-rotate-45", isCollapsed ? "w-12 h-12" : "w-12 h-12")}
              />
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white whitespace-nowrap">
                  <span className="text-primary">اسپاتی</span> کد
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Card */}
          <div className={cn("mb-4 transition-all duration-300 flex justify-center", isCollapsed ? "px-0" : "px-4")}>
            <div className={cn(
              "rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 transition-all duration-300 flex items-center justify-center overflow-hidden",
              isCollapsed ? "w-14 h-14 p-0" : "w-full p-4"
            )}>
              <div className={cn(
                "flex items-center w-full",
                isCollapsed ? "justify-center" : "flex-row-reverse gap-3"
              )}>
                <div className={cn(
                  "rounded-full border-2 border-primary/50 overflow-hidden flex items-center justify-center bg-primary/10 dark:bg-primary/20 shrink-0 transition-all duration-300",
                  isCollapsed ? "w-12 h-12" : "w-14 h-14"
                )}>
                  {user?.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="" width={56} height={56} className="object-cover w-full h-full" />
                  ) : (
                    <User className={cn("text-primary transition-all", isCollapsed ? "w-6 h-6" : "w-7 h-7")} strokeWidth={2} />
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col items-end min-w-0 flex-1 overflow-hidden transition-all duration-300 opacity-100">
                    <p className="text-base font-bold text-gray-900 dark:text-white truncate w-full text-right">
                      {user?.displayName || "کاربر مهمان"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate w-full text-right">
                      {user?.phone || "۰۹۱۲۳۴۵۶۷۸۹"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className={cn("flex-1 overflow-y-auto py-4 space-y-3 scrollbar-hide flex flex-col items-center", isCollapsed ? "px-2" : "px-4")} dir="rtl">
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
                    "group relative flex items-center transition-all duration-300 cursor-pointer",
                    isCollapsed 
                      ? "w-12 h-12 justify-center rounded-2xl" 
                      : "w-full min-h-[48px] py-3.5 px-4 rounded-[14px] justify-start text-right gap-3",
                    isActive
                      ? "bg-white dark:bg-white text-primary dark:text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white",
                    isActive && !isCollapsed && "before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-[60%] before:h-[5px] before:rounded-t-full before:bg-primary"
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
                      <span className={cn(
                        "absolute flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-[#0B0D11]",
                        isCollapsed ? "-top-2 -right-2" : "-top-1 -right-1"
                      )}>
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </span>
                    )}
                  </span>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    <span className={cn("truncate font-medium whitespace-nowrap px-2", isActive && "font-semibold")}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className={cn("pb-4 transition-all duration-300 flex flex-col items-center", isCollapsed ? "px-0" : "px-4")}>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center bg-primary hover:bg-primary-hover text-white transition-all cursor-pointer shadow-lg shadow-primary/20",
                isCollapsed 
                  ? "w-12 h-12 justify-center rounded-2xl" 
                  : "w-full min-h-[52px] py-3.5 px-4 rounded-[14px] justify-center gap-2"
              )}
              aria-label="خروج"
            >
              <LogOut size={isCollapsed ? 24 : 20} strokeWidth={2} />
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <span className="whitespace-nowrap text-sm font-bold px-2">خروج از پنل کاربری</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
