"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

const FULL_PAGE_ADMIN_ROUTE = /^\/admin\/requests\/courses\/[^/]+\/preview\/?$/;

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (FULL_PAGE_ADMIN_ROUTE.test(pathname ?? "")) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
