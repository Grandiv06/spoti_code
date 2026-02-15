import React from "react";
import ProfileHeader from "../_components/ProfileHeader";
import GrowthRoadmap from "../_components/GrowthRoadmap";
import ProjectsTabs from "../_components/ProjectsTabs";
import ActivityTabs from "../_components/ActivityTabs";
import ProfileSidebar from "../_components/ProfileSidebar";

export default function ProfilePage() {
  // Mock Data
  const user = {
    displayName: "سروش مشایخی",
    username: "soroush_m",
    role: "Frontend Learner",
    mbti: "INTJ",
    location: "تهران، ایران",
    joinDate: "۱۴۰۲",
    description:
      "عاشق یادگیری تکنولوژی‌های وب و ساخت رابط‌های کاربری مدرن. در حال حاضر مشغول یادگیری عمیق نکست جی‌اس و تایپ اسکریپت هستم. هدفم تبدیل شدن به یک مهندس نرم‌افزار ارشد است.",
    bannerUrl: "", // Using default pattern banner in ProfileHeader
    avatarUrl: "https://i.pravatar.cc/300?u=soroush",
    socials: {
      github: "https://github.com/soroush",
      linkedin: "https://linkedin.com/in/soroush",
      website: "https://soroush.dev",
    },
    stats: {
      daysActive: 124,
      reputation: 850,
      followers: 42,
      following: 15,
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
    <main className="min-h-screen pb-20">
      {/* Decorative Background Blob */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-green-500/10 blur-[120px] rounded-b-[100%] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-4">
        {/* Header Section */}
        <ProfileHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 md:mt-10">
          {/* Left Column (Main Content) - Wide */}
          <div className="lg:col-span-8 space-y-8">
            <GrowthRoadmap />
            <ProjectsTabs />
            <ActivityTabs />
          </div>

          {/* Right Column (Sidebar) - Narrow */}
          <div className="lg:col-span-4 space-y-8">
            <ProfileSidebar user={user} />
          </div>
        </div>
      </div>
    </main>
  );
}
