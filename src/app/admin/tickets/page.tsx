"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Headset, Search, MessageSquare, Clock3, CheckCircle2, AlertTriangle, Send, Paperclip, Filter, Signal } from "lucide-react";
import type { Ticket } from "@/app/panel/support/data";
import { TICKET_URGENCY_OPTIONS, getTicketCategoryLabel } from "@/app/panel/support/data";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  mapAdminTicketPriorityFilter,
  mapAdminTicketStatusFilter,
  useAdminTicketDetailQuery,
  useAdminTicketsQuery,
  useCloseAdminTicketMutation,
  useSendAdminTicketMessageMutation,
} from "@/hooks/api/useAdminTicketsQuery";
import {
  AdminTicketDetailSkeleton,
  AdminTicketListSkeleton,
  AdminTicketsStatsSkeleton,
} from "./_components/AdminTicketsSkeletons";
import AdminTicketConversation from "./_components/AdminTicketConversation";
import AdminTicketList from "./_components/AdminTicketList";

type TicketFilters = {
  search: string;
  status: string;
  priority: string;
};

const defaultTicketFilters: TicketFilters = {
  search: "",
  status: "all",
  priority: "all",
};

const statusFilterOptions = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "open", label: "باز" },
  { value: "investigating", label: "در حال بررسی" },
  { value: "answered", label: "پاسخ داده شده" },
  { value: "closed", label: "بسته شده" },
];

const priorityFilterOptions = [
  { value: "all", label: "همه اولویت‌ها" },
  ...TICKET_URGENCY_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  })),
];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [debouncedFilters, setDebouncedFilters] = useState<TicketFilters>(defaultTicketFilters);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const closeTicketMutation = useCloseAdminTicketMutation();
  const sendMessageMutation = useSendAdminTicketMessageMutation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilters({
        search: searchQuery.trim(),
        status: statusFilter,
        priority: priorityFilter,
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery, statusFilter, priorityFilter]);

  const { data, isPending, isFetching, isError, refetch } = useAdminTicketsQuery({
    search: debouncedFilters.search || undefined,
    status: mapAdminTicketStatusFilter(debouncedFilters.status),
    urgency: mapAdminTicketPriorityFilter(debouncedFilters.priority),
  });

  useEffect(() => {
    if (data) {
      setTickets(data);
    }
  }, [data]);

  const isLoadingTickets = isPending || isFetching;

  useEffect(() => {
    if (tickets.length === 0) {
      setSelectedTicketId("");
      return;
    }

    if (!tickets.some((ticket) => ticket.id === selectedTicketId)) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "open").length;
    const investigating = tickets.filter((t) => t.status === "investigating").length;
    const answered = tickets.filter((t) => t.status === "answered").length;
    return { total, open, investigating, answered };
  }, [tickets]);

  const displayedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => b.id.localeCompare(a.id));
  }, [tickets]);

  const isFiltersPending =
    searchQuery.trim() !== debouncedFilters.search ||
    statusFilter !== debouncedFilters.status ||
    priorityFilter !== debouncedFilters.priority;
  const isLoadingList = isLoadingTickets || isFiltersPending;
  const showTicketsContent = !isError || tickets.length > 0;

  const ticketDetailQuery = useAdminTicketDetailQuery(
    selectedTicketId,
    Boolean(selectedTicketId) && showTicketsContent && !isLoadingList
  );

  useEffect(() => {
    if (!ticketDetailQuery.data) return;
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketDetailQuery.data!.id) return ticket;
        const detail = ticketDetailQuery.data!;
        const messages =
          ticket.messages.length > detail.messages.length ? ticket.messages : detail.messages;
        return { ...ticket, ...detail, messages };
      })
    );
  }, [ticketDetailQuery.data]);

  const scrollConversationToBottom = (behavior: ScrollBehavior = "smooth") => {
    conversationEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  const selectedTicketFromList = showTicketsContent && !isLoadingList
    ? displayedTickets.find((t) => t.id === selectedTicketId) || displayedTickets[0]
    : undefined;

  const selectedTicket = selectedTicketFromList
    ? ticketDetailQuery.data && ticketDetailQuery.data.id === selectedTicketFromList.id
      ? {
          ...selectedTicketFromList,
          ...ticketDetailQuery.data,
          messages:
            selectedTicketFromList.messages.length > ticketDetailQuery.data.messages.length
              ? selectedTicketFromList.messages
              : ticketDetailQuery.data.messages,
        }
      : selectedTicketFromList
    : undefined;

  useEffect(() => {
    if (!selectedTicketId) return;
    scrollConversationToBottom("auto");
  }, [selectedTicketId]);

  useEffect(() => {
    if (!selectedTicket?.messages.length) return;
    scrollConversationToBottom();
  }, [selectedTicket?.messages.length, selectedTicket?.id]);

  const isLoadingDetail =
    Boolean(selectedTicketId) &&
    showTicketsContent &&
    !isLoadingList &&
    (ticketDetailQuery.isPending || ticketDetailQuery.isFetching);

  const handleStatusChange = (ticketId: string, nextStatus: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: nextStatus,
              updatedAt: "همین الان",
            }
          : t
      )
    );
  };

  const handleCloseTicket = async (ticketId: string) => {
    setActionError(null);
    try {
      const updatedTicket = await closeTicketMutation.mutateAsync(ticketId);
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                ...updatedTicket,
                messages: updatedTicket.messages.length > 0 ? updatedTicket.messages : ticket.messages,
                timeline: updatedTicket.timeline.length > 0 ? updatedTicket.timeline : ticket.timeline,
                attachments: updatedTicket.attachments.length > 0 ? updatedTicket.attachments : ticket.attachments,
              }
            : ticket
        )
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "بستن تیکت انجام نشد.");
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyText.trim() || selectedTicket.status === "closed") return;

    setActionError(null);
    const body = replyText.trim();

    try {
      const newMessage = await sendMessageMutation.mutateAsync({
        ticketId: selectedTicket.id,
        body,
      });

      setReplyText("");
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? {
                ...t,
                status: "answered",
                updatedAt: newMessage.timestamp,
                messages: [...t.messages, newMessage],
              }
            : t
        )
      );
      requestAnimationFrame(() => scrollConversationToBottom());
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "ارسال پاسخ انجام نشد.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40">
              <Headset className="w-8 h-8" />
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">مدیریت تیکت‌های پشتیبانی</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                پاسخ‌گویی به تیکت‌های کاربران ثبت‌شده از پنل کاربری
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoadingList ? (
        <AdminTicketsStatsSkeleton />
      ) : showTicketsContent ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <TicketStat title="کل تیکت‌ها" value={stats.total.toLocaleString("fa-IR")} icon={<MessageSquare className="w-4 h-4 text-primary" />} />
          <TicketStat title="تیکت باز" value={stats.open.toLocaleString("fa-IR")} icon={<AlertTriangle className="w-4 h-4 text-blue-500" />} />
          <TicketStat title="در حال بررسی" value={stats.investigating.toLocaleString("fa-IR")} icon={<Clock3 className="w-4 h-4 text-amber-500" />} />
          <TicketStat title="پاسخ داده شده" value={stats.answered.toLocaleString("fa-IR")} icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} />
        </div>
      ) : null}

      <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 mb-6">
        {isError ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <p className="text-xs font-black">بارگذاری تیکت‌ها انجام نشد.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-[10px] font-bold text-white transition-colors hover:bg-red-700"
            >
              تلاش مجدد
            </button>
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
          <div className="relative md:col-span-2 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس عنوان، شناسه یا دسته‌بندی..."
              className="h-full min-h-[46px] w-full rounded-2xl border border-gray-100 bg-gray-50 py-3.5 pr-11 pl-10 text-xs font-bold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            {isLoadingList ? (
              <div className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            ) : null}
          </div>
          <CustomSelect
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="وضعیت"
            size="md"
            className="h-full [&>div]:h-full [&_button]:h-full [&_button]:min-h-[46px] [&_button]:text-xs [&_button]:px-4"
            icon={<Filter className="w-4 h-4" />}
          />
          <CustomSelect
            options={priorityFilterOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="اولویت"
            size="md"
            className="h-full [&>div]:h-full [&_button]:h-full [&_button]:min-h-[46px] [&_button]:text-xs [&_button]:px-4"
            icon={<Signal className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:gap-8">
        <div className="order-2 xl:order-1 xl:col-span-8">
          {isLoadingList || isLoadingDetail ? (
            <AdminTicketDetailSkeleton />
          ) : ticketDetailQuery.isError && selectedTicketId ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <p className="text-sm font-black">بارگذاری جزئیات تیکت انجام نشد.</p>
              <p className="mt-2 text-xs leading-relaxed opacity-90">
                {ticketDetailQuery.error?.message || "لطفاً اتصال شبکه را بررسی کنید."}
              </p>
              <button
                type="button"
                onClick={() => void ticketDetailQuery.refetch()}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-700"
              >
                تلاش مجدد
              </button>
            </div>
          ) : showTicketsContent && selectedTicket ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/40 dark:border-white/5 dark:bg-[#1c1e26] dark:shadow-none sm:rounded-[2rem] sm:p-6 lg:rounded-[2.5rem] lg:p-8">
              <div className="mb-4 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-lg font-black leading-snug text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                    {selectedTicket.title}
                  </h3>
                  <p className="mt-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 sm:text-xs">
                    {getTicketCategoryLabel(selectedTicket.category)} • بروزرسانی: {selectedTicket.updatedAt}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedTicket.id, "investigating")}
                    className="flex-1 rounded-2xl bg-amber-500/10 px-4 py-2.5 text-xs font-black text-amber-500 sm:flex-none"
                  >
                    در حال بررسی
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCloseTicket(selectedTicket.id)}
                    disabled={selectedTicket.status === "closed" || closeTicketMutation.isPending}
                    className="flex-1 rounded-2xl bg-gray-500/10 px-4 py-2.5 text-xs font-black text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    {closeTicketMutation.isPending ? "در حال بستن..." : "بستن تیکت"}
                  </button>
                </div>
              </div>

              {actionError ? (
                <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-400">
                  {actionError}
                </div>
              ) : null}

              <div className="min-h-[240px] max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain px-0.5 sm:min-h-[280px] lg:max-h-[420px]">
                <AdminTicketConversation messages={selectedTicket.messages} />
                <div ref={conversationEndRef} aria-hidden="true" />
              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/40 dark:border-white/5 dark:bg-[#1c1e26] dark:shadow-none sm:mt-6 sm:rounded-[2rem] sm:p-6 lg:mt-8 lg:rounded-[2.5rem] lg:p-8">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ ادمین را بنویسید..."
                  className="w-full min-h-[100px] max-h-[170px] resize-y rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-right text-sm font-medium leading-relaxed text-gray-900 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white sm:min-h-[120px] sm:rounded-3xl sm:px-5 sm:py-4"
                />
                <div className="mt-4 flex flex-col items-stretch justify-between gap-4 sm:mt-5 sm:flex-row sm:items-center sm:gap-6">
                  <p className="hidden max-w-sm text-right text-xs font-bold text-gray-400 sm:block">
                    لطفاً جزئیات بیشتر یا اسکرین‌شات خطا را ارسال کنید تا پاسخ دقیق‌تری ثبت شود.
                  </p>
                  <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-4">
                    <button
                      type="button"
                      className="shrink-0 rounded-2xl bg-gray-100 p-3.5 text-gray-500 transition-all hover:bg-gray-200 active:scale-90 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 sm:p-4"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleReply()}
                      disabled={
                        !replyText.trim() ||
                        selectedTicket.status === "closed" ||
                        sendMessageMutation.isPending
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:gap-3 sm:px-10 sm:py-4"
                    >
                      <span>{sendMessageMutation.isPending ? "در حال ارسال..." : "ارسال پاسخ"}</span>
                      <Send className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : showTicketsContent ? (
            <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-10 text-center text-gray-400 font-bold">
              تیکتی برای نمایش وجود ندارد.
            </div>
          ) : null}
        </div>

        <div className="order-1 xl:order-2 xl:col-span-4">
          {isLoadingList ? (
            <AdminTicketListSkeleton />
          ) : showTicketsContent ? (
            <AdminTicketList
              tickets={displayedTickets}
              selectedTicketId={selectedTicket?.id}
              onSelect={(ticketId) => {
                setSelectedTicketId(ticketId);
                setActionError(null);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TicketStat({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-gray-500 font-bold block">{title}</span>
        {icon}
      </div>
      <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
