import React from 'react';
import { SocialProvider } from '@/context/SocialContext';
import SocialBottomNav from '@/components/social/SocialBottomNav';

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocialProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D11] font-sans" dir="rtl">
        {/* Main Content Area */}
        <main className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen pb-24 md:pb-24">
          {children}
        </main>

        {/* Bottom Nav - فقط در صفحات اسپاتی هاب */}
        <SocialBottomNav />
      </div>
    </SocialProvider>
  );
}
