"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/login/") ||
    pathname?.startsWith("/register/");
  const isPanelPage = pathname?.startsWith("/panel");
  const isAdminPage = pathname?.startsWith("/admin");
  const isDashboardPage = isPanelPage || isAdminPage;

  return (
    <div
      className={`flex flex-col ${
        isAuthPage ? "h-[100dvh] overflow-hidden" : "min-h-screen"
      }`}
    >
      {!isDashboardPage && !isAuthPage && <Header />}
      <div
        className={`flex-1 min-h-0 ${
          isDashboardPage ? "" : isAuthPage ? "overflow-hidden" : "overflow-hidden pt-20 md:pt-24 lg:pt-24"
        }`}
      >
        {children}
      </div>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </div>
  );
}
