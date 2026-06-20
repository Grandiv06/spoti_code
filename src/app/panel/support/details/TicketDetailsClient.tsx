"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Clock,
  Calendar,
  Hash,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Message, Ticket } from "../data";
import { cn } from "@/lib/utils";
import ConversationThread from "./_components/ConversationThread";
import ReplyBox from "./_components/ReplyBox";
import TicketDetailsSkeleton from "./TicketDetailsSkeleton";
import { fetchMyTicketById, fetchMyTicketMessages } from "@/lib/panel-tickets";

interface TicketDetailsClientProps {
  onBack?: () => void;
}

export default function TicketDetailsClient({ onBack }: TicketDetailsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticketId")?.trim() ?? "";
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const handleBack = onBack ?? (() => router.push("/panel/support"));

  useEffect(() => {
    if (!ticketId) {
      setTicket(null);
      setMessages([]);
      setNotFound(true);
      setLoading(false);
      return;
    }

    let active = true;

    const loadTicket = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const ticketData = await fetchMyTicketById(ticketId);
        if (!active) return;

        setTicket(ticketData);

        if (ticketData.messages.length > 0) {
          setMessages(ticketData.messages);
          return;
        }

        try {
          const messageList = await fetchMyTicketMessages(ticketId);
          if (!active) return;
          setMessages(messageList.length > 0 ? messageList : ticketData.messages);
        } catch {
          if (!active) return;
          setMessages(ticketData.messages);
        }
      } catch {
        if (!active) return;
        setTicket(null);
        setMessages([]);
        setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTicket();

    return () => {
      active = false;
    };
  }, [ticketId]);

  const appendMessage = (newMessage: Message) => {
    setMessages((prev) => {
      if (prev.some((item) => item.id === newMessage.id)) return prev;
      return [...prev, newMessage];
    });
  };

  useEffect(() => {
    const container = messagesScrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  if (loading) {
    return <TicketDetailsSkeleton />;
  }

  if (!ticket || notFound) {
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
          onClick={handleBack}
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
    <div
      className="mx-auto flex h-[calc(100dvh-7.5rem)] max-w-[1400px] flex-col overflow-hidden px-2 md:px-4 animate-in fade-in duration-700"
      dir="rtl"
    >
      <div className="mb-4 shrink-0 md:mb-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3 md:space-y-4">
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 font-bold text-gray-500 transition-all hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <span>بازگشت به لیست تیکت‌ها</span>
            </button>

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-black tracking-widest text-gray-500 dark:border-white/5 dark:bg-white/5 dark:text-gray-400">
                <Hash className="h-3.5 w-3.5" />
                <span>{ticket.id}</span>
              </div>
              <div className={cn("rounded-full border px-4 py-1 text-xs font-black", statusMap[ticket.status].class)}>
                {statusMap[ticket.status].label}
              </div>
              <div className={cn("rounded-full px-4 py-1 text-xs font-black", priorityMap[ticket.priority].class)}>
                اولویت {priorityMap[ticket.priority].label}
              </div>
            </div>

            <h1 className="text-2xl font-black leading-tight text-gray-900 dark:text-white md:text-3xl">
              {ticket.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-gray-100 bg-white p-4 text-sm font-bold text-gray-500 shadow-sm dark:border-white/5 dark:bg-white/5 dark:text-gray-400 md:gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400">تاریخ ثبت</span>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{ticket.createdAt}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-white/10" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400">آخرین بروزرسانی</span>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{ticket.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-[1100px] flex-1 flex-col px-1 md:px-8 lg:px-14">
        <div
          ref={messagesScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 pb-4"
        >
          <ConversationThread messages={messages} />
        </div>

        <div className="shrink-0 border-t border-gray-200/80 bg-gray-50 pt-3 dark:border-white/10 dark:bg-[#14161c] md:pt-4">
          <ReplyBox
            ticketId={ticket.id}
            ticketStatus={ticket.status}
            onSent={appendMessage}
            onNewTicket={() => router.push("/panel/support")}
          />
        </div>
      </div>
    </div>
  );
}
