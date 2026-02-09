"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import AuthHeader from "./AuthHeader";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" || pathname === "/register" || pathname?.startsWith("/login/") || pathname?.startsWith("/register/");

  return (
    <>
      {isAuthPage ? <AuthHeader /> : <Header />}
      {children}
    </>
  );
}
