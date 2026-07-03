"use client";

import React from "react";
import { Trophy, Code2 } from "lucide-react";

interface ProfileSidebarProps {
  user: {
    stats: {
      daysActive: number;
      reputation: number;
      followers: number;
      following: number;
    };
    skills: string[];
  };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="group bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-4xl p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 text-lg group-hover:translate-x-1 md:group-hover:-translate-x-1 transition-transform">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Code2 className="w-5 h-5 text-blue-500" />
          </div>
          مهارت‌ها
        </h3>
        {user.skills.length === 0 ? (
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            هنوز مهارتی ثبت نشده است.
          </p>
        ) : (
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
        )}
      </div>

      <div className="group bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-4xl p-8 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 text-lg group-hover:translate-x-1 md:group-hover:-translate-x-1 transition-transform">
          <div className="p-2 bg-orange-500/10 rounded-xl">
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          دستاوردها
        </h3>
        <div className="flex justify-between gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 aspect-square rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help border border-transparent hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10"
              title="Locked Badge"
            >
              <Trophy className="w-6 h-6 text-orange-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
