"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function AuthHeader() {
  return (
    <header className="w-full relative z-50 py-4 px-6 glass-header border-b border-white/20 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined font-bold">terminal</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
            اسپاتی<span className="text-primary">کد</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/" 
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-all hover:scale-[1.02] active:scale-95"
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
      </div>
    </header>
  );
}
