"use client";

import Link from "next/link";
import { ArrowLeft, BookOpenCheck, CheckCircle2, ClipboardCheck, MessageSquareText, ShieldCheck } from "lucide-react";

const requestSections = [
  {
    href: "/admin/requests/reviews",
    title: "تایید نمایش نظرات",
    description: "بررسی نظرهای ثبت‌شده برای دوره‌ها و تایید یا رد نمایش آن‌ها در صفحه عمومی دوره.",
    icon: MessageSquareText,
    badge: "فعال",
    isActive: true,
  },
  {
    href: "#",
    title: "تایید ثبت دوره",
    description: "درخواست‌هایی که مدرس برای ثبت یا انتشار دوره ارسال می‌کند در این بخش بررسی می‌شود.",
    icon: BookOpenCheck,
    badge: "به‌زودی",
    isActive: false,
  },
];

export default function AdminRequestsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-2 pb-20 text-right animate-in fade-in duration-700 md:px-4" dir="rtl">
      <section className="relative mb-8 overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-xl dark:border-white/5 dark:bg-[#1c1e26]">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 -translate-x-1/4 translate-y-1/2 rounded-full bg-emerald-500/10 blur-[70px]" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 px-8 py-10 md:flex-row md:px-12">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-2xl shadow-primary/40">
                <ClipboardCheck className="h-8 w-8" />
              </div>
            </div>
            <div className="text-center md:text-right">
              <h1 className="mb-2 text-2xl font-black text-gray-900 dark:text-white md:text-3xl">
                مدیریت درخواست‌ها
              </h1>
              <p className="max-w-2xl text-xs font-medium leading-7 text-gray-500 dark:text-gray-400 md:text-sm">
                درخواست‌هایی که برای نمایش عمومی یا تغییر وضعیت محتوا نیاز به تایید ادمین دارند، از اینجا بررسی می‌شوند.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-xs font-black text-primary">
            <ShieldCheck className="h-4 w-4" />
            تایید نهایی توسط ادمین
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {requestSections.map((section) => {
          const Icon = section.icon;
          const content = (
            <div className="group relative h-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 dark:border-white/5 dark:bg-[#1c1e26]">
              <div className="absolute left-6 top-6">
                <span className={section.isActive ? "rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black text-emerald-500" : "rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black text-gray-500 dark:bg-white/10 dark:text-gray-400"}>
                  {section.badge}
                </span>
              </div>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">{section.title}</h2>
              <p className="mt-3 min-h-16 text-sm font-semibold leading-7 text-gray-500 dark:text-gray-400">
                {section.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/5">
                <span className="text-[11px] font-black text-gray-400">
                  {section.isActive ? "ورود به بخش بررسی" : "در نسخه بعدی فعال می‌شود"}
                </span>
                {section.isActive ? (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/10">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          );

          return section.isActive ? (
            <Link key={section.title} href={section.href} className="block">
              {content}
            </Link>
          ) : (
            <div key={section.title} className="opacity-75">
              {content}
            </div>
          );
        })}
      </section>
    </div>
  );
}
