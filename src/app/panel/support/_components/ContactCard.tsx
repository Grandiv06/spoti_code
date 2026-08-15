"use client";

import React from "react";
import Link from "next/link";
import { Clock, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";

export default function ContactCard() {
  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-white p-5 dark:from-[#10231a] dark:via-[#1c1e26] dark:to-[#16181f] sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 size-40 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
              <MessageCircle className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
                قبل از ثبت تیکت
              </p>
              <h2 className="text-base font-black leading-snug text-gray-900 dark:text-white sm:text-lg">
                سوالات متداول را دیده‌اید؟
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                احتمالاً پاسخ سوال شما در کمتر از یک دقیقه آنجا پیدا می‌شود.
              </p>
            </div>
          </div>
          <div className="w-full shrink-0 sm:w-auto">
            <Link
              href="/faq"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/15 cursor-pointer sm:w-auto"
            >
              <HelpCircle className="size-4" />
              سوالات پرتکرار
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/15 bg-gradient-to-b from-primary/10 to-white p-5 dark:to-[#1c1e26]/90 sm:p-6">
        <div className="mb-5 text-center">
          <h2 className="text-lg font-black text-gray-900 dark:text-white sm:text-xl">
            راه‌های ارتباط با ما
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            اگر سوالی دارید که در تیکت‌ها مطرح نشده، از راه‌های زیر با ما در
            تماس باشید.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="tel:02112345678"
            className="flex items-center gap-3 rounded-2xl bg-primary px-4 py-3.5 text-white transition-colors hover:bg-primary-hover cursor-pointer"
          >
            <div className="rounded-xl bg-white/15 p-2.5">
              <Phone className="size-5" />
            </div>
            <div className="min-w-0 text-right">
              <p className="text-sm font-black">تماس تلفنی</p>
              <p className="mt-0.5 text-xs font-bold tabular-nums [direction:ltr] [unicode-bidi:plaintext]">
                ۰۲۱-۱۲۳۴۵۶۷۸
              </p>
            </div>
          </a>

          <a
            href="mailto:support@spoticode.ir"
            className="group flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3.5 transition-colors hover:bg-sky-500/15 cursor-pointer"
          >
            <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-500 dark:text-sky-300">
              <Mail className="size-5" />
            </div>
            <div className="min-w-0 text-right">
              <p className="text-sm font-black text-gray-900 dark:text-white">
                ایمیل پشتیبانی
              </p>
              <p className="mt-0.5 truncate text-xs font-bold text-sky-600 dark:text-sky-200/80 [direction:ltr] [unicode-bidi:plaintext]">
                support@spoticode.ir
              </p>
            </div>
          </a>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-gray-200/70 bg-white/70 px-4 py-3 text-xs text-gray-500 dark:border-white/5 dark:bg-[#14161c]/60 dark:text-slate-400">
          <Clock className="size-4 shrink-0 text-primary" />
          <span>پاسخگویی شنبه تا پنجشنبه، ساعت ۹ تا ۱۸</span>
        </div>
      </section>
    </>
  );
}
