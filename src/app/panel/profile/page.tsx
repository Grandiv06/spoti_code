"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSocial } from "@/context/SocialContext";
import { useProfileSettings } from "@/context/ProfileSettingsContext";
import { fetchMyProfile, getProfileSocialLinks } from "@/lib/panel-profile";
import ProfileHeader from "../../social/profile/_components/ProfileHeader";
import ProfileSidebar from "../../social/profile/_components/ProfileSidebar";
import ProjectsTabs from "../../social/profile/_components/ProjectsTabs";
import ActivityTabs from "../../social/profile/_components/ActivityTabs";
import { SocialButton } from "@/components/social/SocialButton";

export default function PanelProfilePage() {
  const router = useRouter();
  const { currentUser } = useSocial();
  const { settings } = useProfileSettings();
  const [apiProfile, setApiProfile] = React.useState<Partial<typeof settings> | null>(null);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await fetchMyProfile();
        setApiProfile(Object.keys(result).length > 0 ? result : null);
      } catch {
        setApiProfile(null);
      }
    };
    void loadProfile();
  }, []);

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
  const mergedProfile = {
    displayName: settings.displayName || apiProfile?.displayName || currentUser.displayName,
    bio: settings.bio || apiProfile?.bio || currentUser.bio || "عاشق یادگیری تکنولوژی‌های وب و ساخت رابط‌های کاربری مدرن.",
    avatarImage: settings.avatarImage || apiProfile?.avatarImage || currentUser.avatarUrl,
    mbti: settings.mbti || apiProfile?.mbti || "INTJ",
    githubUrl: settings.githubUrl || apiProfile?.githubUrl || "",
    linkedinUrl: settings.linkedinUrl || apiProfile?.linkedinUrl || "",
    telegramUrl: settings.telegramUrl || apiProfile?.telegramUrl || "",
    websiteUrl: settings.websiteUrl || apiProfile?.websiteUrl || "",
    skills: settings.skills.length > 0 ? settings.skills : apiProfile?.skills || [
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Git",
      "Figma",
    ],
  };

  const socials = getProfileSocialLinks(mergedProfile);

  const userProfileData = {
    displayName: mergedProfile.displayName,
    username: currentUser.username,
    description: mergedProfile.bio,
    bannerUrl: settings.bannerImage || "",
    avatarUrl: mergedProfile.avatarImage,
    role: "Frontend Learner",
    mbti: mergedProfile.mbti,
    joinDate: "۱۴۰۲",
    socials,
    stats: {
      daysActive: 124,
      reputation: 850,
      followers: currentUser.followersCount || 0,
      following: currentUser.followingCount || 0,
    },
    skills: mergedProfile.skills,
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
