import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "ورود با شماره موبایل - آکادمی برنامه‌نویسی",
  description: "ورود به حساب کاربری با شماره موبایل",
};

export default function LoginPage() {
  return (
    <div className="bg-auth-modern h-full min-h-0 flex flex-col relative overflow-hidden text-gray-800 dark:text-gray-200">
      {/* Blobs */}
      <div className="blob-auth bg-green-200/60 dark:bg-green-950/20 w-96 h-96 top-0 -right-20 animate-pulse" />
      <div className="blob-auth bg-green-300/40 dark:bg-green-950/15 w-[30rem] h-[30rem] bottom-0 -left-20" />

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[460px] bg-white dark:bg-[#1c1e26] rounded-[2.5rem] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-xl border border-white/60 dark:border-white/[0.08] backdrop-blur-sm relative">
          <div className="p-8 sm:p-10">
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
