"use client";

import React, { useState } from "react";
import { Search, Filter, ArrowDownWideNarrow, Calendar } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function TransactionFilters() {
  const [status, setStatus] = useState("all");
  const [timeframe, setTimeframe] = useState("month");
  const [sort, setSort] = useState("newest");

  const statusOptions = [
    { value: "all", label: "همه وضعیت‌ها" },
    { value: "success", label: "موفق" },
    { value: "failed", label: "ناموفق" },
    { value: "pending", label: "در انتظار" },
  ];

  const timeframeOptions = [
    { value: "month", label: "این ماه" },
    { value: "3months", label: "سه ماه اخیر" },
    { value: "year", label: "امسال" },
    { value: "all", label: "همه زمان‌ها" },
  ];

  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "oldest", label: "قدیمی‌ترین" },
    { value: "highest", label: "بیشترین مبلغ" },
    { value: "lowest", label: "کمترین مبلغ" },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-white dark:bg-[#1c1e26] p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="جستجو بر اساس شناسه یا محصول..."
            className="w-full pr-12 pl-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all dark:text-white"
          />
        </div>
        
        {/* Dropdowns */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-36">
            <CustomSelect
              options={statusOptions}
              value={status}
              onChange={setStatus}
              placeholder="وضعیت"
              size="sm"
              icon={<Filter className="w-4 h-4" />}
            />
          </div>
          
          <div className="w-full sm:w-36">
            <CustomSelect
              options={timeframeOptions}
              value={timeframe}
              onChange={setTimeframe}
              placeholder="بازه زمانی"
              size="sm"
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-48">
        <CustomSelect
          options={sortOptions}
          value={sort}
          onChange={setSort}
          variant="primary"
          size="sm"
          icon={<ArrowDownWideNarrow className="w-5 h-5" />}
          placeholder="مرتب‌سازی"
        />
      </div>
    </div>
  );
}
