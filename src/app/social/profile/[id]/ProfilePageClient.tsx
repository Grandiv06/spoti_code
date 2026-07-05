"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { fetchPublicProfile, getProfileSocialLinks } from "@/lib/panel-profile";
import ProfileHeader from "../_components/ProfileHeader";
import ProfileSidebar from "../_components/ProfileSidebar";
import ProjectsTabs from "../_components/ProjectsTabs";
import ActivityTabs from "../_components/ActivityTabs";
import { SocialButton } from "@/components/social/SocialButton";

type ApiProfile = {
  displayName?: string;
  bio?: string;
  avatarImage?: string;
  bannerImage?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  telegramUrl?: string;
  websiteUrl?: string;
  skills?: string[];
  role?: string;
  joinDate?: string;
  location?: string;
  mbti?: string;
};

function buildUsername(userId: string) {
  const normalized = userId.trim();
  if (!normalized) return "user";
  return normalized.replace(/^USR-/i, "").toLowerCase();
}

export default function ProfilePageClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [apiProfile, setApiProfile] = React.useState<ApiProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      setNotFound(false);
      setError(null);
      setApiProfile(null);

      try {
        const result = await fetchPublicProfile(userId);
        if (!active) return;
        setApiProfile(result as ApiProfile);
      } catch (requestError) {
        if (!active) return;
        const message = requestError instanceof Error ? requestError.message : "";
        if (message.includes("پیدا نشد")) {
          setNotFound(true);
          return;
        }
        setError(message || "خطا در بارگذاری پروفایل");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <main className="min-h-screen pb-20 animate-pulse">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-4 space-y-8">
          <div className="h-64 rounded-4xl bg-gray-100 dark:bg-white/5" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-96 rounded-3xl bg-gray-100 dark:bg-white/5" />
            <div className="lg:col-span-4 h-64 rounded-3xl bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">کاربر یافت نشد</h2>
        <p className="mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          پروفایل این کاربر در دسترس نیست.
        </p>
        <SocialButton variant="outline" onClick={() => router.back()}>
          بازگشت
        </SocialButton>
      </div>
    );
  }

  if (error || !apiProfile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">خطا در بارگذاری پروفایل</h2>
        <p className="mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">{error}</p>
        <SocialButton variant="outline" onClick={() => router.back()}>
          بازگشت
        </SocialButton>
      </div>
    );
  }

  const socials = getProfileSocialLinks(apiProfile);
  const displayName = apiProfile.displayName?.trim() || "کاربر اسپاتی‌کد";

  const userProfileData = {
    displayName,
    username: buildUsername(userId),
    description:
      apiProfile.bio?.trim() || "این کاربر هنوز درباره خودش توضیحی ثبت نکرده است.",
    bannerUrl: apiProfile.bannerImage || "",
    avatarUrl: apiProfile.avatarImage || "/images/student1.jpg",
    role: apiProfile.role || "یادگیرنده",
    mbti: apiProfile.mbti || "",
    joinDate: apiProfile.joinDate || "—",
    location: apiProfile.location || "",
    socials,
    stats: {
      daysActive: 0,
      reputation: 0,
      followers: 0,
      following: 0,
    },
    skills: apiProfile.skills ?? [],
  };

  return (
    <main className="min-h-screen pb-20 animate-in fade-in duration-500">
      <div className="pointer-events-none fixed top-0 left-0 -z-10 h-[500px] w-full rounded-b-[100%] bg-green-500/10 blur-[120px]" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-4">
        <ProfileHeader user={userProfileData} />

        <div className="mt-6 grid grid-cols-1 gap-8 md:mt-10 lg:grid-cols-12">
          <div className="order-2 space-y-8 lg:order-1 lg:col-span-8">
            <ProjectsTabs />
            <ActivityTabs />
          </div>

          <div className="order-1 space-y-8 lg:order-2 lg:col-span-4">
            <ProfileSidebar user={userProfileData} />
          </div>
        </div>
      </div>
    </main>
  );
}
