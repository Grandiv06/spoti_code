"use client";

import React, { useState } from 'react';
import { useSocial } from '@/context/SocialContext';
import { PostCard } from '@/components/social/PostCard';
import { SocialButton } from '@/components/social/SocialButton';
import { Avatar } from '@/components/social/Avatar';
import { PlusCircle, LayoutGrid, BarChart3, Lock } from 'lucide-react';
import { CreatePostModal } from '@/components/social/CreatePostModal'; // Will create next

export default function DashboardPage() {
  const { currentUser, getUserPosts } = useSocial();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const myPosts = currentUser ? getUserPosts(currentUser.id) : [];

  if (!currentUser) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">دسترسی محدود</h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      برای مدیریت پروژه‌ها و مشاهده آمار، لطفاً وارد حساب کاربری خود شوید.
                  </p>
              </div>
              {/* Note: The sidebar has the login button, but we can add one here too if we exported it */}
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">پروژه‌های من</h1>
                <p className="text-gray-500 dark:text-gray-400">مدیریت و انتشار کدهای شما</p>
            </div>
            <SocialButton 
                variant="primary" 
                leftIcon={<PlusCircle className="w-5 h-5" />}
                onClick={() => setIsCreateModalOpen(true)}
            >
                پروژه جدید
            </SocialButton>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                    <LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">{currentUser.postsCount}</span>
                    <span className="text-sm text-gray-500">پروژه فعال</span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-xl">
                    <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">12.5k</span>
                    <span className="text-sm text-gray-500">بازدید کل</span>
                </div>
            </div>
            {/* More stats... */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPosts.map(post => (
                <div key={post.id} className="relative group">
                    <PostCard post={post} />
                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <SocialButton size="sm" variant="glass" className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border-transparent">
                             ویرایش
                         </SocialButton>
                    </div>
                </div>
            ))}
        </div>
        
        {isCreateModalOpen && (
            <CreatePostModal onClose={() => setIsCreateModalOpen(false)} />
        )}
    </div>
  );
}
