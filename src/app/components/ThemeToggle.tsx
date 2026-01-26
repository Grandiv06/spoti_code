"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button className="w-12 h-12 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
        <span className="material-symbols-outlined text-xl">brightness_medium</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <span className="material-symbols-outlined text-xl">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-xl">dark_mode</span>
      )}
    </button>
  );
}
