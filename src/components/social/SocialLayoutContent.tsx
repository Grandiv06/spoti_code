"use client";

import { useAuth } from "@/context/AuthContext";
import SocialSidebar from "./SocialSidebar";
import { cn } from "@/lib/utils";

export default function SocialLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <SocialSidebar />
      <main
        className={cn(
          "w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen",
          isAuthenticated ? "pb-24 md:pb-8 md:pr-[72px]" : "pb-8"
        )}
      >
        {children}
      </main>
    </>
  );
}
