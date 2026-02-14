import React from 'react';
import { SocialUser } from '@/types/social';
import { Avatar } from '@/components/social/Avatar';
import { SocialButton } from '@/components/social/SocialButton';
import Link from 'next/link';

interface AuthorCardProps {
  author: SocialUser;
  onFollow?: () => void;
  isFollowing?: boolean;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, onFollow, isFollowing }) => {
  return (
    <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <Link href={`/social/profile/${author.id}`} className="group relative mb-4">
             <Avatar src={author.avatarUrl} alt={author.displayName} size="lg" />
        </Link>
        
        <Link href={`/social/profile/${author.id}`} className="hover:text-green-500 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{author.displayName}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-4">@{author.username}</p>
        
        {author.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                {author.bio}
            </p>
        )}

        <div className="flex items-center justify-center gap-4 w-full mb-6 text-sm">
            <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 dark:text-white">{author.followersCount}</span>
                <span className="text-gray-500 text-xs">دنبال‌کننده</span>
            </div>
            <div className="w-px h-8 bg-gray-100 dark:bg-white/[0.1]" />
             <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 dark:text-white">{author.postsCount}</span>
                <span className="text-gray-500 text-xs">پروژه</span>
            </div>
        </div>

        <SocialButton 
            variant={isFollowing ? "outline" : "primary"} 
            className="w-full"
            onClick={onFollow}
        >
            {isFollowing ? "دنبال می‌کنید" : "دنبال کردن"}
        </SocialButton>
      </div>
    </div>
  );
};
