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
      <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-emerald-500/25 bg-gradient-to-l from-emerald-500/10 via-emerald-500/5 to-transparent px-5 py-5 shadow-[0_18px_50px_-28px_rgba(16,185,129,0.45)] md:px-6 md:py-6">
        <div className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/15 text-emerald-400 shadow-inner">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-black text-white md:text-lg">مدرس تاییدشده اسپاتی‌کد</h2>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                انتشار مستقیم
              </span>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-gray-300">
              شما به‌عنوان مدرس مورد اعتماد اسپاتی‌کد می‌توانید دوره جدید بسازید، محتوا را ویرایش کنید و
              تغییرات را بدون نیاز به تایید ادمین منتشر کنید.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-amber-500/20 bg-gradient-to-l from-amber-500/10 via-amber-500/5 to-transparent px-5 py-5 shadow-[0_18px_50px_-28px_rgba(245,158,11,0.35)] md:px-6 md:py-6">
      <div className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300 shadow-inner">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-black text-white md:text-lg">انتشار با تایید ادمین</h2>
            <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-black text-amber-200">
              نیازمند بررسی
            </span>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-gray-300">
            ایجاد دوره جدید، ویرایش محتوا و بروزرسانی دوره‌های شما پس از بررسی تیم اسپاتی‌کد منتشر
            می‌شود. پس از ارسال، وضعیت درخواست در بخش دوره‌ها قابل پیگیری است.
          </p>
        </div>
      </div>
    </div>
  );
}
