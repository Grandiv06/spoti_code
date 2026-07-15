"use client";

import { BadgeCheck, ShieldAlert } from "lucide-react";

type InstructorPublishStatusBannerProps = {
  canPublishWithoutApproval: boolean;
};

export default function InstructorPublishStatusBanner({
  canPublishWithoutApproval,
}: InstructorPublishStatusBannerProps) {
  if (canPublishWithoutApproval) {
    return (
      <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-emerald-200/80 bg-gradient-to-l from-emerald-50 via-white to-emerald-50/40 px-5 py-5 shadow-sm md:px-6 md:py-6 dark:border-emerald-500/25 dark:bg-gradient-to-l dark:from-emerald-500/10 dark:via-emerald-500/5 dark:to-transparent dark:shadow-[0_18px_50px_-28px_rgba(16,185,129,0.45)]">
        <div className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-100 text-emerald-600 shadow-inner dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-black text-gray-900 md:text-lg dark:text-white">
                مدرس تاییدشده اسپاتی‌کد
              </h2>
              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                انتشار مستقیم
              </span>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
              شما به‌عنوان مدرس مورد اعتماد اسپاتی‌کد می‌توانید دوره جدید بسازید، محتوا را ویرایش کنید و
              تغییرات را بدون نیاز به تایید ادمین منتشر کنید.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-amber-200/80 bg-gradient-to-l from-amber-50 via-white to-amber-50/40 px-5 py-5 shadow-sm md:px-6 md:py-6 dark:border-amber-500/20 dark:bg-gradient-to-l dark:from-amber-500/10 dark:via-amber-500/5 dark:to-transparent dark:shadow-[0_18px_50px_-28px_rgba(245,158,11,0.35)]">
      <div className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-100 text-amber-700 shadow-inner dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-black text-gray-900 md:text-lg dark:text-white">
              انتشار با تایید ادمین
            </h2>
            <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200">
              نیازمند بررسی
            </span>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
            ایجاد دوره جدید، ویرایش محتوا و بروزرسانی دوره‌های شما پس از بررسی تیم اسپاتی‌کد منتشر
            می‌شود. پس از ارسال، وضعیت درخواست در بخش دوره‌ها قابل پیگیری است.
          </p>
        </div>
      </div>
    </div>
  );
}
