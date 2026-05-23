"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PanelAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname || "/panel");
      router.replace(`/login?returnUrl=${returnUrl}`);
      return;
    }
    if (user?.role === "admin") {
      router.replace("/admin");
      return;
    }
    if (user?.role === "instructor") {
      router.replace("/instructor/dashboard");
    }
  }, [isAuthenticated, isLoading, router, pathname, user?.role]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== "user") {
    return null;
  }

  return <>{children}</>;
}
