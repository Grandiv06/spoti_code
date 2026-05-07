"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSocial } from "@/context/SocialContext";
import { useProfileSettings } from "@/context/ProfileSettingsContext";
import ProfileHeader from "../../social/profile/_components/ProfileHeader";
import ProfileSidebar from "../../social/profile/_components/ProfileSidebar";
import ProjectsTabs from "../../social/profile/_components/ProjectsTabs";
import ActivityTabs from "../../social/profile/_components/ActivityTabs";
import { SocialButton } from "@/components/social/SocialButton";

export default function PanelProfilePage() {
  const router = useRouter();
  const { currentUser } = useSocial();
  const { settings } = useProfileSettings();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">لطفاً وارد شوید</h2>
        <SocialButton variant="primary" onClick={() => router.push("/login")}>
          ورود
        </SocialButton>
      </div>
    );
  }

  // Combine currentUser data with settings
  const userProfileData = {
    displayName: settings.displayName || currentUser.displayName,
    username: currentUser.username,
    description: settings.bio || currentUser.bio || "عاشق یادگیری تکنولوژی‌های وب و ساخت رابط‌های کاربری مدرن.",
    bannerUrl: settings.bannerImage || "",
    avatarUrl: settings.avatarImage || currentUser.avatarUrl,
    role: "Frontend Learner",
    mbti: "INTJ", // Default if not in settings
    location: settings.location || "تهران، ایران",
    joinDate: "۱۴۰۲",
    socials: {
      github: settings.githubUrl || `https://github.com/${currentUser.username}`,
      linkedin: settings.linkedinUrl || "",
      website: settings.websiteUrl || "",
    },
    stats: {
      daysActive: 124,
      reputation: 850,
      followers: currentUser.followersCount || 0,
      following: currentUser.followingCount || 0,
    },
    skills: [
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Git",
      "Figma",
    ],
  };

  return (
    <main className="min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Decorative Background Blob */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-green-500/10 blur-[120px] rounded-b-[100%] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-4">
        {/* Header Section */}
        <ProfileHeader user={userProfileData} isOwnProfile={true} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 md:mt-10">
          {/* Left Column (Main Content) - Wide */}
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            <ProjectsTabs />
            <ActivityTabs />
          </div>

          {/* Right Column (Sidebar) - Narrow */}
          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <ProfileSidebar user={userProfileData} />
          </div>
        </div>
      </div>
    </main>
  );
}
