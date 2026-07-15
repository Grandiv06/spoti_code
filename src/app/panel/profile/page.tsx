"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchMyProfile, fetchMyProfileUserId, fetchMyProfileUsername, getProfileSocialLinks } from "@/lib/panel-profile";
import type { ProfileSettings } from "@/context/ProfileSettingsContext";
import ProfileHeader from "../../social/profile/_components/ProfileHeader";
import ProfileSidebar from "../../social/profile/_components/ProfileSidebar";
import ProjectsTabs from "../../social/profile/_components/ProjectsTabs";
import ActivityTabs from "../../social/profile/_components/ActivityTabs";
import { SocialButton } from "@/components/social/SocialButton";

type ApiProfile = ProfileSettings & {
  role?: string;
  joinDate?: string;
};

export default function PanelProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [apiProfile, setApiProfile] = React.useState<ApiProfile | null>(null);
  const [profileUserId, setProfileUserId] = React.useState<string | undefined>();
  const [profileUsername, setProfileUsername] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const [result, userId, username] = await Promise.all([fetchMyProfile(), fetchMyProfileUserId(), fetchMyProfileUsername()]);
        if (!cancelled) {
          setApiProfile(result as ApiProfile);
          setProfileUserId(userId ?? user?.id);
          setProfileUsername(username ?? undefined);
        }
      } catch {
        if (!cancelled) {
          setApiProfile(null);
          setProfileUserId(user?.id);
          setProfileUsername(undefined);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, user?.id]);

  if (authLoading || loading) {
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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">لطفاً وارد شوید</h2>
        <SocialButton variant="primary" onClick={() => router.push("/login")}>
          ورود
        </SocialButton>
      </div>
    );
  }

  const profile = apiProfile ?? {
    displayName: "",
    bio: "",
    avatarImage: "",
    githubUrl: "",
    linkedinUrl: "",
    telegramUrl: "",
    websiteUrl: "",
    skills: [],
    role: "یادگیرنده",
    joinDate: "—",
    bannerColor: "#22c55e",
    useDefaultBanner: true,
    location: "",
    mbti: "",
    bannerImage: "",
  };

  const socials = getProfileSocialLinks(profile);

  const userProfileData = {
    displayName: profile.displayName,
    username: "",
    description: profile.bio,
    bannerUrl: profile.bannerImage || "",
    avatarUrl: profile.avatarImage || "",
    role: profile.role || "یادگیرنده",
    mbti: profile.mbti || "",
    joinDate: profile.joinDate || "—",
    socials,
    stats: {
      daysActive: 0,
      reputation: 0,
      followers: 0,
      following: 0,
    },
    skills: profile.skills,
  };

  return (
    <main className="min-h-screen pb-20 animate-in fade-in duration-500">
      <div className="fixed top-0 left-0 w-full h-[500px] bg-green-500/10 blur-[120px] rounded-b-[100%] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-4">
        <ProfileHeader
          user={userProfileData}
          isOwnProfile={true}
          profileId={profileUsername || profileUserId || user?.id}
        />

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
