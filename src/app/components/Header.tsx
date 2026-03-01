"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";

export default function Header() {
  const { cart, toggleCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = loginRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLoginMousePos({ x, y });
  };

  const menuItems = [
    { label: "خانه", href: "/" },
    { label: "دوره‌ها", href: "/courses" },
    { label: "مسیر یادگیری", href: "/learning-path" },
    { label: "اسپاتی هاب", href: "/social" },
  ];

  return (
    <header
      className={`fixed z-50 px-6 transition-all duration-300 ease-out bg-white/10 dark:bg-[#14161c]/10 backdrop-blur-[8px] border-gray-200/10 dark:border-slate-400/10 ${
        isScrolled
          ? "top-4 left-44 right-44 py-3 rounded-4xl shadow-lg border"
          : "top-0 left-0 right-0 py-6 rounded-none border-b shadow-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-1.5 group">
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

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 ">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={item.href === "/social" ? pathname?.startsWith("/social") : item.href === "/learning-path" ? pathname?.startsWith("/learning-path") : pathname === item.href}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
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
          <ThemeToggle />
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
                <span className="material-symbols-outlined text-xl">person</span>
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
                <span className="material-symbols-outlined relative z-10 text-xl">login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 p-4 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-2 flex flex-col gap-1">
              {menuItems.map((item) => {
                const isActive = item.href === "/social" ? pathname?.startsWith("/social") : item.href === "/learning-path" ? pathname?.startsWith("/learning-path") : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    className={`px-6 py-4 text-sm font-bold rounded-2xl transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    {isActive && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </Link>
                );
              })}
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>
              <Link
                className={`px-6 py-4 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  isAuthenticated
                    ? "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    : "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20"
                }`}
                href={isAuthenticated ? "/panel" : "/login"}
                onClick={() => setIsMenuOpen(false)}
              >
                {isAuthenticated ? (
                  <>
                    <span className="material-symbols-outlined text-lg">person</span>
                    پنل کاربری
                  </>
                ) : (
                  "ورود / ثبت‌نام"
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
