import React from "react";
import { SocialProvider } from "@/context/SocialContext";
import { ProfileSettingsProvider } from "@/context/ProfileSettingsContext";
import SocialLayoutContent from "@/components/social/SocialLayoutContent";

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocialProvider>
      <ProfileSettingsProvider>
        <div
          className="min-h-screen bg-gray-50 dark:bg-[#14161c] font-sans"
          dir="rtl"
        >
          <SocialLayoutContent>{children}</SocialLayoutContent>
        </div>
      </ProfileSettingsProvider>
    </SocialProvider>
  );
}
