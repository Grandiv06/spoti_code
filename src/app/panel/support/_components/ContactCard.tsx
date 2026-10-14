"use client";

import React from "react";
import Link from "next/link";
import { Clock, HelpCircle, Mail, MessageCircle } from "lucide-react";

export default function ContactCard() {
  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-white p-5 dark:from-[#10231a] dark:via-[#1c1e26] dark:to-[#16181f] sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 size-40 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
              پاسخ سریع‌تر می‌خواهید؟
            </span>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <MessageCircle className="size-5" />
            </div>
          </div>

          <div>
            <h2 className="text-base font-black leading-snug text-gray-900 dark:text-white sm:text-lg">
              بخش سوالات متداول را بررسی کرده‌اید؟
            </h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500 dark:text-slate-400 sm:text-sm">
              شاید پاسخ مشکل شما پیش از این توسط کارشناسان ما داده شده باشد.
            </p>
          </div>

          <Link
            href="/faq"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 text-sm font-bold text-primary transition-all hover:bg-primary/20 hover:border-primary/40 cursor-pointer active:scale-[0.99]"
          >
            <HelpCircle className="size-4" />
            مرور سوالات متداول
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/15 bg-gradient-to-b from-primary/10 to-white p-5 dark:to-[#1c1e26]/90 sm:p-6">
        <div className="mb-4 text-right sm:text-center">
          <h2 className="text-base font-black text-gray-900 dark:text-white sm:text-lg">
            ارتباط مستقیم ایمیلی
          </h2>
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-gray-500 dark:text-slate-400 sm:text-sm">
            علاوه بر تیکت، می‌توانید از طریق ایمیل رسمی با تیم پشتیبانی در ارتباط باشید.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href="mailto:support@spoticode.ir"
            className="group flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3.5 transition-colors hover:bg-sky-500/15 cursor-pointer"
          >
            <div className="rounded-xl bg-sky-500/15 p-2 text-sky-500 dark:text-sky-300 shrink-0">
              <Mail className="size-5" />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-xs font-black text-gray-900 dark:text-white">
                ایمیل پشتیبانی اسپاتی‌کد
              </p>
              <p className="mt-0.5 truncate text-xs font-bold text-sky-600 dark:text-sky-200/80 [direction:ltr] [unicode-bidi:plaintext]">
                support@spoticode.ir
              </p>
            </div>
          </a>
        </div>

        <div className="mt-3.5 flex items-center justify-center gap-2 rounded-2xl border border-gray-200/70 bg-white/70 px-3.5 py-2.5 text-[11px] font-medium text-gray-500 dark:border-white/5 dark:bg-[#14161c]/60 dark:text-slate-400">
          <Clock className="size-3.5 shrink-0 text-primary" />
          <span>پاسخگویی شنبه تا پنجشنبه، ساعت ۹ تا ۱۸</span>
        </div>
      </section>
    </>
  );
}
