"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageSquare, Eye, Bookmark, Share2 } from 'lucide-react';
import { SocialPost } from '@/types/social';
import { useSocial } from '@/context/SocialContext';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';
// import { useToast } from '@/components/ui/use-toast'; // simplified for now

interface PostCardProps {
  post: SocialPost;
  compact?: boolean;
  basePath?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, compact = false, basePath = "/social" }) => {
  const { currentUser, likePost, bookmarkPost } = useSocial();
  // const { toast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
        // Simple toast fallback if no UI library
        // toast({ title: "برای پسندیدن باید وارد شوید", variant: "destructive" });
        alert("برای انجام این کار باید وارد حساب کاربری شوید.");
        return;
    }
    likePost(post.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
        alert("برای انجام این کار باید وارد حساب کاربری شوید.");
        return;
    }
    bookmarkPost(post.id);
  };

  return (
    <Link href={`${basePath}/post/${post.id}`} className="block group">
      <div className="relative bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 dark:hover:border-white/[0.08]">
        
        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="relative h-48 w-full overflow-hidden">
             <Image 
               src={post.coverImageUrl} 
               alt={post.title}
               fill
               className="object-cover transition-transform duration-500 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
             <div className="absolute bottom-4 right-4 flex gap-2">
                {post.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="glass" size="sm">{tag}</Badge>
                ))}
             </div>
          </div>
        )}

        <div className="p-5">
           {/* Author Header */}
           <div className="flex items-center gap-3 mb-4">
              <Avatar src={post.author.avatarUrl} alt={post.author.displayName} size="sm" isBordered />
              <div className="flex flex-col">
                 <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{post.author.displayName}</span>
                 <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString('fa-IR')}</span>
              </div>
           </div>

           {/* Content */}
           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-green-500 transition-colors">
             {post.title}
           </h3>
           <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed">
             {post.summary}
           </p>

           {/* Footer Stats / Actions */}
           <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                 <div className="flex items-center gap-1.5" title="بازدید">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-medium">{post.viewsCount}</span>
                 </div>
                 <div className="flex items-center gap-1.5" title="دیدگاه‌ها">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-medium">{post.commentsCount}</span>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                   onClick={handleBookmark}
                   className={cn(
                     "p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-white/5",
                     post.isBookmarkedByCurrentUser && "text-green-500"
                   )}
                 >
                    <Bookmark className={cn("w-5 h-5", post.isBookmarkedByCurrentUser && "fill-current")} />
                 </button>
                 <button 
                   onClick={handleLike}
                   className={cn(
                     "flex items-center gap-1.5 p-2 rounded-full transition-colors hover:bg-pink-50 dark:hover:bg-pink-900/20",
                     post.isLikedByCurrentUser ? "text-pink-500" : "text-gray-500 dark:text-gray-400"
                   )}
                 >
                    <Heart className={cn("w-5 h-5", post.isLikedByCurrentUser && "fill-current")} />
                    <span className="text-xs font-bold">{post.likesCount}</span>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </Link>
  );
};
