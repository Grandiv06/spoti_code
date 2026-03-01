"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, ExternalLink, Calendar, Heart, Bookmark, Share2 } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { Avatar } from "@/components/social/Avatar";
import { Badge } from "@/components/social/Badge";
import { SocialButton } from "@/components/social/SocialButton";
import { CommentSection } from "@/components/social/CommentSection";
import { SocialComment } from "@/types/social";
import { cn } from "@/lib/utils";

const BASE = "/panel/social";

export default function PanelPostDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getPostById, currentUser, likePost, bookmarkPost } = useSocial();
  const post = getPostById(resolvedParams.id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">پست یافت نشد</h2>
        <SocialButton onClick={() => router.back()} variant="outline" leftIcon={<ArrowRight className="w-4 h-4" />}>
          بازگشت
        </SocialButton>
      </div>
    );
  }

  const COMMENTS: SocialComment[] = Array.from({ length: 3 }).map((_, i) => ({
    id: `c-${i}`,
    postId: post.id,
    authorId: `author-${i}`,
    author: {
      id: `author-${i}`,
      username: `commenter_${i}`,
      displayName: `کاربر نظر دهنده ${i + 1}`,
      avatarUrl: `https://i.pravatar.cc/150?u=c-${i}`,
      followersCount: 10,
      followingCount: 10,
      postsCount: 0,
      bio: "",
      createdAt: new Date().toISOString(),
    },
    content: i === 0 ? "پروژه بسیار جالبی بود!" : "عالی! منتظر نسخه‌های بعدی هستم.",
    likesCount: i * 2,
    createdAt: new Date(Date.now() - 86400000 * i).toISOString(),
    updatedAt: new Date().toISOString(),
    isLikedByCurrentUser: false,
    replies: [],
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => router.back()} className="group flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors cursor-pointer">
        <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-green-100 dark:group-hover:bg-green-900/20 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium">بازگشت</span>
      </button>

      <div className="space-y-4">
        <div className="flex gap-2 mb-2">
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <Link href={`${BASE}/profile/${post.authorId}`} className="flex items-center gap-3 group">
            <Avatar src={post.author.avatarUrl} alt={post.author.displayName} size="md" isBordered />
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-500 transition-colors">
                {post.author.displayName}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>@{post.author.username}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <SocialButton
              variant="outline"
              size="sm"
              onClick={() => (currentUser ? likePost(post.id) : alert("برای پسندیدن باید وارد شوید"))}
              className={cn(post.isLikedByCurrentUser && "border-pink-200 bg-pink-50 text-pink-600 dark:bg-pink-900/10 dark:border-pink-900/30")}
              leftIcon={<Heart className={cn("w-4 h-4", post.isLikedByCurrentUser && "fill-current")} />}
            >
              {post.likesCount}
            </SocialButton>
            <SocialButton
              variant="outline"
              size="icon"
              onClick={() => (currentUser ? bookmarkPost(post.id) : alert("برای ذخیره کردن باید وارد شوید"))}
              className={cn(post.isBookmarkedByCurrentUser && "text-green-600 border-green-200 bg-green-50")}
            >
              <Bookmark className={cn("w-4 h-4", post.isBookmarkedByCurrentUser && "fill-current")} />
            </SocialButton>
            <SocialButton variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </SocialButton>
          </div>
        </div>
      </div>

      {post.coverImageUrl && (
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-green-900/5">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="flex gap-4">
        {post.demoUrl && (
          <a href={post.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <SocialButton variant="primary" className="w-full" leftIcon={<ExternalLink className="w-4 h-4" />}>
              مشاهده دمو آنلاین
            </SocialButton>
          </a>
        )}
        {post.githubUrl && (
          <a href={post.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <SocialButton variant="secondary" className="w-full" leftIcon={<Github className="w-4 h-4" />}>
              سورس کد پروژه
            </SocialButton>
          </a>
        )}
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-green">
        <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">{post.description}</p>
      </div>

      {post.galleryImageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {post.galleryImageUrls.map((url, idx) => (
            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      )}

      <div className="h-px w-full bg-gray-100 dark:bg-gray-800 my-8" />
      <CommentSection comments={COMMENTS} />
    </div>
  );
}
