"use client";

import ThemeToggle from "@/app/components/ThemeToggle";

export default function PanelHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#14161c]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        پنل کاربری
      </h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-3 pl-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold overflow-hidden">
                {/* Placeholder for user avatar */}
                <span className="material-symbols-outlined text-2xl">person</span>
            </div>
            <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">کاربر مهمان</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">09123456789</p>
            </div>
        </div>
      </div>
    </header>
  );
}
