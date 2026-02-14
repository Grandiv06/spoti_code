import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, Flame, Clock, Sparkles, ChevronDown, X, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "trending" | "popular";
type ViewMode = "grid" | "list";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedTag: string | undefined;
  onTagSelect: (tag: string | undefined) => void;
  allTags: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeSort,
  onSortChange,
  selectedTag,
  onTagSelect,
  allTags,
  viewMode,
  onViewModeChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-4 z-40 bg-white/80 dark:bg-[#16181e]/80 backdrop-blur-xl border border-gray-100 dark:border-white/[0.06] rounded-3xl p-3 shadow-lg shadow-black/5 mb-8">
       <div className="flex flex-col lg:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-96 group">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            </div>
            <input
                type="text"
                className="w-full h-12 pl-4 pr-12 rounded-2xl bg-gray-50 dark:bg-[#1c1e26] border-none text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50 transition-all font-medium"
                placeholder="جستجو در نام، توضیحات..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden lg:block" />

          {/* Sort Toggles */}
          <div className="flex w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 gap-1 scrollbar-hide">
              <button
                onClick={() => onSortChange("newest")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeSort === "newest"
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                )}
              >
                <Clock className="w-4 h-4" /> جدیدترین
              </button>
              <button
                onClick={() => onSortChange("trending")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeSort === "trending"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                )}
              >
                <Flame className="w-4 h-4" /> داغ
              </button>
              <button
                onClick={() => onSortChange("popular")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeSort === "popular"
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                )}
              >
                <Sparkles className="w-4 h-4" /> محبوب
              </button>
          </div>

          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
              
              {/* Tag Filter */}
              <div className="relative flex-1 lg:flex-none" ref={filterRef}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        "w-full lg:w-48 flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                        selectedTag
                        ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                        : "bg-white dark:bg-[#1c1e26] border-gray-200 dark:border-white/[0.06] hover:border-gray-300"
                    )}
                >
                    <span className="flex items-center gap-2 truncate">
                        <Filter className="w-4 h-4" />
                        {selectedTag || "همه تکنولوژی‌ها"}
                    </span>
                    {selectedTag ? (
                        <div onClick={(e) => { e.stopPropagation(); onTagSelect(undefined); }} className="hover:bg-black/10 rounded p-0.5">
                            <X className="w-3 h-3" />
                        </div>
                    ) : (
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    )}
                </button>

                {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-xl bg-white dark:bg-[#1c1e26] border border-gray-200 dark:border-white/[0.06] shadow-xl z-50 p-2">
                         <div className="text-xs font-semibold text-gray-400 px-3 py-2">انتخاب تکنولوژی</div>
                         {allTags.map((tag) => (
                             <button
                                key={tag}
                                onClick={() => { onTagSelect(tag); setIsFilterOpen(false); }}
                                className={cn(
                                    "w-full text-right px-3 py-2 rounded-lg text-sm transition-colors",
                                    selectedTag === tag 
                                        ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                                        : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                                )}
                             >
                                 {tag}
                             </button>
                         ))}
                    </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-[#1c1e26] p-1 rounded-xl">
                  <button 
                    onClick={() => onViewModeChange('grid')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-400")}
                  >
                      <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onViewModeChange('list')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-400")}
                  >
                      <List className="w-4 h-4" />
                  </button>
              </div>
          </div>
       </div>
    </div>
  );
};
