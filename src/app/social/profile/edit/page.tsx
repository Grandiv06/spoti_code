"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSocial } from "@/context/SocialContext";
import { useProfileSettings } from "@/context/ProfileSettingsContext";
import { cn } from "@/lib/utils";
import { SocialButton } from "@/components/social/SocialButton";
import { ArrowRight } from "lucide-react";

const PRESET_COLORS = [
  "#22c55e",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export default function ProfileEditPage() {
  const router = useRouter();
  const { isAuthenticated, user: authUser } = useAuth();
  const { currentUser } = useSocial();
  const { settings, updateSettings } = useProfileSettings();
  const profileId = currentUser?.id || authUser?.id;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (authUser?.displayName && !settings.displayName) {
      updateSettings({ displayName: authUser.displayName });
    }
  }, [authUser?.displayName]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
        <span className="text-sm font-medium">بازگشت</span>
      </button>

      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/[0.06] overflow-hidden shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white px-6 pt-6 pb-4">
          ویرایش پروفایل
        </h2>

        <div className="p-6 space-y-6">
          {/* Banner Color */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              رنگ بنر
            </label>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateSettings({ bannerColor: color })}
                  className={cn(
                    "w-10 h-10 rounded-xl transition-all ring-2 ring-offset-2 dark:ring-offset-[#1c1e26]",
                    settings.bannerColor === color
                      ? "ring-gray-900 dark:ring-white scale-110"
                      : "ring-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="color"
                value={settings.bannerColor}
                onChange={(e) => updateSettings({ bannerColor: e.target.value })}
                className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {settings.bannerColor}
              </span>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              نام نمایشی
            </label>
            <input
              id="displayName"
              type="text"
              value={settings.displayName}
              onChange={(e) => updateSettings({ displayName: e.target.value })}
              placeholder="نام شما"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              درباره من
            </label>
            <textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => updateSettings({ bio: e.target.value })}
              placeholder="چند خط درباره خودتان بنویسید..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              محل سکونت
            </label>
            <input
              id="location"
              type="text"
              value={settings.location}
              onChange={(e) => updateSettings({ location: e.target.value })}
              placeholder="تهران، ایران"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* GitHub */}
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              لینک گیت‌هاب
            </label>
            <input
              id="githubUrl"
              type="url"
              value={settings.githubUrl}
              onChange={(e) => updateSettings({ githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <SocialButton
              variant="primary"
              onClick={() => router.push(`/social/profile/${profileId}`)}
            >
              ذخیره و مشاهده پروفایل
            </SocialButton>
            <SocialButton variant="outline" onClick={() => router.back()}>
              انصراف
            </SocialButton>
          </div>
        </div>
      </div>
    </div>
  );
}
