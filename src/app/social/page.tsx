"use client";

import React, { useState, useMemo } from "react";
import { useSocial } from "@/context/SocialContext";
import { CreatePostModal } from "@/components/social/CreatePostModal";
import { SocialButton } from "@/components/social/SocialButton";
import { ExploreHero } from "@/components/social/explore/ExploreHero";
import { FilterBar } from "@/components/social/explore/FilterBar";
import { FeaturedSection } from "@/components/social/explore/FeaturedSection";
import { ProjectCard } from "@/components/social/explore/ProjectCard";
import { cn } from "@/lib/utils";
import { Search, Sparkles } from "lucide-react";

type SortOption = "newest" | "trending" | "popular";
type ViewMode = "grid" | "list";

export default function SocialExplorePage() {
  const { posts, searchPosts, currentUser } = useSocial();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [activeSort, setActiveSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const featuredPosts = useMemo(() => {
     // Simple logic: top 3 by likes for now
     return [...posts].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3);
  }, [posts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Hero Section */}
      <ExploreHero onCreatePost={() => setIsCreateModalOpen(true)} showCreateButton={!!currentUser} />

      {/* 2. Featured Section (Only when not searching/filtering) */}
      {!searchQuery && !selectedTag && (
          <>
            <FeaturedSection projects={featuredPosts} />
            
            {currentUser && (
                <div className="mb-0">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <div className="p-2 rounded-full bg-pink-500/10 text-pink-500">
                            <Sparkles className="w-5 h-5 fill-current" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">برای شما</h2>
                    </div>
                    {/* Placeholder for personalized content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {posts.slice(5, 9).map(post => (
                             <ProjectCard key={`foryou-${post.id}`} post={post} variant="grid" />
                        ))}
                    </div>
                     <div className="h-px w-full bg-gray-100 dark:bg-white/[0.06] my-12" />
                </div>
            )}
          </>
      )}

      {/* 3. Sticky Filter Bar */}
      <FilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        allTags={allTags}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 4. Results Grid */}
      {filteredPosts.length > 0 ? (
        <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1 max-w-4xl mx-auto"
        )}>
          {filteredPosts.map((post) => (
            <ProjectCard 
                key={post.id} 
                post={post} 
                variant={viewMode}
                className={viewMode === 'grid' ? "h-full" : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-[#16181e] rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-gray-400" />
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
