import React from "react";
import { Search, SlidersHorizontal, Trash2, ArrowUpDown, Check } from "lucide-react";

interface UsersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  planFilter: string;
  setPlanFilter: (plan: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onClearFilters: () => void;
  isFiltersExpanded: boolean;
  setIsFiltersExpanded: (open: boolean) => void;
  hasActiveFilters: boolean;
}

export default function UsersFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  sortBy,
  setSortBy,
  onClearFilters,
  isFiltersExpanded,
  setIsFiltersExpanded,
  hasActiveFilters,
}: UsersFiltersProps) {
  const statuses = [
    { label: "همه وضعیت‌ها", value: "all" },
    { label: "فعال", value: "فعال", color: "bg-emerald-500/10 text-emerald-400" },
    { label: "غیرفعال", value: "غیرفعال", color: "bg-zinc-500/10 text-zinc-400" },
    { label: "معلق", value: "معلق", color: "bg-amber-500/10 text-amber-400" },
  ];

  const plans = [
    { label: "همه پلن‌ها", value: "all" },
    { label: "Starter", value: "Starter", color: "bg-blue-500/10 text-blue-400" },
    { label: "Pro", value: "Pro", color: "bg-purple-500/10 text-purple-400" },
    { label: "Enterprise", value: "Enterprise", color: "bg-amber-500/10 text-amber-400" },
  ];

  const sortOptions = [
    { label: "جدیدترین عضوها", value: "newest" },
    { label: "بیشترین ارزش خرید (LTV)", value: "highest_ltv" },
    { label: "بیشترین تعداد دوره‌ها", value: "highest_courses" },
  ];

  return (
    <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/5 p-4 md:p-6 shadow-sm mb-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس نام، شماره موبایل یا شناسه کاربر..."
            className="w-full pl-4 pr-11 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-sm text-gray-900 dark:text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-2xl text-sm font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>پاک کردن فیلترها</span>
            </button>
          )}

          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border transition-all ${
              isFiltersExpanded
                ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_12px_rgba(34,197,94,0.1)]"
                : "bg-gray-50 dark:bg-black/20 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>فیلتر پیشرفته</span>
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Area */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isFiltersExpanded
            ? "grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-gray-100 dark:border-white/5"
            : "grid-rows-[0fr] opacity-0 overflow-hidden"
        }`}
      >
        <div className="overflow-hidden space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 block">
                فیلتر وضعیت حساب
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => {
                  const isSelected = statusFilter === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setStatusFilter(s.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-gray-50 dark:bg-black/10 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/10"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plan Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 block">
                فیلتر پلن عضویت
              </label>
              <div className="flex flex-wrap gap-2">
                {plans.map((p) => {
                  const isSelected = planFilter === p.value;
                  return (
                    <button
                      key={p.value}
                      onClick={() => setPlanFilter(p.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-gray-50 dark:bg-black/10 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/10"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sorting Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 block">
                مرتب‌سازی بر اساس
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 outline-none appearance-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1c1e26] text-gray-900 dark:text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
