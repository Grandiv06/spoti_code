"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import AuthHeader from "./AuthHeader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/login/") ||
    pathname?.startsWith("/register/");

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthPage ? <AuthHeader /> : <Header />}
      <div className={isAuthPage ? "" : "pt-20 md:pt-24 lg:pt-24"}>
        {children}
      </div>
    </div>
  );
}
