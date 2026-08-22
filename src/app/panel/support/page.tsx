"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Headphones, MessageSquarePlus } from "lucide-react";

import TicketStats from "./_components/TicketStats";
import TicketList from "./_components/TicketList";
import TicketForm from "./_components/TicketForm";
import ContactCard from "./_components/ContactCard";

function SupportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"list" | "create">(
    () => (searchParams.get("create") === "1" ? "create" : "list")
  );

  const openCreate = () => {
    setView("create");
    router.replace("/panel/support?create=1");
  };

  const openList = () => {
    setView("list");
    router.replace("/panel/support");
  };

  if (view === "create") {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-5 pb-2 lg:max-w-4xl" dir="rtl">
        <TicketForm onBack={openList} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 pb-2 lg:max-w-6xl" dir="rtl">
      <section className="rounded-3xl border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26]/80 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary lg:size-14">
              <Headphones className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
                پشتیبانی آنلاین
              </p>
              <h1 className="text-xl font-black leading-tight text-gray-900 dark:text-white sm:text-2xl lg:text-[1.75rem]">
                تیکت‌های من
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                گفتگو با تیم پشتیبانی اسپاتی‌کد — مدیریت و پیگیری درخواست‌های ثبت
                شده.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-black text-white shadow-[0_10px_28px_rgba(34,197,94,0.22)] transition-all hover:bg-primary-hover active:scale-[0.98] cursor-pointer lg:h-11 lg:w-auto lg:shrink-0 lg:px-6"
          >
            <MessageSquarePlus className="size-4" />
            ثبت تیکت جدید
          </button>
        </div>
      </section>

      <TicketStats />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TicketList onNewTicket={openCreate} />
        </div>
        <div className="space-y-5 lg:col-span-4 lg:sticky lg:top-0">
          <ContactCard />
        </div>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportPageContent />
    </Suspense>
  );
}
