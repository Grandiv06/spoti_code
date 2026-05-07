"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSocial } from "@/context/SocialContext";
import { useProfileSettings } from "@/context/ProfileSettingsContext";
import { cn } from "@/lib/utils";
import { SocialButton } from "@/components/social/SocialButton";
import { ArrowRight, ImagePlus, User, Camera } from "lucide-react";
import Image from "next/image";

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
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, user: authUser } = useAuth();
  const { currentUser } = useSocial();
  const { settings, updateSettings } = useProfileSettings();

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "avatar") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === "banner") updateSettings({ bannerImage: result, useDefaultBanner: false });
      else updateSettings({ avatarImage: result });
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:border-primary transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold">بازگشت</span>
        </button>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">تنظیمات پروفایل</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
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
            </div>
          </div>

          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">شبکه‌های اجتماعی</h3>
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
            </div>
          </div>
        </div>

        {/* Right Column - Media */}
        <div className="space-y-6">
          {/* Avatar Edit */}
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm p-6 text-center">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
              تصویر پروفایل
            </label>
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#14161c] overflow-hidden shadow-xl bg-gray-100 dark:bg-white/5 mx-auto">
                {settings.avatarImage || currentUser?.avatarUrl ? (
                  <Image
                    src={settings.avatarImage || currentUser?.avatarUrl || ""}
                    alt="آواتار"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-full h-full p-6 text-gray-300" />
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full border-4 border-white dark:border-[#1c1e26] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "avatar")}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">تصویر با فرمت JPG، PNG یا WEBP</p>
          </div>

          {/* Banner Edit */}
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-sm p-6">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">
              بنر پروفایل
            </label>
            <div 
              className="w-full h-24 rounded-2xl mb-4 relative overflow-hidden group cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/10"
              onClick={() => bannerInputRef.current?.click()}
              style={
                settings.bannerImage
                  ? { backgroundImage: `url(${settings.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : !settings.useDefaultBanner
                  ? { backgroundColor: settings.bannerColor }
                  : undefined
              }
            >
              {settings.useDefaultBanner && !settings.bannerImage && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/90 to-teal-50/70 dark:bg-[linear-gradient(135deg,#0a0a0a,#0d1210,#051008)]" />
                  <div className="absolute inset-0 bg-repeat bg-[url('/patterns/spoticode-banner-pattern-light.svg')] dark:bg-[url('/patterns/spoticode-banner-pattern.svg')]" style={{ backgroundSize: "80px 80px" }} />
                </>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                <ImagePlus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <input
              type="file"
              ref={bannerInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "banner")}
            />
            
            <div className="space-y-4">
              <button
                onClick={() => updateSettings({ useDefaultBanner: true, bannerImage: "" })}
                className={cn(
                  "w-full py-2 px-4 rounded-xl border text-sm font-medium transition-all",
                  settings.useDefaultBanner && !settings.bannerImage
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 cursor-pointer text-gray-600 dark:text-gray-400"
                )}
              >
                استفاده از طرح پیش‌فرض
              </button>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSettings({ bannerColor: color, useDefaultBanner: false, bannerImage: "" })}
                    className={cn(
                      "w-8 h-8 rounded-lg transition-all",
                      settings.bannerColor === color && !settings.useDefaultBanner && !settings.bannerImage
                        ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-[#1c1e26] scale-110"
                        : "hover:scale-105 cursor-pointer"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <SocialButton
              variant="primary"
              className="w-full py-4 text-base font-black shadow-lg shadow-green-500/20"
              onClick={() => router.push("/panel/profile")}
            >
              ذخیره تغییرات
            </SocialButton>
            <button
              onClick={() => router.back()}
              className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              انصراف و بازگشت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PanelProfileEditPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-12 flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileEditContent />
    </Suspense>
  );
}
