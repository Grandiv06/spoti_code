"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SocialNotificationsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/panel/notifications");
  }, [router]);

  return null;
}
