"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function AuthHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 px-6 transition-all duration-300 ease-out bg-white/10 dark:bg-[#14161c]/10 backdrop-blur-[8px] border-gray-200/10 dark:border-slate-400/10 ${
        isScrolled
          ? "top-4 left-44 right-44 py-3 rounded-4xl shadow-lg border"
          : "top-0 left-0 right-0 py-6 rounded-none border-b shadow-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1.5 group">
          <Image
            src="/favicon.svg"
            alt="اسپاتی‌کد"
            width={15}
            height={15}
            className="w-8 h-8 group-hover:-rotate-45 transition-transform"
          />
          <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
            <span className="text-primary-dark/80">اسپاتی</span> کد
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-4xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all hover:scale-[1.02] active:scale-95"
          >
            صفحه اصلی
            <span className="material-symbols-outlined text-xl">home</span>
          </Link>
          <Link
            href="/"
            className="sm:hidden flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary transition-all"
            aria-label="Home"
          >
            <span className="material-symbols-outlined text-xl">home</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
