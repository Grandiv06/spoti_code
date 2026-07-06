"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { canAccessSocial } from "@/lib/social-access";

export default function SocialRouteBlocker({ children }: { children?: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (canAccessSocial(user?.role)) {
      router.replace("/social");
      return;
    }

    router.replace("/panel");
  }, [isLoading, router, user?.role]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return null;
}
