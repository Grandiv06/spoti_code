"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function InstructorAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname || "/instructor/dashboard");
      router.replace(`/login?returnUrl=${returnUrl}`);
      return;
    }

    if (user?.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (user?.role === "user") {
      router.replace("/panel");
    }
  }, [isAuthenticated, isLoading, pathname, router, user?.role]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "instructor") {
    return null;
  }

  return <>{children}</>;
}
