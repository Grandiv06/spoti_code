"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, Flame, Clock, Sparkles } from 'lucide-react';
import { useSocial } from '@/context/SocialContext';
import { PostCard } from '@/components/social/PostCard';
import { Badge } from '@/components/social/Badge';
import { SocialButton } from '@/components/social/SocialButton';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'trending' | 'popular';

export default function SocialExplorePage() {
  const { posts, searchPosts } = useSocial();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [activeSort, setActiveSort] = useState<SortOption>('newest');

  // Derive filtered posts
  const filteredPosts = useMemo(() => {
    let result = searchPosts(searchQuery, selectedTag);
    
    // Client-side sorting
    if (activeSort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeSort === 'trending') {
       // Simple trending logic: views + likes * 2
       result.sort((a, b) => (b.viewsCount + b.likesCount * 2) - (a.viewsCount + a.likesCount * 2));
    } else if (activeSort === 'popular') {
       result.sort((a, b) => b.likesCount - a.likesCount);
    }
    
    return result;
  }, [posts, searchQuery, selectedTag, activeSort, searchPosts]);

  // Extract unique tags for filter
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).slice(0, 10); // Limit to 10 for UI
  }, [posts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
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
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
            placeholder="جستجو در نام، توضیحات، نویسنده..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="sticky top-[10px] z-20 flex flex-col gap-4 bg-gray-50/80 dark:bg-[#0B0D11]/80 backdrop-blur-lg py-2 -mx-2 px-2 rounded-2xl">
         <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Sort Tabs */}
            <div className="flex p-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 w-full md:w-auto">
               <button 
                 onClick={() => setActiveSort('newest')}
                 className={cn("flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all", activeSort === 'newest' ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300")}
               >
                 <Clock className="w-4 h-4" /> جدیدترین
               </button>
               <button 
                 onClick={() => setActiveSort('trending')}
                 className={cn("flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all", activeSort === 'trending' ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300")}
               >
                 <Flame className="w-4 h-4" /> ترند
               </button>
               <button 
                 onClick={() => setActiveSort('popular')}
                 className={cn("flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all", activeSort === 'popular' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300")}
               >
                 <Sparkles className="w-4 h-4" /> محبوب‌ترین
               </button>
            </div>

            {/* Tag Cloud */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
               <span className="text-xs text-gray-500 whitespace-nowrap ml-2">فیلترها:</span>
               <button 
                  onClick={() => setSelectedTag(undefined)}
                  className={cn("whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors", !selectedTag ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300")}
               >
                  همه
               </button>
               {allTags.map(tag => (
                 <button
                   key={tag}
                   onClick={() => setSelectedTag(tag === selectedTag ? undefined : tag)}
                   className={cn("whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors", tag === selectedTag ? "bg-green-500 text-white border-green-500" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-500/50")}
                 >
                   {tag}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
           {filteredPosts.map(post => (
             <PostCard key={post.id} post={post} />
           ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
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
                    setSearchQuery('');
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
