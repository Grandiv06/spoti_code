"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Flame, Clock, Sparkles } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { PostCard } from "@/components/social/PostCard";
import { Badge } from "@/components/social/Badge";
import { SocialButton } from "@/components/social/SocialButton";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "trending" | "popular";

export default function SocialExplorePage() {
  const { posts, searchPosts } = useSocial();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [activeSort, setActiveSort] = useState<SortOption>("newest");

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
    return Array.from(tags).slice(0, 10);
  }, [posts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            کاوش پروژه‌ها
            <Sparkles className="inline-block w-6 h-6 text-yellow-400 mr-2 align-middle" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            برترین پروژه‌های برنامه‌نویسی را کشف کنید و الهام بگیرید.
          </p>
        </div>
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-white dark:bg-[#14161c] border border-gray-200 dark:border-white/[0.08] rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white"
            placeholder="جستجو در نام، توضیحات، نویسنده..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="sticky top-[10px] z-20 flex flex-col gap-4 py-2 -mx-2 px-2">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex p-1 rounded-lg w-full md:w-auto gap-1">
            <button
              onClick={() => setActiveSort("newest")}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeSort === "newest"
                  ? "bg-primary/15 dark:bg-primary/20 text-primary shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/5 dark:hover:bg-white/5"
              )}
            >
              <Clock className="w-4 h-4" /> جدیدترین
            </button>
            <button
              onClick={() => setActiveSort("trending")}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeSort === "trending"
                  ? "bg-orange-500/15 dark:bg-orange-500/20 text-orange-500 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/5 dark:hover:bg-white/5"
              )}
            >
              <Flame className="w-4 h-4" /> ترند
            </button>
            <button
              onClick={() => setActiveSort("popular")}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeSort === "popular"
                  ? "bg-blue-500/15 dark:bg-blue-500/20 text-blue-500 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/5 dark:hover:bg-white/5"
              )}
            >
              <Sparkles className="w-4 h-4" /> محبوب‌ترین
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">فیلترها:</span>
            <button
              onClick={() => setSelectedTag(undefined)}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                !selectedTag
                  ? "bg-primary/15 dark:bg-primary/20 text-primary"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              همه
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? undefined : tag)}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  tag === selectedTag
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} basePath="/social" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-[#1c1e26] rounded-full flex items-center justify-center mb-6">
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
    </div>
  );
}
