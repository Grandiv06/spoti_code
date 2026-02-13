"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bookmark, Heart, MessageCircle, Plus, User } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { CreatePostModal } from "./CreatePostModal";
import { cn } from "@/lib/utils";

export default function SocialBottomNav() {
  const pathname = usePathname();
  const { currentUser } = useSocial();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const navItems = [
    {
      icon: Bookmark,
      href: "/social/saved",
      label: "ذخیره‌شده",
      active: pathname === "/social/saved",
    },
    {
      icon: Heart,
      href: "/social/liked",
      label: "لایک‌شده",
      active: pathname === "/social/liked",
    },
    {
      icon: MessageCircle,
      href: "#",
      label: "چت",
      disabled: true,
      active: false,
    },
    {
      icon: Plus,
      action: () => setIsCreateModalOpen(true),
      label: "پست جدید",
      center: true,
    },
    {
      icon: User,
      href: currentUser ? `/social/profile/${currentUser.id}` : "/login",
      label: "پروفایل",
      active: pathname?.startsWith("/social/profile"),
      isProfile: true,
    },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-fit flex items-center justify-center gap-1 py-2 px-3 transition-all duration-300 ease-out",
          "bg-white/80 dark:bg-[#14161c]/90 backdrop-blur-xl border border-gray-200/60 dark:border-white/10",
          "rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20"
        )}
      >
        <div className="flex items-center justify-center gap-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            if (item.center) {
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="group flex flex-col items-center gap-0.5 shrink-0 py-1 px-1 transition-all rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/5"
                  aria-label={item.label}
                >
                  <span className="flex items-center justify-center size-9 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                </button>
              );
            }
            if (item.disabled) {
              return (
                <span
                  key={idx}
                  className="flex flex-col items-center gap-0.5 text-gray-500 dark:text-gray-400 opacity-70 cursor-not-allowed shrink-0"
                  title="به زودی"
                >
                  <span className="flex items-center justify-center size-9 rounded-xl bg-gray-100 dark:bg-white/10">
                    <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </span>
                  <span className="text-[9px] font-medium">{item.label}</span>
                </span>
              );
            }
            const content = (
              <span className="flex flex-col items-center gap-0.5 shrink-0">
                {item.isProfile && currentUser ? (
                  <span className="flex items-center justify-center size-9 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-white/20">
                    <Image
                      src={currentUser.avatarUrl}
                      alt={currentUser.displayName}
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex items-center justify-center size-9 rounded-xl transition-colors",
                      item.active
                        ? "bg-primary/15 text-primary dark:bg-primary/20"
                        : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/15"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                )}
                <span
                  className={cn(
                    "text-[9px] font-medium",
                    item.active ? "text-primary" : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  {item.label}
                </span>
              </span>
            );
            return (
              <Link
                key={idx}
                href={item.href!}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-1 transition-all rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/5",
                  item.active && "text-primary"
                )}
                aria-label={item.label}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {isCreateModalOpen && (
        <CreatePostModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
