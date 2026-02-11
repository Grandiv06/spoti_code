"use client";

import Link from "next/link";
import { useState, useRef } from "react";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

export default function NavLink({ href, label, isActive }: NavLinkProps) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const baseClasses =
    "relative px-5 py-2 text-sm font-medium rounded-4xl transition-all duration-300 overflow-hidden";
  const activeClasses = "bg-primary/10 text-primary font-bold overflow-hidden";
  const inactiveClasses =
    "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary backdrop-blur-xl border border-transparent hover:bg-white/20 hover:dark:bg-[#14161c]/10 hover:border-white/15 hover:dark:border-white/[0.04] overflow-hidden";

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos(null)}
      className="relative "
    >
      <Link
        href={href}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        {mousePos && !isActive && (
          <span
            className="pointer-events-none absolute inset-0 rounded-4xl overflow-hidden"
            style={{
              background: `radial-gradient(circle 35px at ${mousePos.x}% ${mousePos.y}%, rgba(34, 197, 94, 0.12) 0%, transparent 70%)`,
            }}
          />
        )}
        <span className="relative z-10 overflow-hidden">{label}</span>
      </Link>
    </div>
  );
}
