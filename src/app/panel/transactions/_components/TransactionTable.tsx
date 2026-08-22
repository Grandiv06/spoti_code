"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Transaction } from "../data";
import { cn } from "@/lib/utils";
import TransactionDetailsModal from "./TransactionDetailsModal";

const statusMap = {
  success: {
    label: "موفق",
    class: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: CheckCircle2,
  },
  failed: {
    label: "ناموفق",
    class: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
  },
  pending: {
    label: "در انتظار",
    class: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: Clock,
  },
  refunded: {
    label: "برگشت وجه",
    class: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: RotateCcw,
  },
};

export default function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-12 text-center dark:border-white/10 dark:bg-[#1c1e26]/50">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <FileText className="size-6" />
        </div>
        <h3 className="mb-1.5 text-base font-black text-gray-900 dark:text-white">
          هنوز تراکنشی ثبت نشده است
        </h3>
        <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-slate-400">
          پرداخت‌ها و خرید دوره‌های شما اینجا نمایش داده می‌شود.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15 cursor-pointer"
        >
          مشاهده دوره‌ها
          <ChevronLeft className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-2.5">
      <div className="hidden overflow-hidden rounded-3xl border border-gray-200/70 bg-white dark:border-white/5 dark:bg-[#1c1e26]/80 lg:block">
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-black text-gray-400 dark:border-white/5 dark:text-slate-500">
              <th className="px-6 py-4">شرح تراکنش</th>
              <th className="px-6 py-4">شناسه</th>
              <th className="px-6 py-4">تاریخ</th>
              <th className="px-6 py-4">مبلغ</th>
              <th className="px-6 py-4">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {transactions.map((trx) => {
              const StatusIcon = statusMap[trx.status].icon;
              return (
                <tr
                  key={trx.id}
                  onClick={() => setSelectedTrx(trx)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex size-9 shrink-0 items-center justify-center rounded-xl border",
                          trx.type === "payment"
                            ? "border-primary/25 bg-primary/10 text-primary"
                            : "border-blue-500/20 bg-blue-500/10 text-blue-500",
                        )}
                      >
                        {trx.type === "payment" ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownLeft className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-gray-900 dark:text-white">
                          {trx.description}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-gray-500">
                          {trx.productTitle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">{trx.id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">
                    {trx.date}
                    <span className="mt-0.5 block text-[10px] text-gray-400">{trx.time}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black tabular-nums text-gray-900 dark:text-white">
                    {trx.amount.toLocaleString("fa-IR")}
                    <span className="mr-1 text-[10px] font-bold text-gray-400">تومان</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold",
                        statusMap[trx.status].class,
                      )}
                    >
                      <StatusIcon className="size-3" />
                      {statusMap[trx.status].label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {transactions.map((trx) => {
        const StatusIcon = statusMap[trx.status].icon;
        return (
          <button
            key={trx.id}
            type="button"
            onClick={() => setSelectedTrx(trx)}
            className="block w-full rounded-2xl border border-gray-200/70 bg-white p-4 text-right transition-all hover:border-primary/25 dark:border-white/5 dark:bg-[#1c1e26]/80 dark:hover:bg-[#1c1e26] cursor-pointer lg:hidden"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border",
                    trx.type === "payment"
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-blue-500/20 bg-blue-500/10 text-blue-500",
                  )}
                >
                  {trx.type === "payment" ? (
                    <ArrowUpRight className="size-3.5" />
                  ) : (
                    <ArrowDownLeft className="size-3.5" />
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black leading-snug text-gray-900 dark:text-white">
                    {trx.description}
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-gray-500 dark:text-slate-500">
                    {trx.productTitle}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold",
                  statusMap[trx.status].class,
                )}
              >
                <StatusIcon className="size-3" />
                {statusMap[trx.status].label}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-gray-400 dark:text-slate-500">
              <span>
                {trx.date} — {trx.time}
              </span>
              <span
                className={cn(
                  "text-sm font-black tabular-nums",
                  trx.type === "payment"
                    ? "text-gray-900 dark:text-white"
                    : "text-blue-500",
                )}
              >
                {trx.type === "payment" ? "" : "-"}
                {trx.amount.toLocaleString("fa-IR")}
                <span className="mr-1 text-[9px] font-bold text-gray-400">تومان</span>
              </span>
            </div>
          </button>
        );
      })}

      <TransactionDetailsModal
        transaction={selectedTrx}
        onClose={() => setSelectedTrx(null)}
      />
    </section>
  );
}
