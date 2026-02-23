"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSocial } from "@/context/SocialContext";
import { useProfileSettings } from "@/context/ProfileSettingsContext";
import { cn } from "@/lib/utils";
import { SocialButton } from "@/components/social/SocialButton";
import { ArrowRight, ImagePlus } from "lucide-react";

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

function ProfileEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const fromPanel = searchParams.get("from") === "panel";
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
          {/* Banner */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              بنر پروفایل
            </label>
            <input
              type="file"
              ref={bannerInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateSettings({ bannerImage: reader.result as string, useDefaultBanner: false });
                };
                reader.readAsDataURL(file);
              }}
            />
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => updateSettings({ useDefaultBanner: true, bannerImage: "" })}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all",
                  settings.useDefaultBanner && !settings.bannerImage
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                )}
              >
                <div className="w-12 h-8 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/90 to-teal-50/70 dark:bg-[linear-gradient(135deg,#0a0a0a,#0d1210,#051008)]" />
                  <div className="absolute inset-0 bg-repeat bg-[url('/patterns/spoticode-banner-pattern-light.svg')] dark:bg-[url('/patterns/spoticode-banner-pattern.svg')]" style={{ backgroundSize: "60px 60px" }} />
                </div>
                <span className="text-sm font-medium">پیش‌فرض (لوگوی اسپاتی‌کد)</span>
              </button>
              <button
                onClick={() => updateSettings({ useDefaultBanner: false, bannerImage: "" })}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all",
                  !settings.useDefaultBanner && !settings.bannerImage
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                )}
              >
                <div className="w-12 h-8 rounded-lg" style={{ backgroundColor: settings.bannerColor }} />
                <span className="text-sm font-medium">رنگ دلخواه</span>
              </button>
              <button
                onClick={() => bannerInputRef.current?.click()}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all",
                  settings.bannerImage
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                )}
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-sm font-medium">آپلود تصویر</span>
              </button>
            </div>
            {!settings.useDefaultBanner && (
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
                <div className="flex items-center gap-3">
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
            )}
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

          {/* Social Links */}
          <div className="space-y-4">
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
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                لینک لینکدین
              </label>
              <input
                id="linkedinUrl"
                type="url"
                value={settings.linkedinUrl}
                onChange={(e) => updateSettings({ linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="telegramUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                لینک تلگرام
              </label>
              <input
                id="telegramUrl"
                type="url"
                value={settings.telegramUrl}
                onChange={(e) => updateSettings({ telegramUrl: e.target.value })}
                placeholder="https://t.me/username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#14161c] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <SocialButton
              variant="primary"
              onClick={() => router.push(fromPanel ? "/panel/profile" : `/social/profile/${profileId}`)}
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

export default function ProfileEditPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-12 flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileEditContent />
    </Suspense>
  );
}
