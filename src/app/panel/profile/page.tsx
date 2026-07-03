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

type ApiProfile = Partial<ReturnType<typeof useProfileSettings>["settings"]> & {
  role?: string;
  joinDate?: string;
};

export default function PanelProfilePage() {
  const router = useRouter();
  const { currentUser } = useSocial();
  const { settings } = useProfileSettings();
  const [apiProfile, setApiProfile] = React.useState<ApiProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const result = await fetchMyProfile();
        setApiProfile(Object.keys(result).length > 0 ? (result as ApiProfile) : null);
      } catch {
        setApiProfile(null);
      } finally {
        setLoading(false);
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

  const mergedProfile = {
    displayName:
      apiProfile?.displayName || settings.displayName || currentUser.displayName,
    bio:
      apiProfile?.bio?.trim() ||
      settings.bio?.trim() ||
      "هنوز بیویی ننوشته‌اید. از ویرایش پروفایل می‌توانید خودتان را معرفی کنید.",
    avatarImage:
      apiProfile?.avatarImage || settings.avatarImage || currentUser.avatarUrl || "/images/student1.jpg",
    githubUrl: apiProfile?.githubUrl || settings.githubUrl || "",
    linkedinUrl: apiProfile?.linkedinUrl || settings.linkedinUrl || "",
    telegramUrl: apiProfile?.telegramUrl || settings.telegramUrl || "",
    websiteUrl: apiProfile?.websiteUrl || settings.websiteUrl || "",
    skills:
      apiProfile?.skills && apiProfile.skills.length > 0
        ? apiProfile.skills
        : settings.skills.length > 0
          ? settings.skills
          : [],
    role: apiProfile?.role || "یادگیرنده",
    joinDate: apiProfile?.joinDate || "—",
  };

  const socials = getProfileSocialLinks(mergedProfile);

  const userProfileData = {
    displayName: mergedProfile.displayName,
    username: currentUser.username,
    description: mergedProfile.bio,
    bannerUrl: settings.bannerImage || "",
    avatarUrl: mergedProfile.avatarImage,
    role: mergedProfile.role,
    mbti: "",
    joinDate: mergedProfile.joinDate,
    socials,
    stats: {
      daysActive: 0,
      reputation: 0,
      followers: currentUser.followersCount || 0,
      following: currentUser.followingCount || 0,
    },
    skills: mergedProfile.skills,
  };

  return (
    <main className="min-h-screen pb-20 animate-in fade-in duration-500">
      <div className="fixed top-0 left-0 w-full h-[500px] bg-green-500/10 blur-[120px] rounded-b-[100%] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-4">
        <ProfileHeader user={userProfileData} isOwnProfile={true} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 md:mt-10">
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            <ProjectsTabs />
            <ActivityTabs />
          </div>

          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <ProfileSidebar user={userProfileData} />
          </div>
        </div>
      </div>
    </main>
  );
}
