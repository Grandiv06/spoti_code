"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "همه" },
  { id: "success", label: "موفق" },
  { id: "pending", label: "در انتظار" },
  { id: "failed", label: "ناموفق" },
];

export default function TransactionFilters({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="scrollbar-hide -mx-1 flex items-center gap-2 overflow-x-auto px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onStatusChange(tab.id)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer",
              status === tab.id
                ? "border-primary/25 bg-primary/10 text-primary shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                : "border-gray-200/70 bg-white text-gray-500 hover:text-gray-900 dark:border-white/5 dark:bg-[#1c1e26]/80 dark:text-slate-400 dark:hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجو در تراکنش‌ها..."
          className="w-full rounded-2xl border border-gray-200/70 bg-white py-3.5 pe-4 ps-11 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-[#1c1e26]/90 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>
    </section>
  );
}
