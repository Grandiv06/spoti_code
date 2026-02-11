"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => setMousePos(null);

  if (!mounted) {
    return (
      <button className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 dark:bg-[#14161c]/80 backdrop-blur-xl border border-white/15 dark:border-white/[0.04] overflow-hidden"></button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 dark:bg-[#14161c]/80 backdrop-blur-xl border border-white/15 dark:border-white/[0.04] hover:bg-white/30 dark:hover:bg-[#14161c]/90 transition-colors duration-300 overflow-hidden cursor-pointer"
      aria-label="Toggle theme"
    >
      {mousePos && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle 35px at ${mousePos.x}% ${mousePos.y}%, rgba(34, 197, 94, 0.12) 0%, transparent 70%)`,
          }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center">
        {isDark ? (
          <span className="material-symbols-outlined text-xl">light_mode</span>
        ) : (
          <span className="material-symbols-outlined text-xl">dark_mode</span>
        )}
      </span>
    </button>
  );
}
