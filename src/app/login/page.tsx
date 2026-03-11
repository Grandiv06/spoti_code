import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "ورود با شماره موبایل - آکادمی برنامه‌نویسی",
  description: "ورود به حساب کاربری با شماره موبایل",
};

export default function LoginPage() {
  return (
    <div className="auth-page-shell bg-auth-modern h-full min-h-0 flex flex-col relative overflow-hidden text-gray-800 dark:text-gray-200">
      {/* Blobs */}
      <div className="blob-auth bg-green-200/60 dark:bg-green-950/20 w-96 h-96 top-0 -right-20 animate-pulse" />
      <div className="blob-auth bg-green-300/40 dark:bg-green-950/15 w-[30rem] h-[30rem] bottom-0 -left-20" />

      <main className="flex-1 min-h-0 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[460px] flex flex-col items-center gap-6">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/favicon.svg"
              alt="اسپاتی‌کد"
              width={48}
              height={48}
              className="w-11 h-11 sm:w-12 sm:h-12 group-hover:-rotate-45 transition-transform"
            />
            <span className="text-[32px] sm:text-[36px] leading-none font-black tracking-tighter text-gray-900 dark:text-white">
              <span className="text-primary-dark/80">اسپاتی</span> کد
            </span>
          </Link>
          <div className="w-full rounded-[2.5rem] border border-slate-300/70 dark:border-slate-700/80 bg-white dark:bg-gradient-to-b dark:from-[#1b1d26] dark:via-[#161922] dark:to-[#12141b] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-sm relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,0.12),transparent_45%)]" />
            <div className="p-8 sm:p-10">
              <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
