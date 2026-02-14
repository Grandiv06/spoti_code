"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Plus, User, Compass, School } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { CreatePostModal } from "./CreatePostModal";
import { cn } from "@/lib/utils";

export default function SocialSidebar() {
  const pathname = usePathname();
  const { currentUser } = useSocial();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!currentUser) return null;

  const navItems = [
    {
      icon: User,
      href: currentUser ? `/social/profile/${currentUser.id}` : "/login",
      label: "پروفایل",
      active: pathname?.startsWith("/social/profile"),
      isProfile: true,
    },
    {
      icon: School,
      href: "/panel/courses",
      label: "دوره‌های من",
      active: pathname === "/panel/courses",
    },
    {
      icon: Compass,
      href: "/social",
      label: "کاوش",
      active: pathname === "/social",
    },
    {
      icon: Plus,
      action: () => setIsCreateModalOpen(true),
      label: "پست جدید",
      center: true,
    },
  ];

  const iconButton = (item: (typeof navItems)[0], idx: number) => {
    const Icon = item.icon;
    if (item.center) {
      return (
        <button
          key={idx}
          onClick={item.action}
          className="group flex items-center justify-center size-10 rounded-xl text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
          aria-label={item.label}
        >
          <Icon className="w-6 h-6" />
        </button>
      );
    }
    if (item.isProfile && currentUser) {
      return (
        <Link
          key={idx}
          href={item.href!}
          className={cn(
            "flex items-center justify-center size-10 rounded-xl overflow-hidden transition-opacity hover:opacity-80",
            item.active && "ring-2 ring-primary ring-offset-2 dark:ring-offset-[#0B0D11]"
          )}
          aria-label={item.label}
        >
          <Image
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            width={40}
            height={40}
            className="object-cover size-10"
          />
        </Link>
      );
    }
    return (
      <Link
        key={idx}
        href={item.href!}
        className={cn(
          "flex items-center justify-center size-10 rounded-xl transition-colors",
          item.active
            ? "text-primary"
            : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
        )}
        aria-label={item.label}
      >
        <Icon className="w-6 h-6" />
      </Link>
    );
  };

  return (
    <>
      {/* Desktop: Right vertical sidebar - وسط ستون */}
      <aside className="hidden md:flex fixed top-0 right-0 bottom-0 z-40 flex-col items-center justify-center w-[72px] gap-2">
        {navItems.map((item, idx) => iconButton(item, idx))}
      </aside>

      {/* Mobile: Bottom nav - compact */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-fit flex items-center justify-center gap-1 py-2 px-3 bg-white/80 dark:bg-[#14161c]/90 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-3xl shadow-lg">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          if (item.center) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="group flex flex-col items-center gap-0.5 shrink-0 py-1 px-1"
                aria-label={item.label}
              >
                <span className="flex items-center justify-center size-9 rounded-xl text-gray-700 dark:text-gray-200 group-hover:text-primary">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">
                  {item.label}
                </span>
              </button>
            );
          }
          const content = (
            <>
              {item.isProfile && currentUser ? (
                <span className="flex items-center justify-center size-9 rounded-xl overflow-hidden">
                  <Image
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    width={36}
                    height={36}
                    className="object-cover size-9"
                  />
                </span>
              ) : (
                <span
                  className={cn(
                    "flex items-center justify-center size-9 rounded-xl",
                    item.active ? "text-primary" : "text-gray-700 dark:text-gray-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </span>
              )}
              <span className={cn("text-[9px] font-medium", item.active ? "text-primary" : "text-gray-600 dark:text-gray-300")}>
                {item.label}
              </span>
            </>
          );
          return (
            <Link key={idx} href={item.href!} className="flex flex-col items-center gap-0.5 shrink-0" aria-label={item.label}>
              {content}
            </Link>
          );
        })}
      </nav>

      {isCreateModalOpen && (
        <CreatePostModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
