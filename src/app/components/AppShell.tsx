"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import AuthHeader from "./AuthHeader";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/login/") ||
    pathname?.startsWith("/register/");

  return (
    <div
      className={`flex flex-col ${
        isAuthPage ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {isAuthPage ? <AuthHeader /> : <Header />}
      <div
        className={`flex-1 min-h-0 overflow-hidden ${
          isAuthPage ? "pt-24 md:pt-28 lg:pt-28" : "pt-20 md:pt-24 lg:pt-24"
        }`}
      >
        {children}
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}
