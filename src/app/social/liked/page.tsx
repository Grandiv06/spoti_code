"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { PostCard } from "@/components/social/PostCard";

export default function LikedPostsPage() {
  const { posts } = useSocial();
  const likedPosts = posts.filter((p) => p.isLikedByCurrentUser);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          پست‌های لایک‌شده
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          پروژه‌هایی که پسندیده‌اید
        </p>
      </div>

      {likedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {likedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            هنوز پستی لایک نکرده‌اید
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            با کلیک روی آیکن قلب در پست‌ها، آن‌ها را اینجا ببینید.
          </p>
        </div>
      )}
    </div>
  );
}
