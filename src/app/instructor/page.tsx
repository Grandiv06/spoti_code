"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstructorRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/instructor/dashboard");
  }, [router]);

  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">در حال انتقال به داشبورد...</p>
      </div>
    </div>
  );
}
