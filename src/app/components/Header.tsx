"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "خانه", href: "/" },
    { label: "دوره‌ها", href: "/courses" },
    { label: "مسیر یادگیری", href: "/learning-path" },
    { label: "درباره ما", href: "/about" },
    { label: "ارتباط با ما", href: "/contact" },
  ];

  return (
    <nav className="relative z-50 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
          <span className="material-icons-round text-2xl">code</span>
        </div>
        <span className="text-xl font-bold tracking-tight">آکادمی کد</span>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md px-2 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            className="px-5 py-2 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Login & Register - Desktop */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg items-center gap-2 flex"
          href="/login"
        >
          <span className="material-icons-round text-base">person</span>
          ورود / ثبت‌نام
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-lg bg-white dark:bg-surface-dark shadow-sm"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="material-icons-round">
          {isMenuOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-6 bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden md:hidden">
          <div className="flex flex-col">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                className="px-6 py-4 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="px-6 py-4 text-sm font-bold bg-primary text-white text-center"
              href="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              ورود / ثبت‌نام
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
