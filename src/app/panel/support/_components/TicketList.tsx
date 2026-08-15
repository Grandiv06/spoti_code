"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MessagesSquare,
  Search,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatTicketStatusLabel,
  getTicketCategoryLabel,
  getTicketStatusClass,
  matchesTicketStatusFilter,
} from "@/app/panel/support/data";
import { useTicketsQuery } from "@/hooks/api/useTicketsQuery";
import { TicketListSkeleton } from "./TicketSupportSkeleton";

const tabs = [
  { id: "all", label: "همه تیکت‌ها" },
  { id: "investigating", label: "در حال بررسی" },
  { id: "answered", label: "پاسخ داده شده" },
  { id: "closed", label: "بسته شده" },
];

const PAGE_SIZE = 4;

function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function TicketPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex justify-center pt-2">
      <div className="flex items-center gap-1.5 rounded-2xl border border-gray-200/70 bg-white p-1.5 dark:border-white/5 dark:bg-[#1c1e26]/80">
        <button
          type="button"
          aria-label="صفحه قبل"
          disabled={!canGoPrev}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(
            "flex size-9 items-center justify-center rounded-xl transition-colors",
            canGoPrev
              ? "text-gray-500 hover:bg-gray-100 hover:text-primary dark:text-slate-400 dark:hover:bg-white/5 cursor-pointer"
              : "text-gray-300 dark:text-slate-600 cursor-not-allowed",
          )}
        >
          <ChevronRight className="size-4" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-label={`صفحه ${page.toLocaleString("fa-IR")}`}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={cn(
              "flex size-9 items-center justify-center rounded-xl text-xs font-black transition-colors cursor-pointer",
              currentPage === page
                ? "border border-primary/25 bg-primary/10 text-primary"
                : "text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/5",
            )}
          >
            {page.toLocaleString("fa-IR")}
          </button>
        ))}

        <button
          type="button"
          aria-label="صفحه بعد"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(
            "flex size-9 items-center justify-center rounded-xl transition-colors",
            canGoNext
              ? "text-gray-500 hover:bg-gray-100 hover:text-primary dark:text-slate-400 dark:hover:bg-white/5 cursor-pointer"
              : "text-gray-300 dark:text-slate-600 cursor-not-allowed",
          )}
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function TicketList({ onNewTicket }: { onNewTicket: () => void }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: tickets = [], isPending } = useTicketsQuery();

  const filteredTickets = useMemo(
    () =>
      tickets.filter((ticket) => {
        const matchesTab = matchesTicketStatusFilter(ticket.status, activeTab);
        const matchesSearch =
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      }),
    [activeTab, searchQuery, tickets]
  );

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedTickets = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredTickets.slice(start, start + PAGE_SIZE);
  }, [filteredTickets, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (isPending) {
    return <TicketListSkeleton rows={3} />;
  }

  return (
    <section className="space-y-4">
      <div className="scrollbar-hide -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer",
              activeTab === tab.id
                ? "border-primary/25 bg-primary/10 text-primary shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                : "border-gray-200/70 bg-white text-gray-500 hover:text-gray-900 dark:border-white/5 dark:bg-[#1c1e26]/80 dark:text-slate-400 dark:hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در تیکت‌ها..."
          className="w-full rounded-2xl border border-gray-200/70 bg-white py-3.5 pe-4 ps-11 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-[#1c1e26]/90 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>

      {filteredTickets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50/70 px-5 py-12 text-center dark:border-white/10 dark:bg-[#1c1e26]/50">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <MessagesSquare className="size-6" />
          </div>
          <h3 className="mb-1.5 text-base font-black text-gray-900 dark:text-white">
            {tickets.length === 0 ? "هنوز تیکتی ندارید" : "نتیجه‌ای یافت نشد"}
          </h3>
          <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            {tickets.length === 0
              ? "اگر سوال یا مشکلی دارید، همین حالا اولین تیکت خود را ثبت کنید تا تیم پشتیبانی بررسی کند."
              : "فیلتر یا عبارت دیگری را امتحان کنید."}
          </p>
          {tickets.length === 0 && (
            <button
              type="button"
              onClick={onNewTicket}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15 cursor-pointer"
            >
              شروع گفتگو
              <ChevronLeft className="size-4" />
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              گفتگوها
            </h2>
            <span className="rounded-full border border-gray-200/70 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
              {toPersianDigits(filteredTickets.length)} تیکت
            </span>
          </div>

          <div className="space-y-2.5">
            {paginatedTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/panel/support/details?ticketId=${encodeURIComponent(ticket.id)}`}
                className="block rounded-2xl border border-gray-200/70 bg-white p-4 transition-all hover:border-primary/25 dark:border-white/5 dark:bg-[#1c1e26]/80 dark:hover:bg-[#1c1e26] cursor-pointer"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="min-w-0 text-sm font-black leading-snug text-gray-900 dark:text-white">
                    {ticket.title}
                  </h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold",
                      getTicketStatusClass(ticket.status),
                    )}
                  >
                    {formatTicketStatusLabel(ticket.status)}
                  </span>
                </div>

                <div className="mb-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-gray-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="size-3.5 text-primary" />
                    {getTicketCategoryLabel(ticket.category)}
                  </span>
                  <span>ثبت: {ticket.createdAt}</span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-gray-400 dark:text-slate-500">
                  <span>بروزرسانی: {ticket.updatedAt}</span>
                  <span className="inline-flex items-center gap-1 text-primary/80">
                    مشاهده گفتگو
                    <ChevronLeft className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <TicketPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}
