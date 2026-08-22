"use client";

import React from "react";
import { Clock, CheckCircle2, Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTicketsQuery } from "@/hooks/api/useTicketsQuery";
import { isTicketUnderReview, isTicketAnswered } from "@/app/panel/support/data";
import { TicketStatsSkeleton } from "./TicketSupportSkeleton";

function StatTile({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) {
  const hasValue = value > 0;

  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 active:scale-[0.98] dark:bg-[#181a21]",
        hasValue
          ? "border-primary/20"
          : "border-gray-200/70 dark:border-white/[0.06]",
      )}
    >
      <div className="flex min-h-[3.25rem] items-center gap-2 p-2.5 sm:p-3 lg:min-h-[4.25rem] lg:gap-3 lg:p-4">
        <span
          className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border lg:size-10 lg:rounded-xl",
            hasValue
              ? "border-primary/25 bg-primary/10 text-primary"
              : "border-gray-200 bg-gray-50 text-gray-400 dark:border-white/10 dark:bg-[#14161c] dark:text-slate-400",
          )}
        >
          <Icon className="size-3.5 lg:size-4" strokeWidth={2.25} />
        </span>
        <span className="line-clamp-2 min-w-0 flex-1 text-[11px] font-bold leading-snug text-gray-500 dark:text-slate-400 lg:text-xs">
          {title}
        </span>
        <span
          className={cn(
            "flex min-h-[28px] shrink-0 items-center text-lg font-black leading-none tracking-tight tabular-nums sm:text-xl lg:text-2xl",
            hasValue
              ? "text-primary"
              : "text-gray-900 dark:text-white",
          )}
        >
          {value.toLocaleString("fa-IR")}
        </span>
      </div>
    </div>
  );
}

export default function TicketStats() {
  const { data: tickets = [], isPending } = useTicketsQuery();

  if (isPending) {
    return <TicketStatsSkeleton />;
  }

  const stats = [
    { label: "کل تیکت‌ها", value: tickets.length, icon: Inbox },
    {
      label: "در حال بررسی",
      value: tickets.filter((t) => isTicketUnderReview(t.status)).length,
      icon: Clock,
    },
    {
      label: "پاسخ داده شده",
      value: tickets.filter((t) => isTicketAnswered(t.status)).length,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatTile
          key={stat.label}
          title={stat.label}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </section>
  );
}
