"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginMousePos, setLoginMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
    { label: "درباره ما", href: "/about" },
    { label: "ارتباط با ما", href: "/contact" },
  ];

  return (
    <header
      className={`fixed z-50 px-6 transition-all duration-300 ease-out bg-white/10 dark:bg-[#14161c]/10 backdrop-blur-[8px] border-gray-200/10 dark:border-slate-400/10 ${
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
          <div className="hidden lg:flex items-center gap-1 ">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div
            ref={loginRef}
            onMouseMove={handleLoginMouseMove}
            onMouseLeave={() => setLoginMousePos(null)}
            className="hidden md:block relative"
          >
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
