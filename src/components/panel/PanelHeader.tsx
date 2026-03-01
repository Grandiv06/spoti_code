"use client";

import { Menu, User } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "@/app/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { usePanelSidebar } from "@/context/PanelSidebarContext";
import { cn } from "@/lib/utils";

export default function PanelHeader() {
  const { user } = useAuth();
  const { toggleMobile } = usePanelSidebar();

  return (
    <header
      className={cn(
        "lg:hidden sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4",
        "bg-white/80 dark:bg-[#0B0D11]/80 backdrop-blur-md",
        "border-gray-200/50 dark:border-white/5",
      )}
      dir="rtl"
    >
      {/* Right: Hamburger (mobile/tablet) */}
      <button
        onClick={toggleMobile}
        className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="باز کردن منو"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Left: Title (desktop) or spacer (mobile) */}
      <h1 className="hidden lg:block text-xl font-bold text-gray-800 dark:text-white">
        پنل کاربری
      </h1>

      {/* Left side: Theme, User */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/50 flex items-center justify-center bg-primary/10 dark:bg-primary/20 shrink-0">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="w-5 h-5 text-primary" />
          )}
        </div>
      </div>
    </header>
  );
}
