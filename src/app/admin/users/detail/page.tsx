"use client";

import { useSearchParams } from "next/navigation";
import UserDetailView from "../[userId]/UserDetailView";

export default function AdminUserDetailPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id") || "";

  return <UserDetailView userId={userId} />;
}
