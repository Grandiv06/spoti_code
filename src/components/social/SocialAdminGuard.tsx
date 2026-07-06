"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { canAccessSocial } from "@/lib/social-access";

export default function SocialAdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname || "/social");
      router.replace(`/login?returnUrl=${returnUrl}`);
      return;
    }

    if (!canAccessSocial(user?.role)) {
      router.replace(user?.role === "instructor" ? "/instructor/dashboard" : "/panel");
    }
  }, [isAuthenticated, isLoading, pathname, router, user?.role]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !canAccessSocial(user?.role)) {
    return null;
  }

  return <>{children}</>;
}
