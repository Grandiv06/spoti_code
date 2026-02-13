"use client";

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useSocial } from '@/context/SocialContext';
import { Avatar } from '@/components/social/Avatar';
import { SocialButton } from '@/components/social/SocialButton';
import { PostCard } from '@/components/social/PostCard';
import { MapPin, Link as LinkIcon, Calendar, Users, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocialUser } from '@/types/social';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage(props: PageProps) {
  const params = use(props.params);
  const router = useRouter();
  const { getUserById, getUserPosts, currentUser, followUser } = useSocial();
  const user = getUserById(params.id);
  const userPosts = user ? getUserPosts(user.id) : [];

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">کاربر یافت نشد</h2>
            <SocialButton onClick={() => router.back()} variant="outline" leftIcon={<ArrowRight className="w-4 h-4" />}>
                بازگشت
            </SocialButton>
        </div>
    );
  }

  const isCurrentUser = currentUser?.id === user.id;

  const handleFollow = () => {
      if (!currentUser) return alert("برای دنبال کردن باید وارد شوید");
      followUser(user.id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Profile Header Card */}
       <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
           {/* Banner */}
           <div className="h-48 bg-gradient-to-r from-green-400 to-emerald-600 opacity-90" />
           
           <div className="px-8 pb-8">
               <div className="relative flex justify-between items-end -mt-12 mb-6">
                   <div className="border-4 border-white dark:border-gray-900 rounded-full bg-white dark:bg-gray-900">
                       <Avatar src={user.avatarUrl} alt={user.displayName} size="xl" />
                   </div>
                   <div className="flex gap-2 mb-2">
                       {isCurrentUser ? (
                           <SocialButton variant="outline" onClick={() => router.push('/social/dashboard')}>
                               ویرایش پروفایل
                           </SocialButton>
                       ) : (
                           <SocialButton variant="primary" onClick={handleFollow}>
                               دنبال کردن
                           </SocialButton>
                       )}
                   </div>
               </div>

               <div className="space-y-4">
                   <div>
                       <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                           {user.displayName}
                           {/* Verified Badge Mock */}
                           <span className="text-blue-500" title="تایید شده">
                               <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                           </span>
                       </h1>
                       <p className="text-gray-500 font-medium">@{user.username}</p>
                   </div>

                   <p className="max-w-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                       {user.bio}
                   </p>

                   <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                       <div className="flex items-center gap-1.5">
                           <MapPin className="w-4 h-4" />
                           <span>تهران، ایران</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                           <LinkIcon className="w-4 h-4" />
                           <a href="#" className="hover:text-green-500 transition-colors">github.com/{user.username}</a>
                       </div>
                       <div className="flex items-center gap-1.5">
                           <Calendar className="w-4 h-4" />
                           <span>عضویت: {new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
                       </div>
                   </div>

                   <div className="flex gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                       <div className="flex items-center gap-1">
                           <span className="font-bold text-gray-900 dark:text-white">{user.followersCount}</span>
                           <span className="text-gray-500 text-sm">دنبال‌کننده</span>
                       </div>
                       <div className="flex items-center gap-1">
                           <span className="font-bold text-gray-900 dark:text-white">{user.followingCount}</span>
                           <span className="text-gray-500 text-sm">دنبال‌شونده</span>
                       </div>
                       <div className="flex items-center gap-1">
                           <span className="font-bold text-gray-900 dark:text-white">{userPosts.length}</span>
                           <span className="text-gray-500 text-sm">پروژه</span>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* Tabs */}
       <div className="border-b border-gray-200 dark:border-gray-800">
           <nav className="flex gap-8" aria-label="Tabs">
               <button className="border-b-2 border-green-500 py-4 px-1 text-sm font-medium text-green-600 dark:text-green-400" aria-current="page">
                   پروژه‌ها
               </button>
               <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300">
                   درباره من
               </button>
           </nav>
       </div>

       {/* Posts Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
           {userPosts.map(post => (
               <PostCard key={post.id} post={post} />
           ))}
           {userPosts.length === 0 && (
               <div className="col-span-full text-center py-12 text-gray-500">
                   هنوز پروژه‌ای منتشر نشده است.
               </div>
           )}
       </div>
    </div>
  );
}
