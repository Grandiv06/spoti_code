"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PanelNavItemConfig = {
  href: string;
  label: string;
  icon: LucideIcon;
  isCenter?: boolean;
};

type PanelNavItemProps = {
  item: PanelNavItemConfig;
  active: boolean;
};

export function PanelNavItem({ item, active }: PanelNavItemProps) {
  if (item.isCenter) {
    const CenterIcon = item.icon;

    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-full w-full flex-col items-center justify-end overflow-visible pb-1.5 outline-none transition-[transform,opacity] duration-200 ease-out",
          "[-webkit-tap-highlight-color:transparent] active:scale-[0.96]",
          "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#14161c]",
        )}
      >
        <span
          className={cn(
            "absolute bottom-[1.675rem] z-[1] flex size-[3.65rem] shrink-0 items-center justify-center overflow-visible rounded-full transition-[transform,opacity,filter] duration-200 ease-out",
            "group-active:scale-[0.94]",
            active
              ? "opacity-100"
              : "opacity-55 saturate-[0.65] group-hover:opacity-80",
          )}
        >
          <span
            className={cn(
              "absolute -inset-2.5 -z-10 rounded-full blur-xl transition-opacity duration-200",
              active
                ? "bg-primary/30 opacity-100"
                : "bg-primary/15 opacity-40 group-hover:opacity-55",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "absolute inset-0 rounded-full border transition-[box-shadow,border-color,filter] duration-200",
              active
                ? "border-primary/50 bg-[radial-gradient(circle_at_50%_45%,#4ade80_0%,#22c55e_48%,#15803d_100%)] shadow-[0_5px_16px_rgba(34,197,94,0.35),0_0_0_1px_rgba(255,255,255,0.08)] ring-2 ring-inset ring-[#86efac]/25"
                : "border-gray-300/70 bg-[radial-gradient(circle_at_50%_45%,#e8efe9_0%,#cfdcd3_52%,#a8bcae_100%)] shadow-[0_4px_14px_rgba(0,0,0,0.12)] dark:border-white/16 dark:bg-[radial-gradient(circle_at_50%_45%,#3a4a40_0%,#28332c_52%,#161c18_100%)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.35)]",
            )}
          />
          <span
            className={cn(
              "pointer-events-none absolute -inset-[2px] rounded-full border transition-colors duration-200",
              active
                ? "border-primary/30"
                : "border-gray-200 dark:border-white/12",
            )}
            aria-hidden
          />
          {active ? (
            <span
              className="pointer-events-none absolute inset-[1px] rounded-full ring-1 ring-inset ring-[#86efac]/35"
              aria-hidden
            />
          ) : null}
          {!active ? (
            <span
              className="pointer-events-none absolute inset-[1px] rounded-full ring-1 ring-inset ring-white/40 dark:ring-white/10"
              aria-hidden
            />
          ) : null}
          <CenterIcon
            className={cn(
              "relative size-[1.4rem] transition-colors duration-200",
              active
                ? "text-white"
                : "text-primary/70 group-hover:text-primary",
            )}
            strokeWidth={active ? 2.2 : 2}
            aria-hidden
          />
        </span>
        <span
          className={cn(
            "text-[10px] font-extrabold leading-none tracking-tight transition-colors duration-200",
            active
              ? "text-primary drop-shadow-sm"
              : "text-gray-500 group-hover:text-gray-700 dark:text-slate-500 dark:group-hover:text-slate-300",
          )}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-full w-full min-w-0 flex-col items-center justify-end gap-1 rounded-2xl px-1 pb-1.5 pt-2 outline-none transition-[transform,color,opacity] duration-150 ease-out",
        "[-webkit-tap-highlight-color:transparent] active:scale-[0.96]",
        "focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#14161c]",
        active
          ? "text-primary"
          : "text-gray-500 opacity-90 hover:text-gray-700 hover:opacity-100 dark:text-slate-500 dark:hover:text-slate-300",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0.5 top-1.5 bottom-1 rounded-xl transition-[background,box-shadow,opacity] duration-150",
          active
            ? "bg-[linear-gradient(180deg,rgba(34,197,94,0.16)_0%,rgba(34,197,94,0.06)_100%)] shadow-[inset_0_1px_0_rgba(134,239,172,0.18)]"
            : "bg-transparent group-hover:bg-gray-900/[0.045] dark:group-hover:bg-white/[0.045]",
        )}
        aria-hidden
      />
      {active ? (
        <span
          className="pointer-events-none absolute inset-x-3 top-2.5 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(134,239,172,0.5),transparent)]"
          aria-hidden
        />
      ) : null}
      <span className="relative flex flex-col items-center justify-end gap-1 rounded-xl px-1.5 py-1">
        <item.icon
          className={cn(
            "size-[1.15rem] shrink-0 transition-transform duration-200",
            active && "scale-105",
          )}
          strokeWidth={active ? 2.25 : 1.85}
          aria-hidden
        />
        <span
          className={cn(
            "max-w-full truncate text-[10px] font-semibold leading-none tracking-tight",
            active ? "font-bold" : "opacity-95",
          )}
        >
          {item.label}
        </span>
      </span>
    </Link>
  );
}
