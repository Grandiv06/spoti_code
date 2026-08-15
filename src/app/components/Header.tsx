"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";

export default function Header() {
  const { cart, toggleCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginMousePos, setLoginMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const [cartMousePos, setCartMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const pathname = usePathname();

  const handleCartMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCartMousePos({ x, y });
  };

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // قفل اسکرول صفحه وقتی منو باز است
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLoginMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = loginRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLoginMousePos({ x, y });
  };

  const menuItems = [
    { label: "خانه", href: "/", icon: "home" },
    { label: "دوره‌ها", href: "/courses", icon: "school" },
    { label: "مسیر یادگیری", href: "/learning-path", icon: "route" },
  ];

  const panelHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "instructor"
        ? "/instructor/dashboard"
        : "/panel";

  const isItemActive = (href: string) =>
    href === "/learning-path"
      ? Boolean(pathname?.startsWith("/learning-path"))
      : pathname === href;

  const renderCartButton = (className = "") => {
    if (cart.length === 0) return null;

    return (
      <button
        onClick={toggleCart}
        onMouseMove={handleCartMouseMove}
        onMouseLeave={() => setCartMousePos(null)}
        className={`relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 dark:bg-[#14161c]/10 backdrop-blur-xl border border-white/15 dark:border-white/[0.04] hover:bg-white/30 dark:hover:bg-[#14161c]/20 transition-colors duration-300 cursor-pointer overflow-visible ${className}`}
        aria-label="سبد خرید"
      >
        {cartMousePos && (
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              background: `radial-gradient(circle 35px at ${cartMousePos.x}% ${cartMousePos.y}%, rgba(34, 197, 94, 0.12) 0%, transparent 70%)`,
            }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">shopping_cart</span>
        </span>
        <span className="absolute -top-1 -right-1 z-20 min-w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#14161c] leading-[0] tabular-nums [font-family:ui-sans-serif,system-ui,sans-serif]">
          {cart.length}
        </span>
      </button>
    );
  };

  return (
    <header
      className={`fixed z-50 px-4 md:px-6 transition-all duration-300 ease-out bg-white/10 dark:bg-[#14161c]/10 backdrop-blur-[8px] border-gray-200/10 dark:border-slate-400/10 ${
        isScrolled
          ? "top-2 md:top-4 left-4 right-4 md:left-44 md:right-44 py-3 rounded-4xl md:rounded-4xl shadow-lg border"
          : "top-0 left-0 right-0 py-4 md:py-6 rounded-none border-b shadow-sm"
      } ${isMenuOpen ? "opacity-0 pointer-events-none" : ""} lg:!opacity-100 lg:!pointer-events-auto`}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center relative flex-row-reverse lg:flex-row">
        {renderCartButton("lg:hidden absolute left-0 z-20")}

        {/* دسکتاپ: لوگو و منو */}
        <div className="flex items-center gap-10">
          <Link href="/" className="hidden lg:flex items-center gap-1.5 group">
            <Image
              src="/favicon.svg"
              alt="اسپاتی‌کد"
              width={15}
              height={15}
              className="w-8 h-8 group-hover:-rotate-45 transition-transform"
            />
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white  group-hover:scale-105 transition-transform duration-300">
              <span className="text-primary-dark/80">اسپاتی</span> کد
            </span>
          </Link>

          {/* موبایل: لوگو وسط‌چین */}
          <Link href="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 group">
            <Image
              src="/favicon.svg"
              alt="اسپاتی‌کد"
                width={36}
                height={36}
                className="w-8 h-8 md:w-9 md:h-9 lg:group-hover:-rotate-45 transition-transform"
              />
              <span className="text-xl md:text-2xl font-black tracking-tighter text-gray-900 dark:text-white lg:group-hover:scale-105 transition-transform duration-300">
                <span className="text-primary-dark/80">اسپاتی</span> کد
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 ">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={
                  item.href === "/social"
                    ? pathname?.startsWith("/social")
                    : item.href === "/learning-path"
                      ? pathname?.startsWith("/learning-path")
                      : pathname === item.href
                }
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-row-reverse lg:flex-row">
          {renderCartButton("hidden lg:flex")}
          <div className="hidden lg:flex">
            <ThemeToggle />
          </div>
          <div
            ref={loginRef}
            onMouseMove={handleLoginMouseMove}
            onMouseLeave={() => setLoginMousePos(null)}
            className="hidden md:block relative"
          >
            {isAuthenticated ? (
              <Link
                href={user?.role === "admin" ? "/admin" : user?.role === "instructor" ? "/instructor/dashboard" : "/panel"}
                title="پنل کاربری"
                className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 dark:bg-[#14161c]/10 backdrop-blur-xl border border-white/15 dark:border-white/[0.04] hover:bg-white/30 dark:hover:bg-[#14161c]/20 transition-colors duration-300 overflow-visible text-gray-700 dark:text-gray-300 hover:text-primary"
              >
                <span className="material-symbols-outlined text-xl">
                  person
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="relative flex items-center justify-center gap-2 rounded-4xl px-8 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden bg-primary/85 dark:bg-primary/80 backdrop-blur-xl border border-white/25 dark:border-white/15 shadow-xl shadow-primary/25 hover:bg-primary dark:hover:bg-primary-hover"
              >
                {loginMousePos && (
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(circle 60px at ${loginMousePos.x}% ${loginMousePos.y}%, rgba(255,255,255,0.2) 0%, transparent 70%)`,
                    }}
                  />
                )}
                <span className="relative z-10">ورود</span>
                <span className="material-symbols-outlined relative z-10 text-xl">
                  login
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - استایل مشابه ThemeToggle */}
          <button
            className="lg:hidden relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 dark:bg-[#14161c]/10 backdrop-blur-xl border border-white/15 dark:border-white/[0.04] hover:bg-white/30 dark:hover:bg-[#14161c]/20 transition-colors duration-300 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="منو"
          >
            <span className="material-symbols-outlined text-xl">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Drawer - با Portal در body تا درست نمایش داده شود */}
        {isMounted &&
          typeof document !== "undefined" &&
          createPortal(
            <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}>
              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              {/* Drawer */}
              <div
                className={`absolute top-0 right-0 bottom-0 z-[70] flex h-[100dvh] w-[min(288px,86%)] flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                role="dialog"
                aria-label="منو"
              >
                <div className="flex h-full flex-col rounded-l-[2rem] border-l border-gray-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#14161c]/98">
                  <div className="shrink-0 border-b border-gray-200/70 px-4 pb-4 pt-[max(0.9rem,env(safe-area-inset-top))] dark:border-white/[0.06]">
                    <div className="mb-4 flex items-center justify-between">
                      <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2"
                      >
                        <Image
                          src="/favicon.svg"
                          alt="اسپاتی‌کد"
                          width={28}
                          height={28}
                          className="size-7"
                        />
                        <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                          <span className="text-primary-dark/80 dark:text-primary">اسپاتی</span> کد
                        </span>
                      </Link>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="flex size-10 items-center justify-center rounded-2xl border border-white/15 bg-white/20 text-gray-600 backdrop-blur-xl transition-colors hover:bg-white/30 dark:border-white/[0.04] dark:bg-[#14161c]/10 dark:text-gray-300 dark:hover:bg-[#14161c]/20"
                        aria-label="بستن منو"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-2xl border border-gray-200/70 bg-gray-50/80 px-2 py-1.5 dark:border-white/[0.06] dark:bg-white/[0.04]">
                      <div className="flex min-w-0 items-center gap-2 px-2">
                        <span className="material-symbols-outlined text-[18px] text-primary/70">calendar_today</span>
                        <span className="truncate text-[12px] font-bold text-gray-600 dark:text-gray-300">
                          {new Date().toLocaleDateString("fa-IR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>

                  <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                      {menuItems.map((item) => {
                        const isActive = isItemActive(item.href);
                        return (
                          <li key={item.href}>
                            <Link
                              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold transition-all ${
                                isActive
                                  ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                                  : "text-gray-700 hover:bg-gray-100/80 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                              }`}
                              href={item.href}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span
                                className={`material-symbols-outlined text-[22px] ${
                                  isActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                {item.icon}
                              </span>
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="shrink-0 border-t border-gray-200/70 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-white/[0.06]">
                    <Link
                      href={isAuthenticated ? panelHref : "/login"}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex w-full items-center justify-between rounded-[1.35rem] px-4 py-3.5 text-[14px] font-black transition-all active:scale-[0.98] ${
                        isAuthenticated
                          ? "border border-white/15 bg-white/20 text-gray-800 backdrop-blur-xl dark:border-white/[0.04] dark:bg-[#14161c]/10 dark:text-white"
                          : "border border-white/25 bg-primary text-white shadow-lg shadow-primary/25 dark:border-white/15 dark:bg-primary/90"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">
                          {isAuthenticated ? "person" : "login"}
                        </span>
                        {isAuthenticated ? "پنل کاربری" : "ورود به حساب"}
                      </span>
                      <span
                        className={`flex size-8 items-center justify-center rounded-xl ${
                          isAuthenticated
                            ? "bg-white/60 dark:bg-white/10"
                            : "bg-white/20"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] rtl:rotate-180">
                          east
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </nav>
    </header>
  );
}
