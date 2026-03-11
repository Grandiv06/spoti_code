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
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginMousePos, setLoginMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLButtonElement>(null);
  const [cartMousePos, setCartMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const pathname = usePathname();

  const handleCartMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = cartRef.current?.getBoundingClientRect();
    if (!rect) return;
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
    { label: "اسپاتی هاب", href: "/social", icon: "tag" },
  ];

  return (
    <header
      className={`fixed z-50 px-4 md:px-6 transition-all duration-300 ease-out bg-white/10 dark:bg-[#14161c]/10 backdrop-blur-[8px] border-gray-200/10 dark:border-slate-400/10 ${
        isScrolled
          ? "top-2 md:top-4 left-4 right-4 md:left-44 md:right-44 py-3 rounded-4xl md:rounded-4xl shadow-lg border"
          : "top-0 left-0 right-0 py-4 md:py-6 rounded-none border-b shadow-sm"
      } ${isMenuOpen ? "opacity-0 pointer-events-none" : ""} lg:!opacity-100 lg:!pointer-events-auto`}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center relative flex-row-reverse lg:flex-row">
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
          {cart.length > 0 && (
            <button
              ref={cartRef}
              onClick={toggleCart}
              onMouseMove={handleCartMouseMove}
              onMouseLeave={() => setCartMousePos(null)}
              className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 dark:bg-[#14161c]/10 backdrop-blur-xl border border-white/15 dark:border-white/[0.04] hover:bg-white/30 dark:hover:bg-[#14161c]/20 transition-colors duration-300 cursor-pointer overflow-visible"
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
                <span className="material-symbols-outlined text-xl">
                  shopping_cart
                </span>
              </span>
              <span className="absolute -top-1 -right-1 z-20 min-w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#14161c] leading-[0] tabular-nums [font-family:ui-sans-serif,system-ui,sans-serif]">
                {cart.length}
              </span>
            </button>
          )}
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
                href="/panel"
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
                <span className="relative z-10">ورود / ثبت‌نام</span>
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
                className={`absolute top-0 right-0 bottom-0 z-[70] w-[min(320px,100%)] h-[100dvh] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                role="dialog"
                aria-label="منو"
              >
                {/* پنل سالید برای پرفورمنس بهتر در موبایل */}
                <div
                  className="h-full rounded-l-[2rem] flex flex-col shadow-2xl border-l p-2 bg-white border-gray-100 dark:bg-[#111216] dark:border-white/5"
                >
                {/* Farmeto "Gold Standard" Header */}
                <div className="flex flex-col p-4 shrink-0 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#111216] rounded-tl-[2rem]">
                  {/* Row 1: Logo & Close */}
                  <div className="flex items-center justify-between mb-4">
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
                      />
                      <span className="text-xl font-black text-gray-900 dark:text-white">
                        <span className="text-primary">اسپاتی</span> کد
                      </span>
                    </Link>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="flex size-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10 dark:hover:text-white transition-colors"
                      aria-label="بستن منو"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  {/* Row 2: Date & Theme Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-2 rounded-[2rem]">
                    <div className="flex items-center gap-2 px-3">
                      <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        {new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <div className="bg-white dark:bg-white/5 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/10 p-0.5">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="px-4 py-6 flex flex-col gap-1.5 flex-1 overflow-y-auto">
                  {menuItems.map((item) => {
                    const isActive =
                      item.href === "/social"
                        ? pathname?.startsWith("/social")
                        : item.href === "/learning-path"
                          ? pathname?.startsWith("/learning-path")
                          : pathname === item.href;
                            
                    return (
                      <Link
                        key={item.href}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-[15px] ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                        }`}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                      >
                         <span className={`material-symbols-outlined text-[22px] ${isActive ? "text-primary fill-current" : "text-gray-400 dark:text-gray-500"}`}>
                           {item.icon}
                         </span>
                         {item.label}
                      </Link>
                    );
                  })}
                </div>
                {/* Auth Footer */}
                <div className="shrink-0 p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                  <Link
                    href={isAuthenticated ? "/panel" : "/login"}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between w-full px-5 py-4 rounded-[2rem] font-bold text-[15px] transition-transform active:scale-[0.98] ${
                      isAuthenticated
                        ? "bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                       {isAuthenticated ? "پنل کاربری" : "ورود به حساب"}
                    </span>
                    <div className={`w-8 h-8 rounded-[1rem] flex items-center justify-center ${isAuthenticated ? "bg-white dark:bg-black/20" : "bg-white/20 dark:bg-black/10"}`}>
                       <span className="material-symbols-outlined text-[18px] rtl:rotate-180">east</span>
                    </div>
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
