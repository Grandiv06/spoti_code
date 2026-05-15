"use client";

import React from "react";
import { Zap, Trophy, Brain, Code2, Users } from "lucide-react";

interface ProfileSidebarProps {
  user: {
    stats: {
      daysActive: number;
      reputation: number;
      followers: number;
      following: number;
    };
    skills: string[];
    mbti: string;
  };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Skills Card */}
      <div className="group bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-4xl p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 text-lg group-hover:translate-x-1 md:group-hover:-translate-x-1 transition-transform">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Code2 className="w-5 h-5 text-blue-500" />
          </div>
          مهارت‌ها
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {user.skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-2xl text-sm font-semibold hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300 cursor-default border border-transparent hover:border-blue-400 shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* MBTI Card */}
      <div className="group bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 text-white rounded-4xl p-8 shadow-xl shadow-indigo-500/20 relative overflow-hidden transition-all duration-500 hover:scale-[1.02]">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Brain className="w-5 h-5" />
              </div>
              شخصیت MBTI
            </h3>
            <span className="text-3xl font-black bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner">
              {user.mbti}
            </span>
          </div>
          <p className="text-purple-100 text-base leading-relaxed font-medium opacity-90">
            معماران تخیلاتی استراتژیک دارند و برای هر چیزی برنامه‌ای دارند. آنها
            تحلیل‌گر، خلاق و مستقل هستند.
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-3xl -ml-16 -mb-16" />
      </div>

       {/* Achievements/Badges */}
       <div className="group bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-4xl p-8 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 text-lg group-hover:translate-x-1 md:group-hover:-translate-x-1 transition-transform">
          <div className="p-2 bg-orange-500/10 rounded-xl">
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
            دستاوردها
        </h3>
        <div className="flex justify-between gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 aspect-square rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help border border-transparent hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10" title="Locked Badge">
                    <Trophy className="w-6 h-6 text-orange-500" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
