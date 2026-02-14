"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Filter, Flame, Clock, Sparkles, Plus, ChevronDown, X } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { PostCard } from "@/components/social/PostCard";
import { SocialButton } from "@/components/social/SocialButton";
import { CreatePostModal } from "@/components/social/CreatePostModal";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "trending" | "popular";

export default function SocialExplorePage() {
  const { posts, searchPosts, currentUser } = useSocial();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [activeSort, setActiveSort] = useState<SortOption>("newest");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const filteredPosts = useMemo(() => {
    let result = searchPosts(searchQuery, selectedTag);
    if (activeSort === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeSort === "trending") {
      result.sort((a, b) => (b.viewsCount + b.likesCount * 2) - (a.viewsCount + a.likesCount * 2));
    } else if (activeSort === "popular") {
      result.sort((a, b) => b.likesCount - a.likesCount);
    }
    return result;
  }, [posts, searchQuery, selectedTag, activeSort, searchPosts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero + Search */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              کاوش پروژه‌ها
              <Sparkles className="inline-block w-6 h-6 text-yellow-400 mr-2 align-middle" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              برترین پروژه‌های برنامه‌نویسی را کشف کنید و الهام بگیرید.
            </p>
          </div>
          {currentUser && (
            <SocialButton
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-shadow"
            >
              <Plus className="w-5 h-5" />
              ایجاد پست
            </SocialButton>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full h-14 pl-5 pr-12 rounded-2xl bg-white dark:bg-[#16181e] border border-gray-200 dark:border-white/[0.06] text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-500 focus:shadow-lg focus:shadow-green-500/10 transition-all duration-200"
            placeholder="جستجو در نام، توضیحات، نویسنده..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort + Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-1 rounded-xl bg-white dark:bg-[#16181e] border border-gray-100 dark:border-white/[0.06] gap-1">
            <button
              onClick={() => setActiveSort("newest")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeSort === "newest"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              <Clock className="w-4 h-4" /> جدیدترین
            </button>
            <button
              onClick={() => setActiveSort("trending")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeSort === "trending"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              <Flame className="w-4 h-4" /> ترند
            </button>
            <button
              onClick={() => setActiveSort("popular")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeSort === "popular"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              <Sparkles className="w-4 h-4" /> محبوب‌ترین
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                selectedTag
                  ? "bg-primary/10 dark:bg-primary/20 border-primary/30 text-primary"
                  : "bg-white dark:bg-[#16181e] border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/10"
              )}
            >
              <Filter className="w-4 h-4" />
              {selectedTag ? (
                <>
                  <span>{selectedTag}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag(undefined);
                      setIsFilterOpen(false);
                    }}
                    className="p-0.5 rounded hover:bg-primary/20"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <span>فیلتر تگ</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isFilterOpen && "rotate-180")} />
                </>
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 max-h-64 overflow-y-auto py-2 rounded-xl bg-white dark:bg-[#16181e] border border-gray-200 dark:border-white/[0.06] shadow-xl z-30">
                <button
                  onClick={() => {
                    setSelectedTag(undefined);
                    setIsFilterOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-right text-sm font-medium transition-colors",
                    !selectedTag ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                  )}
                >
                  همه
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-right text-sm font-medium transition-colors",
                      tag === selectedTag ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} basePath="/social" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-[#16181e] rounded-full flex items-center justify-center mb-6">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">موردی یافت نشد</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            متاسفانه پروژه‌ای با این مشخصات پیدا نکردیم. لطفاً جستجو یا فیلترهای خود را تغییر دهید.
          </p>
          <SocialButton
            variant="outline"
            className="mt-6"
            onClick={() => {
              setSearchQuery("");
              setSelectedTag(undefined);
            }}
          >
            پاک کردن فیلترها
          </SocialButton>
        </div>
      )}

      {isCreateModalOpen && (
        <CreatePostModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
