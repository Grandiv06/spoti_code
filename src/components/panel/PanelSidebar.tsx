"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
  { label: "داشبورد", href: "/panel", icon: "dashboard" },
  { label: "دوره‌های من", href: "/panel/courses", icon: "school" },
  { label: "تراکنش‌ها", href: "/panel/transactions", icon: "receipt_long" }, // Adding extra for completeness
  { label: "پروفایل", href: "/panel/profile", icon: "person" },
];

export default function PanelSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white dark:bg-[#1c1e26] border-l border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
           <Image
              src="/favicon.svg"
              alt="اسپاتی‌کد"
              width={32}
              height={32}
              className="w-8 h-8 group-hover:-rotate-45 transition-transform"
            />
            <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
              <span className="text-primary-dark/80">اسپاتی</span> کد
            </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary font-bold shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white font-medium"
              }`}
            >
              <span
                className={`material-symbols-outlined text-2xl transition-colors ${
                  isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
        
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium">
             <span className="material-symbols-outlined text-2xl">logout</span>
             <span>خروج</span>
          </button>
      </div>
    </aside>
  );
}
