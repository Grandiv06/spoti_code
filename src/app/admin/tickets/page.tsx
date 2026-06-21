"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Headset, Search, MessageSquare, Clock3, CheckCircle2, AlertTriangle, Send, Paperclip } from "lucide-react";
import { mockTickets, Ticket } from "@/app/panel/support/data";
import { apiGetNoMock } from "@/lib/api";
import { normalizeAdminTicketsResponse } from "@/lib/admin-tickets";
import { cn } from "@/lib/utils";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await apiGetNoMock<unknown>("/api/admin-dashboard/tickets");
        const mapped = normalizeAdminTicketsResponse(response);
        setTickets(mapped.length > 0 ? mapped : mockTickets);
      } catch {
        setTickets(mockTickets);
      } finally {
        setIsLoadingTickets(false);
      }
    };

    fetchTickets();
  }, []);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "open").length;
    const investigating = tickets.filter((t) => t.status === "investigating").length;
    const answered = tickets.filter((t) => t.status === "answered").length;
    return { total, open, investigating, answered };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.trim().toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [tickets, statusFilter, priorityFilter, searchQuery]);

  const selectedTicket = filteredTickets.find((t) => t.id === selectedTicketId) || filteredTickets[0];

  const statusPill = {
    open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    investigating: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    answered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    closed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const statusLabel = {
    open: "باز",
    investigating: "در حال بررسی",
    answered: "پاسخ داده شده",
    closed: "بسته شده",
  };

  const priorityLabel = {
    normal: "عادی",
    high: "مهم",
    urgent: "فوری",
  };

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

  const handleReply = () => {
    if (!selectedTicket || !replyText.trim()) return;
    const msg = {
      id: `m-${Date.now()}`,
      sender: "support" as const,
      senderName: "پشتیبانی ادمین",
      text: replyText.trim(),
      timestamp: "همین الان",
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: "answered",
              updatedAt: "همین الان",
              messages: [...t.messages, msg],
              timeline: [
                ...t.timeline,
                {
                  id: `tl-${Date.now()}`,
                  title: "پاسخ توسط ادمین ارسال شد",
                  time: "الان",
                  icon: "reply",
                  status: "completed",
                },
              ],
            }
          : t
      )
    );
    setReplyText("");
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <TicketStat title="کل تیکت‌ها" value={stats.total.toLocaleString("fa-IR")} icon={<MessageSquare className="w-4 h-4 text-primary" />} />
        <TicketStat title="تیکت باز" value={stats.open.toLocaleString("fa-IR")} icon={<AlertTriangle className="w-4 h-4 text-blue-500" />} />
        <TicketStat title="در حال بررسی" value={stats.investigating.toLocaleString("fa-IR")} icon={<Clock3 className="w-4 h-4 text-amber-500" />} />
        <TicketStat title="پاسخ داده شده" value={stats.answered.toLocaleString("fa-IR")} icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} />
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس عنوان، شناسه یا دسته‌بندی..."
              className="w-full h-11 rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 pr-10 pl-3 text-xs font-bold outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 text-xs font-bold outline-none focus:border-primary"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="open">باز</option>
            <option value="investigating">در حال بررسی</option>
            <option value="answered">پاسخ داده شده</option>
            <option value="closed">بسته شده</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 text-xs font-bold outline-none focus:border-primary"
          >
            <option value="all">همه اولویت‌ها</option>
            <option value="normal">عادی</option>
            <option value="high">مهم</option>
            <option value="urgent">فوری</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8">
          {isLoadingTickets ? (
            <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-10 text-center text-gray-400 font-bold">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-xs font-black text-gray-500 dark:text-gray-400">در حال دریافت تیکت‌ها از سرور...</p>
            </div>
          ) : selectedTicket ? (
            <div className="rounded-[2.5rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{selectedTicket.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-2">
                    {selectedTicket.id} • {selectedTicket.category} • بروزرسانی: {selectedTicket.updatedAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedTicket.id, "investigating")}
                    className="px-4 py-2 rounded-2xl bg-amber-500/10 text-amber-500 text-xs font-black"
                  >
                    در حال بررسی
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedTicket.id, "closed")}
                    className="px-4 py-2 rounded-2xl bg-gray-500/10 text-gray-500 text-xs font-black"
                  >
                    بستن تیکت
                  </button>
                </div>
              </div>

              <div className="space-y-5 max-h-[420px] overflow-y-auto">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "rounded-[2rem] p-6 border text-sm leading-relaxed shadow-sm",
                      m.sender === "user"
                        ? "bg-white dark:bg-[#1c1e26] border-gray-100 dark:border-white/5 text-gray-900 dark:text-gray-100 rounded-tr-none"
                        : "bg-primary text-white border-primary/20 rounded-tl-none shadow-lg shadow-primary/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3 text-[10px] font-black">
                      <span>{m.senderName}</span>
                      <span className={m.sender === "user" ? "text-gray-400" : "text-white/80"}>{m.timestamp}</span>
                    </div>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-white dark:bg-[#1c1e26] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/40 dark:shadow-none">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ ادمین را بنویسید..."
                  className="w-full min-h-[120px] max-h-[170px] px-5 py-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-right resize-y font-medium leading-relaxed"
                />
                <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-xs text-gray-400 font-bold max-w-sm text-right">
                    لطفاً جزئیات بیشتر یا اسکرین‌شات خطا را ارسال کنید تا پاسخ دقیق‌تری ثبت شود.
                  </p>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="p-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-90">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleReply}
                      className="flex-1 md:flex-none px-10 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <span>ارسال پاسخ</span>
                      <Send className="w-5 h-5 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] p-10 text-center text-gray-400 font-bold">
              تیکتی برای نمایش وجود ندارد.
            </div>
          )}
        </div>

        <div className="xl:col-span-4 space-y-3">
          {filteredTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={cn(
                "w-full rounded-3xl border p-4 text-right transition-all",
                selectedTicket?.id === ticket.id
                  ? "border-primary/30 bg-primary/5"
                  : "border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1e26] hover:border-primary/20"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400">{ticket.id}</span>
                <span className={cn("px-2 py-1 rounded-lg border text-[10px] font-black", statusPill[ticket.status])}>
                  {statusLabel[ticket.status]}
                </span>
              </div>
              <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-2">{ticket.title}</p>
              <div className="mt-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>{ticket.category}</span>
                <span>اولویت: {priorityLabel[ticket.priority]}</span>
              </div>
            </button>
          ))}
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
