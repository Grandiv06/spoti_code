"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "خانه", href: "/" },
    { label: "دوره‌ها", href: "/courses" },
    { label: "مسیر یادگیری", href: "/learning-path" },
    { label: "درباره ما", href: "/about" },
    { label: "ارتباط با ما", href: "/contact" },
  ];

  return (
    <header
      className={`fixed z-50 px-6 transition-all duration-300 ease-out bg-white/95 dark:bg-[#14161c]/10 backdrop-blur-[8px] border-gray-200 dark:border-slate-400/10 ${
        isScrolled
          ? "top-4 left-30 right-30 py-3 rounded-3xl shadow-lg border"
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
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  className={`px-5 py-2 text-sm font-medium rounded-4xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            className="hidden md:flex bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-4xl text-sm font-bold transition-all shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 items-center gap-2"
            href="/login"
          >
            ورود / ثبت‌نام
            <span className="material-symbols-outlined text-xl">login</span>
          </Link>

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
                const isActive = pathname === item.href;
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
                className="px-6 py-4 text-sm font-bold bg-primary text-white text-center rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-colors"
                href="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                ورود / ثبت‌نام
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
