import React from "react";
import { Search, Filter, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

interface CoursesFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onClearFilters: () => void;
  isFiltersExpanded: boolean;
  setIsFiltersExpanded: (expanded: boolean) => void;
  hasActiveFilters: boolean;
}

export default function CoursesFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  onClearFilters,
  isFiltersExpanded,
  setIsFiltersExpanded,
  hasActiveFilters,
}: CoursesFiltersProps) {
  return (
    <div className="w-full rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-5 mb-8">
      {/* Top Bar: Search and Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 right-4 flex items-center justify-center text-gray-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس عنوان دوره، کد دوره یا مدرس..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 dark:focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl transition-all border border-rose-500/10"
            >
              <RotateCcw className="w-4 h-4" />
              <span>پاک کردن فیلترها</span>
            </button>
          )}

          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold rounded-2xl transition-all border ${
              isFiltersExpanded
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-gray-50 dark:bg-black/20 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-black/35"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>فیلترهای پیشرفته</span>
            {isFiltersExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Filters Section */}
      {isFiltersExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-white/5 animate-in slide-in-from-top duration-300">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">وضعیت انتشار</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 dark:focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-700 dark:text-gray-300"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="منتشر شده">منتشر شده</option>
              <option value="پیش‌نویس">پیش‌نویس</option>
              <option value="در انتظار بررسی">در انتظار بررسی</option>
              <option value="غیرفعال">غیرفعال</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">دسته‌بندی</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 dark:focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-700 dark:text-gray-300"
            >
              <option value="all">همه دسته‌ها</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="DevOps">DevOps</option>
              <option value="Mobile">Mobile</option>
              <option value="UI/UX">UI/UX</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">مرتب‌سازی بر اساس</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 dark:focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-700 dark:text-gray-300"
            >
              <option value="newest">جدیدترین</option>
              <option value="highest_students">بیشترین دانشجو</option>
              <option value="highest_revenue">بیشترین درآمد</option>
              <option value="highest_completion">بیشترین درصد تکمیل</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
