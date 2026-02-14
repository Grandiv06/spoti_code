"use client";

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useSocial } from '@/context/SocialContext';
import { useProfileSettings } from '@/context/ProfileSettingsContext';
import { Avatar } from '@/components/social/Avatar';
import { SocialButton } from '@/components/social/SocialButton';
import { PostCard } from '@/components/social/PostCard';
import { MapPin, Link as LinkIcon, Calendar, ArrowRight, Camera, Linkedin, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const { settings, updateSettings } = useProfileSettings();

  const handleFollow = () => {
      if (!currentUser) return alert("برای دنبال کردن باید وارد شوید");
      followUser(user.id);
  };

  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'avatar') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'banner') {
        updateSettings({ bannerImage: result, useDefaultBanner: false });
      } else {
        updateSettings({ avatarImage: result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <SocialButton
         variant="outline"
         onClick={() => router.back()}
         leftIcon={<ArrowRight className="w-4 h-4" />}
         className="mb-2"
       >
         بازگشت
       </SocialButton>

       {/* Profile Header Card */}
       <div className="relative bg-white dark:bg-[#1c1e26] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/[0.06]">
           {/* Banner */}
           <div
             className="group/banner relative h-48 overflow-hidden transition-colors duration-300"
             style={isCurrentUser && settings.bannerImage
               ? { backgroundImage: `url(${settings.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }
               : isCurrentUser && !settings.useDefaultBanner && !settings.bannerImage
               ? { backgroundColor: settings.bannerColor }
               : undefined
             }
           >
             {/* Default banner: for current user (when default) OR for all other users */}
             {((isCurrentUser && settings.useDefaultBanner && !settings.bannerImage) || !isCurrentUser) && (
               <>
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/90 to-teal-50/70 dark:bg-[linear-gradient(135deg,#0a0a0a_0%,#0d1210_25%,#051008_50%,#0a0f0c_75%,#080c0a_100%)]" />
                 <div
                   className="absolute inset-0 bg-repeat bg-[url('/patterns/spoticode-banner-pattern-light.svg')] dark:bg-[url('/patterns/spoticode-banner-pattern.svg')]"
                   style={{ backgroundSize: "480px 480px" }}
                 />
               </>
             )}
             <input 
               type="file" 
               ref={bannerInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={(e) => handleImageUpload(e, 'banner')}
             />
             {isCurrentUser && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/banner:bg-black/20 transition-colors duration-200">
                 <button
                   onClick={() => bannerInputRef.current?.click()}
                   className="opacity-0 group-hover/banner:opacity-100 transition-opacity duration-200 p-2.5 rounded-full bg-white/90 dark:bg-white/90 text-gray-800 shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                   aria-label="تغییر بنر"
                 >
                   <Camera className="w-5 h-5" />
                 </button>
               </div>
             )}
           </div>
           
           <div className="px-8 pb-8">
               <div className="relative flex justify-between items-end -mt-12 mb-6">
                   <div className="relative group/avatar border-4 border-white dark:border-[#1c1e26] rounded-full bg-white dark:bg-[#1c1e26]">
                       <Avatar 
                         src={isCurrentUser && settings.avatarImage ? settings.avatarImage : user.avatarUrl} 
                         alt={user.displayName} 
                         size="xl" 
                       />
                       {isCurrentUser && (
                         <div 
                           className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/avatar:bg-black/40 rounded-full transition-colors duration-200 cursor-pointer"
                           onClick={() => avatarInputRef.current?.click()}
                         >
                            <Camera className="w-8 h-8 text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200" />
                         </div>
                       )}
                       <input 
                         type="file" 
                         ref={avatarInputRef} 
                         className="hidden" 
                         accept="image/*"
                         onChange={(e) => handleImageUpload(e, 'avatar')}
                       />
                   </div>
                   <div className="flex gap-2 mb-2">
                       {isCurrentUser ? (
                           <SocialButton variant="outline" onClick={() => router.push('/social/profile/edit')}>
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
                           {isCurrentUser && settings.displayName ? settings.displayName : user.displayName}
                           {/* Verified Badge Mock */}
                           <span className="text-blue-500" title="تایید شده">
                               <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                           </span>
                       </h1>
                       <p className="text-gray-500 font-medium">@{user.username}</p>
                   </div>

                   <p className="max-w-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                       {isCurrentUser && settings.bio ? settings.bio : user.bio}
                   </p>

                   <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                       <div className="flex items-center gap-1.5">
                           <MapPin className="w-4 h-4" />
                           <span>{isCurrentUser && settings.location ? settings.location : "تهران، ایران"}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                           <LinkIcon className="w-4 h-4" />
                           <a href={(isCurrentUser ? settings.githubUrl : undefined) || `https://github.com/${user.username}`} className="hover:text-green-500 transition-colors" target="_blank" rel="noopener noreferrer">
                             {(isCurrentUser ? settings.githubUrl : `github.com/${user.username}`)?.replace(/^https?:\/\//, "") || `github.com/${user.username}`}
                           </a>
                       </div>
                       {isCurrentUser && settings.linkedinUrl && (
                         <div className="flex items-center gap-1.5">
                           <Linkedin className="w-4 h-4" />
                           <a href={settings.linkedinUrl} className="hover:text-green-500 transition-colors" target="_blank" rel="noopener noreferrer">
                             {settings.linkedinUrl.replace(/^https?:\/\//, "")}
                           </a>
                         </div>
                       )}
                       {isCurrentUser && settings.telegramUrl && (
                         <div className="flex items-center gap-1.5">
                           <Send className="w-4 h-4" />
                           <a href={settings.telegramUrl} className="hover:text-green-500 transition-colors" target="_blank" rel="noopener noreferrer">
                             {settings.telegramUrl.replace(/^https?:\/\//, "")}
                           </a>
                         </div>
                       )}
                       <div className="flex items-center gap-1.5">
                           <Calendar className="w-4 h-4" />
                           <span>عضویت: {new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
                       </div>
                   </div>

                   <div className="flex gap-6 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
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
       <div className="border-b border-gray-200 dark:border-white/[0.06]">
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
