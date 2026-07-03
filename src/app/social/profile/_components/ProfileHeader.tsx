"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Github,
  Linkedin,
  Globe,
  Share2,
  Briefcase,
  Sparkles,
  Edit3,
  Send,
} from "lucide-react";

interface ProfileHeaderProps {
  user: {
    displayName: string;
    username: string;
    description: string;
    bannerUrl: string;
    avatarUrl: string;
    role: string;
    mbti: string;
    joinDate: string;
    socials: {
      github?: string;
      linkedin?: string;
      telegram?: string;
      website?: string;
    };
  };
  isOwnProfile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile }) => {
  const router = useRouter();
  return (
    <div className="relative w-full mb-12 md:mb-16 overflow-visible">
      {/* Banner - Default pattern */}
      <div className="h-48 md:h-64 w-full rounded-4xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/90 to-teal-50/70 dark:bg-[linear-gradient(135deg,#0a0a0a_0%,#0d1210_25%,#051008_50%,#0a0f0c_75%,#080c0a_100%)]" />
        <div
          className="absolute inset-0 bg-repeat bg-[url('/patterns/spoticode-banner-pattern-light.svg')] dark:bg-[url('/patterns/spoticode-banner-pattern.svg')]"
          style={{ backgroundSize: "480px 480px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      </div>

      {/* Profile Info Container */}
      <div className="px-6 md:px-10 relative">
        <div className="flex flex-col md:flex-row items-center md:items-start -mt-16 md:-mt-20 gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#14161c] overflow-hidden shadow-2xl bg-white dark:bg-[#1c1e26]">
              <Image
                src={user.avatarUrl}
                alt={user.displayName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
            {/* Vertical connector line - profile to growth path */}
            <div
              className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-0.5 min-h-[80px] h-28 md:h-36 pointer-events-none"
              aria-hidden
            >
              <div className="w-full h-full bg-gradient-to-b from-green-500/70 via-green-500/45 to-transparent rounded-full" />
            </div>
          </div>

          {/* User Details */}
          <div className="pt-8 md:pt-28 flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex flex-col items-center md:items-start text-center md:text-right">
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-gray-100 transition-all">
                  {user.displayName}
                </h1>

                <div className="flex items-center justify-center md:justify-start gap-4 mt-6 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5">
                    <Briefcase className="w-4 h-4 text-green-500" />
                    {user.role}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    عضو از {user.joinDate}
                  </span>
                </div>

                <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                  {user.description}
                </p>
              </div>

              {/* Actions & Socials */}
              <div className="flex flex-col items-center md:items-end gap-6 mt-6 md:mt-0 w-full md:w-auto">
                <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                  {isOwnProfile && (
                    <button 
                      onClick={() => router.push("/panel/profile/edit")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-xl shadow-green-500/25 transition-all font-bold active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>ویرایش پروفایل</span>
                    </button>
                  )}
                  <button className="p-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-all shadow-sm active:scale-90 cursor-pointer">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-5 mt-2">
                  {user.socials.github && (
                    <a
                      href={user.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110"
                      aria-label="گیت‌هاب"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {user.socials.linkedin && (
                    <a
                      href={user.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-[#0077b5] transition-all hover:scale-110"
                      aria-label="لینکدین"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {user.socials.telegram && (
                    <a
                      href={user.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-sky-500 transition-all hover:scale-110"
                      aria-label="تلگرام"
                    >
                      <Send className="w-6 h-6" />
                    </a>
                  )}
                  {user.socials.website && (
                    <a
                      href={user.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-green-500 transition-all hover:scale-110"
                      aria-label="وب‌سایت"
                    >
                      <Globe className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
