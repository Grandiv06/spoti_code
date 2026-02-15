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
      {/* Quick Stats Card */}
      <div className="bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          آمار سریع
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {user.stats.daysActive}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              روز فعالیت
            </div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {user.stats.reputation}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              امتیاز
            </div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {user.stats.followers}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              دنبال‌کننده
            </div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {user.stats.following}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              دنبال‌شونده
            </div>
          </div>
        </div>
      </div>

      {/* MBTI Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-3xl p-6 shadow-lg shadow-purple-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Brain className="w-5 h-5" />
              شخصیت MBTI
            </h3>
            <span className="text-2xl font-black bg-white/20 px-3 py-1 rounded-xl backdrop-blur-md">
              {user.mbti}
            </span>
          </div>
          <p className="text-purple-100 text-sm leading-relaxed mb-4">
            معماران تخیلاتی استراتژیک دارند و برای هر چیزی برنامه‌ای دارند. آنها
            تحلیل‌گر، خلاق و مستقل هستند.
          </p>
          <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[75%] rounded-full opacity-80" />
          </div>
          <div className="flex justify-between text-xs text-purple-200 mt-1">
            <span>Introverted</span>
            <span>75%</span>
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
      </div>

      {/* Skills Card */}
      <div className="bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-500" />
          مهارت‌ها
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

       {/* Achievements/Badges (Optional Visual) */}
       <div className="bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-500" />
            دستاوردها
        </h3>
        <div className="flex justify-between">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help" title="Locked Badge">
                    <Trophy className="w-5 h-5 text-yellow-500 opacity-50" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
