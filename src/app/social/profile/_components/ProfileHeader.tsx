"use client";

import React from "react";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Globe,
  Share2,
  UserPlus,
  MapPin,
  Briefcase,
  Sparkles,
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
    location: string;
    joinDate: string;
    socials: {
      github?: string;
      linkedin?: string;
      website?: string;
    };
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="relative w-full mb-8">
      {/* Banner - Default pattern */}
      <div className="h-48 md:h-64 w-full rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/90 to-teal-50/70 dark:bg-[linear-gradient(135deg,#0a0a0a_0%,#0d1210_25%,#051008_50%,#0a0f0c_75%,#080c0a_100%)]" />
        <div
          className="absolute inset-0 bg-repeat bg-[url('/patterns/spoticode-banner-pattern-light.svg')] dark:bg-[url('/patterns/spoticode-banner-pattern.svg')]"
          style={{ backgroundSize: "480px 480px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      </div>

      {/* Profile Info Container */}
      <div className="px-6 md:px-10 relative">
        <div className="flex flex-col md:flex-row items-start -mt-16 md:-mt-20 gap-6">
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
            {/* Online/Status Indicator (Optional) */}
            <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 w-5 h-5 bg-green-500 border-4 border-white dark:border-[#14161c] rounded-full" />
          </div>

          {/* User Details */}
          <div className="pt-8 md:pt-28 flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  {user.displayName}
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded-full border border-green-200 dark:border-green-500/30">
                    {user.mbti}
                  </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base mt-1">
                  @{user.username}
                </p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-green-500" />
                    {user.role}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {user.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    عضو از {user.joinDate}
                  </span>
                </div>

                <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                  {user.description}
                </p>
              </div>

              {/* Actions & Socials */}
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 transition-all font-medium active:scale-95">
                    <UserPlus className="w-4 h-4" />
                    <span>دنبال کردن</span>
                  </button>
                  <button className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  {user.socials.github && (
                    <a
                      href={user.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {user.socials.linkedin && (
                    <a
                      href={user.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-[#0077b5] dark:text-gray-400 dark:hover:text-[#0077b5] transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {user.socials.website && (
                    <a
                      href={user.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                    >
                      <Globe className="w-5 h-5" />
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
