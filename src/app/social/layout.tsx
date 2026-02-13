import React from "react";
import { SocialProvider } from "@/context/SocialContext";
import SocialSidebar from "@/components/social/SocialSidebar";

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocialProvider>
      <div
        className="min-h-screen bg-gray-50 dark:bg-[#14161c] font-sans"
        dir="rtl"
      >
        {/* Sidebar - سمت چپ در دسکتاپ، پایین در موبایل */}
        <SocialSidebar />

        {/* Main Content - با فاصله از سایدبار در دسکتاپ */}
        <main className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen pb-24 md:pb-8 md:pl-[72px]">
          {children}
        </main>
      </div>
    </SocialProvider>
  );
}
