"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Github,
  ExternalLink,
  Calendar,
  Heart,
  Bookmark,
  Share2,
  AlertCircle,
  Lightbulb,
  Rocket,
  Wrench,
} from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { Avatar } from "@/components/social/Avatar";
import { Badge } from "@/components/social/Badge";
import { SocialButton } from "@/components/social/SocialButton";
import { CommentSection } from "@/components/social/CommentSection";
import { ProjectStats } from "@/components/social/post/ProjectStats";
import { TechStack } from "@/components/social/post/TechStack";
import { AuthorCard } from "@/components/social/post/AuthorCard";
import { RelatedProjects } from "@/components/social/post/RelatedProjects";
import { SocialComment, SocialPost } from "@/types/social";
import { cn } from "@/lib/utils";

interface PostDetailClientProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailClient({ params }: PostDetailClientProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getPostById, currentUser, likePost, bookmarkPost, followUser } =
    useSocial();
  const rawPost = getPostById(resolvedParams.id);

  const post: SocialPost | undefined = rawPost
    ? {
        ...rawPost,
        status: "COMPLETED",
        difficulty: "INTERMEDIATE",
        extendedDescription: {
          idea: "این پروژه با هدف ساده‌سازی فرآیند یادگیری برنامه‌نویسی برای فارسی‌زبانان ایجاد شده است.",
          challenges: "یکی از بزرگترین چالش‌ها، پیاده‌سازی سیستم کامپایلر آنلاین بود.",
          learned: "در این پروژه کار با WebAssembly و Docker را به صورت عمیق یاد گرفتم.",
          future: "قصد دارم در آینده بخش منتورینگ را نیز به پلتفرم اضافه کنم.",
        },
      }
    : undefined;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          پروژه یافت نشد
        </h2>
        <SocialButton
          onClick={() => router.back()}
          variant="outline"
          leftIcon={<ArrowRight className="w-4 h-4" />}
        >
          بازگشت
        </SocialButton>
      </div>
    );
  }

  const allImages = post.coverImageUrl
    ? [post.coverImageUrl, ...post.galleryImageUrls]
    : post.galleryImageUrls;

  const COMMENTS: SocialComment[] = Array.from({ length: 3 }).map((_, i) => ({
    id: `c-${i}`,
    postId: post.id,
    authorId: `author-${i}`,
    author: {
      id: `author-${i}`,
      username: `user_${i}`,
      displayName: `کاربر ${i + 1}`,
      avatarUrl: `https://i.pravatar.cc/150?u=c-${i}`,
      followersCount: 10,
      followingCount: 10,
      postsCount: 0,
      bio: "",
      createdAt: new Date().toISOString(),
    },
    content: i === 0 ? "پروژه بسیار تمیز و حرفه‌ای پیاده‌سازی شده." : "تبریک میگم، طراحی UI خیلی چشم‌نوازه.",
    likesCount: i * 2 + 5,
    createdAt: new Date(Date.now() - 86400000 * i).toISOString(),
    updatedAt: new Date().toISOString(),
    isLikedByCurrentUser: false,
    replies: [],
  }));

  const relatedProjects: SocialPost[] = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <nav className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors group cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">بازگشت به لیست</span>
        </button>
        <div className="flex gap-2">
          <SocialButton variant="ghost" size="icon" onClick={() => {}}>
            <Share2 className="w-5 h-5" />
          </SocialButton>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {post.status && (
                <Badge variant={post.status === "COMPLETED" ? "success" : "warning"} className="px-3 py-1">
                  {post.status === "COMPLETED" ? "تکمیل شده" : "در حال توسعه"}
                </Badge>
              )}
              {post.difficulty && (
                <Badge variant="glass" className="px-3 py-1">
                  {post.difficulty === "INTERMEDIATE" ? "متوسط" : "مقدماتی"}
                </Badge>
              )}
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-gray-100 dark:border-white/[0.06] pb-8">
              <Link href={`/social/profile/${post.authorId}`} className="flex items-center gap-3 group">
                <Avatar src={post.author.avatarUrl} alt={post.author.displayName} size="md" isBordered />
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-green-500 transition-colors">
                    {post.author.displayName}
                  </div>
                  <div className="text-sm text-gray-500">@{post.author.username}</div>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                {post.demoUrl && (
                  <a href={post.demoUrl} target="_blank" rel="noopener noreferrer">
                    <SocialButton variant="primary" className="shadow-lg shadow-green-500/20" leftIcon={<ExternalLink className="w-4 h-4" />}>
                      مشاهده دمو
                    </SocialButton>
                  </a>
                )}
                {post.githubUrl && (
                  <a href={post.githubUrl} target="_blank" rel="noopener noreferrer">
                    <SocialButton variant="secondary" leftIcon={<Github className="w-4 h-4" />}>
                      گیت‌هاب
                    </SocialButton>
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <ProjectStats views={post.viewsCount} likes={post.likesCount} comments={post.commentsCount} />
              <div className="flex items-center gap-2">
                <SocialButton
                  variant="outline"
                  size="sm"
                  className={cn(post.isLikedByCurrentUser && "text-pink-500 bg-pink-50 dark:bg-pink-900/10 border-pink-200")}
                  onClick={() => (currentUser ? likePost(post.id) : alert("لطفا وارد شوید"))}
                  leftIcon={<Heart className={cn("w-4 h-4", post.isLikedByCurrentUser && "fill-current")} />}
                >
                  پسندیدن
                </SocialButton>
                <SocialButton
                  variant="outline"
                  size="icon"
                  className={cn(post.isBookmarkedByCurrentUser && "text-green-500 bg-green-50 dark:bg-green-900/10 border-green-200")}
                  onClick={() => (currentUser ? bookmarkPost(post.id) : alert("لطفا وارد شوید"))}
                >
                  <Bookmark className={cn("w-4 h-4", post.isBookmarkedByCurrentUser && "fill-current")} />
                </SocialButton>
              </div>
            </div>
          </section>

          {allImages.length > 0 && (
            <section className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-[#16181e]">
                <Image src={allImages[activeImageIndex]} alt={post.title} fill className="object-cover transition-all duration-500" priority />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
                        activeImageIndex === idx ? "border-green-500 ring-2 ring-green-500/20" : "border-transparent opacity-60 hover:opacity-100 cursor-pointer"
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="space-y-10">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-green">
              {post.extendedDescription ? (
                <>
                  <div className="bg-gray-50 dark:bg-[#1c1e26]/50 rounded-2xl p-8 border border-gray-100 dark:border-white/[0.04]">
                    <h2 className="flex items-center gap-2 text-2xl mb-4 text-green-600 dark:text-green-400">
                      <Lightbulb className="w-6 h-6" />
                      ایده پروژه
                    </h2>
                    <p>{post.extendedDescription.idea}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 my-8">
                    <div>
                      <h3 className="flex items-center gap-2 text-xl mb-3 text-red-500">
                        <AlertCircle className="w-5 h-5" />
                        چالش‌های فنی
                      </h3>
                      <p>{post.extendedDescription.challenges}</p>
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 text-xl mb-3 text-blue-500">
                        <Rocket className="w-5 h-5" />
                        آنچه آموختم
                      </h3>
                      <p>{post.extendedDescription.learned}</p>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-8 mt-8">
                    <h3 className="flex items-center gap-2 text-xl mb-4 text-purple-500">
                      <Wrench className="w-5 h-5" />
                      برنامه‌های آینده
                    </h3>
                    <p>{post.extendedDescription.future}</p>
                  </div>
                </>
              ) : (
                <p className="whitespace-pre-line leading-relaxed">{post.description}</p>
              )}
            </div>
          </section>

          <hr className="border-gray-100 dark:border-white/[0.06]" />

          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">دیدگاه‌ها و فیدبک‌ها</h2>
              <Badge variant="secondary">{post.commentsCount}</Badge>
            </div>
            <CommentSection comments={COMMENTS} />
          </section>

          <div className="lg:hidden">
            <hr className="border-gray-100 dark:border-white/[0.06] my-8" />
            <RelatedProjects projects={relatedProjects} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-24">
          <AuthorCard
            author={post.author}
            isFollowing={false}
            onFollow={() => (currentUser ? followUser(post.authorId) : alert("همه‌چیز آماده‌ست، فقط اول وارد شو!"))}
          />
          <TechStack technologies={post.tags} />
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-green-500/20">
            <h3 className="text-xl font-bold mb-2">همکاری در این پروژه؟</h3>
            <p className="text-green-50 mb-4 text-sm leading-relaxed">
              اگر دوست داری در توسعه این پروژه مشارکت کنی، می‌تونی به ریپازیتوری گیت‌هاب سر بزنی و PR ارسال کنی!
            </p>
            <a href={post.githubUrl} target="_blank" rel="noopener noreferrer">
              <button className="w-full py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                مشارکت در پروژه
              </button>
            </a>
          </div>
          <div className="hidden lg:block pt-8 border-t border-gray-100 dark:border-white/[0.06]">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">دیگر پروژه‌های پیشنهادی</h4>
            <RelatedProjects projects={relatedProjects.slice(0, 2)} />
          </div>
        </div>
      </div>
    </div>
  );
}
