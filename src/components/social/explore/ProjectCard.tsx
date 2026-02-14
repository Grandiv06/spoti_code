import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, MessageSquare, ExternalLink, Github, Bookmark } from 'lucide-react';
import { SocialPost } from '@/types/social';
import { Avatar } from '@/components/social/Avatar';
import { Badge } from '@/components/social/Badge';
import { cn } from '@/lib/utils';
import { useSocial } from '@/context/SocialContext';

interface ProjectCardProps {
  post: SocialPost;
  variant?: 'grid' | 'list' | 'featured';
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  post, 
  variant = 'grid',
  className 
}) => {
  const { currentUser, likePost, bookmarkPost } = useSocial();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("لطفا وارد شوید");
    likePost(post.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("لطفا وارد شوید");
    bookmarkPost(post.id);
  };

  if (variant === 'list') {
    return (
      <Link href={`/social/post/${post.id}`} className="group block">
        <div className={cn(
          "flex flex-col md:flex-row gap-6 bg-white dark:bg-[#1c1e26] rounded-3xl p-4 md:p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300",
          className
        )}>
          {/* Image */}
          <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#252836]">
            {post.coverImageUrl ? (
               <Image 
                 src={post.coverImageUrl} 
                 alt={post.title} 
                 fill 
                 className="object-cover transition-transform duration-500 group-hover:scale-105" 
               />
            ) : (
               <div className="flex items-center justify-center w-full h-full text-gray-400">بدون تصویر</div>
            )}
            <div className="absolute top-3 right-3 flex gap-2">
                {post.status && (
                    <Badge variant={post.status === 'COMPLETED' ? 'success' : post.status === 'IN_PROGRESS' ? 'warning' : 'glass'} size="sm">
                        {post.status === 'COMPLETED' ? 'تکمیل شده' : post.status === 'IN_PROGRESS' ? 'در حال توسعه' : 'نیاز به فیدبک'}
                    </Badge>
                )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
             <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <Avatar src={post.author.avatarUrl} alt={post.author.displayName} size="sm" />
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-green-500 transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-xs text-gray-500">@{post.author.username} • {new Date(post.createdAt).toLocaleDateString('fa-IR')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleBookmark} className={cn("p-2 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-white/10", post.isBookmarkedByCurrentUser && "text-green-500")}>
                        <Bookmark className={cn("w-5 h-5", post.isBookmarkedByCurrentUser && "fill-current")} />
                    </button>
                    <button onClick={handleLike} className={cn("p-2 rounded-xl transition-colors hover:bg-pink-50 dark:hover:bg-pink-900/20", post.isLikedByCurrentUser ? "text-pink-500" : "text-gray-400 dark:text-gray-500")}>
                        <Heart className={cn("w-5 h-5", post.isLikedByCurrentUser && "fill-current")} />
                    </button>
                </div>
             </div>

             <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                 {post.summary}
             </p>

             <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                 <div className="flex flex-wrap gap-2">
                     {post.tags.slice(0, 4).map(tag => (
                         <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                     ))}
                 </div>
                 <div className="flex items-center gap-4 text-gray-400 text-sm">
                     <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {post.viewsCount}</span>
                     <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {post.commentsCount}</span>
                 </div>
             </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid / Default View
  return (
    <Link href={`/social/post/${post.id}`} className={cn("group block h-full", className)}>
        <div className="relative h-full flex flex-col bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/[0.06] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-900/10 transition-all duration-300 hover:-translate-y-1">
            
            {/* Media Area */}
            <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-[#252836] overflow-hidden">
                {post.coverImageUrl ? (
                    <Image 
                        src={post.coverImageUrl} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <span className="text-sm">بدون تصویر</span>
                    </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-4 right-4 left-4 flex justify-between items-start">
                    <div className="flex gap-2">
                       {post.status && (
                           <Badge variant={post.status === 'COMPLETED' ? 'success' : 'glass'} size="sm" className="backdrop-blur-md">
                               {post.status === 'COMPLETED' ? 'تکمیل' : post.status === 'IN_PROGRESS' ? 'توسعه' : 'فیدبک'}
                           </Badge>
                       )}
                    </div>
                    <button 
                        onClick={handleBookmark}
                        className={cn(
                            "p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white",
                            post.isBookmarkedByCurrentUser && "text-green-400 bg-white/20"
                        )}
                    >
                        <Bookmark className={cn("w-4 h-4", post.isBookmarkedByCurrentUser && "fill-current")} />
                    </button>
                </div>

                {/* Title Overlay (Bottom Left) */}
                <div className="absolute bottom-4 right-4 left-4">
                     <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 mb-1 group-hover:text-green-400 transition-colors">
                         {post.title}
                     </h3>
                     <div className="flex items-center gap-2 text-white/80 text-xs">
                        <span>{new Date(post.createdAt).toLocaleDateString('fa-IR')}</span>
                        <span>•</span>
                        <span>{post.author.displayName}</span>
                     </div>
                </div>

                {/* Quick Actions Overlay (Hover Reveal) */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    {post.demoUrl && (
                        <button onClick={(e) => { e.preventDefault(); window.open(post.demoUrl, '_blank'); }} className="p-3 rounded-full bg-white text-gray-900 hover:scale-110 transition-transform" title="مشاهده دمو">
                            <ExternalLink className="w-5 h-5" />
                        </button>
                    )}
                    {post.githubUrl && (
                        <button onClick={(e) => { e.preventDefault(); window.open(post.githubUrl, '_blank'); }} className="p-3 rounded-full bg-gray-900 text-white hover:scale-110 transition-transform" title="گیت‌هاب">
                            <Github className="w-5 h-5" />
                        </button>
                    )}
                    <div className="p-3 rounded-full bg-green-500 text-white hover:scale-110 transition-transform cursor-pointer">
                        <Eye className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
                    {post.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" size="sm" className="bg-gray-50 dark:bg-[#252836]">
                            {tag}
                        </Badge>
                    ))}
                    {post.tags.length > 3 && (
                        <span className="text-[10px] py-0.5 px-1.5 text-gray-400">+{post.tags.length - 3}</span>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between text-gray-400 text-xs font-medium">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1" title="بازدید">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{post.viewsCount}</span>
                        </div>
                        <div className="flex items-center gap-1" title="دیدگاه">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{post.commentsCount}</span>
                        </div>
                    </div>
                    <div className={cn("flex items-center gap-1 hover:text-pink-500 transition-colors cursor-pointer", post.isLikedByCurrentUser && "text-pink-500")} onClick={handleLike}>
                        <Heart className={cn("w-3.5 h-3.5", post.isLikedByCurrentUser && "fill-current")} />
                        <span>{post.likesCount}</span>
                    </div>
                </div>
            </div>
        </div>
    </Link>
  );
};
