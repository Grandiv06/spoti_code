"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
