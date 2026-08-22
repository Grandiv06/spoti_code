"use client";

import { ArrowUpRight, CheckCircle2, CreditCard, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionStatsProps {
  totalPayments: number;
  successfulTransactions: number;
  latestTransactionAmount: number;
}

function StatTile({
  title,
  value,
  unit,
  icon: Icon,
}: {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
}) {
  const hasValue = value !== "۰" && value !== "0";

  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] dark:bg-[#181a21]",
        hasValue
          ? "border-primary/20"
          : "border-gray-200/70 dark:border-white/[0.06]",
      )}
    >
      <div className="flex min-h-[3.25rem] items-center gap-2 p-2.5 sm:p-3 lg:min-h-[4.25rem] lg:gap-3 lg:p-4">
        <span
          className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border",
            hasValue
              ? "border-primary/25 bg-primary/10 text-primary"
              : "border-gray-200 bg-gray-50 text-gray-400 dark:border-white/10 dark:bg-[#14161c] dark:text-slate-400",
          )}
        >
          <Icon className="size-3.5" strokeWidth={2.25} />
        </span>
        <span className="line-clamp-2 min-w-0 flex-1 text-[11px] font-bold leading-snug text-gray-500 dark:text-slate-400">
          {title}
        </span>
        <span className="flex shrink-0 flex-col items-end">
          <span
            className={cn(
              "text-sm font-black leading-none tabular-nums sm:text-base",
              hasValue ? "text-primary" : "text-gray-900 dark:text-white",
            )}
          >
            {value}
          </span>
          <span className="mt-0.5 text-[9px] font-bold text-gray-400">{unit}</span>
        </span>
      </div>
    </div>
  );
}

export default function TransactionStats({
  totalPayments,
  successfulTransactions,
  latestTransactionAmount,
}: TransactionStatsProps) {
  const stats = [
    {
      label: "مجموع پرداخت‌ها",
      value: totalPayments.toLocaleString("fa-IR"),
      icon: CreditCard,
      unit: "تومان",
    },
    {
      label: "تراکنش‌های موفق",
      value: successfulTransactions.toLocaleString("fa-IR"),
      icon: CheckCircle2,
      unit: "مورد",
    },
    {
      label: "آخرین تراکنش",
      value: latestTransactionAmount.toLocaleString("fa-IR"),
      icon: ArrowUpRight,
      unit: "تومان",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatTile
          key={stat.label}
          title={stat.label}
          value={stat.value}
          unit={stat.unit}
          icon={stat.icon}
        />
      ))}
    </section>
  );
}
