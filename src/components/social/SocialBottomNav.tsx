"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, Plus, User } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { CreatePostModal } from "./CreatePostModal";
import { cn } from "@/lib/utils";

export default function SocialBottomNav() {
  const pathname = usePathname();
  const { currentUser } = useSocial();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          "fixed bottom-4 left-8 right-8 z-50 md:left-44 md:right-44 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ease-out",
          "bg-white/10 dark:bg-[#14161c]/10 backdrop-blur-[8px] border-gray-200/10 dark:border-slate-400/10",
          isScrolled
            ? "rounded-4xl shadow-lg border"
            : "rounded-4xl shadow-lg border"
        )}
      >
        <div className="flex items-center justify-between w-full max-w-md">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            if (item.center) {
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="flex items-center justify-center size-12 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all"
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            }
            if (item.disabled) {
              return (
                <span
                  key={idx}
                  className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 opacity-60 cursor-not-allowed"
                  title="به زودی"
                >
                  <span className="flex items-center justify-center size-10 rounded-2xl bg-white/5 dark:bg-white/5">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </span>
              );
            }
            const content = (
              <span className="flex flex-col items-center gap-1">
                {item.isProfile && currentUser ? (
                  <span className="flex items-center justify-center size-10 rounded-2xl overflow-hidden border-2 border-transparent">
                    <Image
                      src={currentUser.avatarUrl}
                      alt={currentUser.displayName}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex items-center justify-center size-10 rounded-2xl transition-colors",
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                )}
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    item.active ? "text-primary" : "text-gray-500 dark:text-gray-400"
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
                  "flex flex-col items-center transition-all",
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
