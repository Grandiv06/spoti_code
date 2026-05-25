"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  Clock, 
  Calendar, 
  Hash, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Ticket } from "../data";
import { cn } from "@/lib/utils";
import ConversationThread from "./_components/ConversationThread";
import ReplyBox from "./_components/ReplyBox";
import { apiRequest } from "@/lib/api";

interface TicketDetailsClientProps {
  ticket: Ticket | undefined;
}

export default function TicketDetailsClient({ ticket }: TicketDetailsClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(ticket?.messages ?? []);

  useEffect(() => {
    if (!ticket?.id) return;

    const fetchMessages = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        const result = await apiRequest<{ data?: unknown }>(
          "get",
          `/api/tickets/my/${ticket.id}/messages`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );

        const rawList = Array.isArray(result?.data)
          ? result.data
          : Array.isArray((result?.data as { items?: unknown[] } | undefined)?.items)
            ? ((result?.data as { items?: unknown[] }).items as unknown[])
            : [];

        const mapped = rawList.map((item, index) => {
          const row = (item ?? {}) as Record<string, unknown>;
          const createdAt = row.createdAt ? new Date(String(row.createdAt)) : null;
          return {
            id: String(row.id ?? `msg-${index + 1}`),
            sender: String(row.senderType ?? row.sender ?? "").toLowerCase() === "support" ? "support" : "user",
            senderName: String(row.senderName ?? row.authorName ?? "کاربر"),
            text: String(row.message ?? row.text ?? ""),
            timestamp:
              createdAt && !Number.isNaN(createdAt.getTime())
                ? createdAt.toLocaleString("fa-IR")
                : String(row.timestamp ?? "-"),
          };
        });

        setMessages(mapped);
      } catch {
        setMessages(ticket?.messages ?? []);
      }
    };

    fetchMessages();
  }, [ticket?.id]);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6" dir="rtl">
        <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">تیکت مورد نظر پیدا نشد!</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-md">
          متاسفانه تیکتی با این شناسه یافت نشد یا ممکن است دسترسی شما به آن محدود شده باشد.
        </p>
        <button 
          onClick={() => router.push("/panel/support")}
          className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/25 transition-all active:scale-95"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          <span>بازگشت به لیست تیکت‌ها</span>
        </button>
      </div>
    );
  }

  const statusMap = {
    open: { label: "باز", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    investigating: { label: "در حال بررسی", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    answered: { label: "پاسخ داده شده", class: "bg-green-500/10 text-green-500 border-green-500/20" },
    closed: { label: "بسته شده", class: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  };

  const priorityMap = {
    normal: { label: "عادی", class: "bg-gray-100 dark:bg-white/5 text-gray-500" },
    high: { label: "مهم", class: "bg-amber-500/10 text-amber-500" },
    urgent: { label: "فوری", class: "bg-red-500/10 text-red-500" },
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-4">
          <button 
            onClick={() => router.push("/panel/support")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all font-bold group"
          >
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            <span>بازگشت به لیست تیکت‌ها</span>
          </button>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 text-xs font-black tracking-widest text-gray-500 dark:text-gray-400">
              <Hash className="w-3.5 h-3.5" />
              <span>{ticket.id}</span>
            </div>
            <div className={cn("px-4 py-1 rounded-full border text-xs font-black", statusMap[ticket.status].class)}>
              {statusMap[ticket.status].label}
            </div>
            <div className={cn("px-4 py-1 rounded-full text-xs font-black", priorityMap[ticket.priority].class)}>
              اولویت {priorityMap[ticket.priority].label}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            {ticket.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400">تاریخ ثبت</span>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{ticket.createdAt}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400">آخرین بروزرسانی</span>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{ticket.updatedAt}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 md:px-8 lg:px-14 max-w-[1100px] mx-auto min-h-[72vh] flex flex-col justify-center pt-10 md:pt-16">
        {/* Main Conversation Column */}
        <div className="space-y-8">
          <ConversationThread messages={messages} />
          
          <ReplyBox 
            ticketId={ticket.id}
            ticketStatus={ticket.status} 
            onSent={() => {
              const currentId = ticket.id;
              if (!currentId) return;
              const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
              apiRequest<{ data?: unknown }>(
                "get",
                `/api/tickets/my/${currentId}/messages`,
                token ? { headers: { Authorization: `Bearer ${token}` } } : {}
              ).then((result) => {
                const rawList = Array.isArray(result?.data)
                  ? result.data
                  : Array.isArray((result?.data as { items?: unknown[] } | undefined)?.items)
                    ? ((result?.data as { items?: unknown[] }).items as unknown[])
                    : [];
                const mapped = rawList.map((item, index) => {
                  const row = (item ?? {}) as Record<string, unknown>;
                  const createdAt = row.createdAt ? new Date(String(row.createdAt)) : null;
                  return {
                    id: String(row.id ?? `msg-${index + 1}`),
                    sender: String(row.senderType ?? row.sender ?? "").toLowerCase() === "support" ? "support" : "user",
                    senderName: String(row.senderName ?? row.authorName ?? "کاربر"),
                    text: String(row.message ?? row.text ?? ""),
                    timestamp:
                      createdAt && !Number.isNaN(createdAt.getTime())
                        ? createdAt.toLocaleString("fa-IR")
                        : String(row.timestamp ?? "-"),
                  };
                });
                setMessages(mapped);
              }).catch(() => {});
            }}
            onNewTicket={() => router.push("/panel/support")} 
          />
        </div>
      </div>
    </div>
  );
}
