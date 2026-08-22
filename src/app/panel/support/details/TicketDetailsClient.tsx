"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Calendar, Clock, Hash, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Message,
  Ticket,
  formatTicketStatusLabel,
  getTicketStatusClass,
  isTicketClosed,
} from "../data";
import ConversationThread from "./_components/ConversationThread";
import ReplyBox from "./_components/ReplyBox";
import TicketDetailsSkeleton from "./TicketDetailsSkeleton";
import { fetchMyTicketById, fetchMyTicketMessages } from "@/lib/panel-tickets";
import { useCloseMyTicketMutation } from "@/hooks/api/useTicketsQuery";
import CloseTicketConfirmModal from "@/components/tickets/CloseTicketConfirmModal";
import { useSupportChatHeader } from "@/components/panel/SupportChatHeaderContext";

interface TicketDetailsClientProps {
  onBack?: () => void;
}

export default function TicketDetailsClient({ onBack }: TicketDetailsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticketId")?.trim() ?? "";
  const { setInfo: setChatHeaderInfo } = useSupportChatHeader();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const closeTicketMutation = useCloseMyTicketMutation();
  const handleBack = onBack ?? (() => router.push("/panel/support"));

  const scrollToBottom = useCallback((smooth = false) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    if (!ticketId) {
      setTicket(null);
      setMessages([]);
      setNotFound(true);
      setLoading(false);
      setChatHeaderInfo(null);
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
        setChatHeaderInfo({
          subject: ticketData.title,
          status: ticketData.status,
          updatedAt: ticketData.updatedAt,
        });

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
        setChatHeaderInfo(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadTicket();

    return () => {
      active = false;
      setChatHeaderInfo(null);
    };
  }, [setChatHeaderInfo, ticketId]);

  useLayoutEffect(() => {
    if (!ticket) return;
    scrollToBottom(false);
  }, [ticket?.id, messages.length, scrollToBottom, ticket]);

  const appendMessage = (newMessage: Message) => {
    setMessages((prev) => {
      if (prev.some((item) => item.id === newMessage.id)) return prev;
      return [...prev, newMessage];
    });
    requestAnimationFrame(() => scrollToBottom(true));
  };

  const handleCloseTicket = async () => {
    if (!ticket || isTicketClosed(ticket.status) || closeTicketMutation.isPending) return;

    setCloseError(null);
    try {
      const updatedTicket = await closeTicketMutation.mutateAsync(ticket.id);
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              ...updatedTicket,
              messages: updatedTicket.messages.length > 0 ? updatedTicket.messages : prev.messages,
            }
          : prev
      );
      setChatHeaderInfo({
        subject: updatedTicket.title || ticket.title,
        status: updatedTicket.status,
        updatedAt: updatedTicket.updatedAt,
      });
      setShowCloseConfirm(false);
    } catch (error) {
      setCloseError(error instanceof Error ? error.message : "بستن تیکت انجام نشد.");
    }
  };

  if (loading) {
    return <TicketDetailsSkeleton />;
  }

  if (!ticket || notFound) {
    return (
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center space-y-4 px-3 py-4 lg:max-w-5xl" dir="rtl">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-primary dark:text-slate-400 cursor-pointer"
        >
          <ArrowRight className="size-4" />
          بازگشت به تیکت‌ها
        </button>
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-5 py-8 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <AlertCircle className="size-6" />
          </div>
          <p className="text-sm font-black text-red-600 dark:text-red-300">
            تیکت مورد نظر پیدا نشد یا دسترسی شما محدود است.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col lg:max-w-6xl lg:flex-row lg:gap-4 lg:px-4 lg:py-3" dir="rtl">
      <aside className="hidden w-72 shrink-0 flex-col rounded-[1.35rem] border border-gray-200/70 bg-white p-5 dark:border-white/5 dark:bg-[#1c1e26] lg:flex">
        <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
          جزئیات تیکت
        </p>
        <h2 className="text-base font-black leading-snug text-gray-900 dark:text-white">
          {ticket.title}
        </h2>
        <span
          className={cn(
            "mt-3 inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold",
            getTicketStatusClass(ticket.status),
          )}
        >
          {formatTicketStatusLabel(ticket.status)}
        </span>

        <div className="mt-5 space-y-3 text-xs font-bold text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Hash className="size-3.5 text-primary" />
            <span className="truncate">{ticket.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-primary" />
            <span>ثبت: {ticket.createdAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 text-primary" />
            <span>بروزرسانی: {ticket.updatedAt}</span>
          </div>
        </div>

        {!isTicketClosed(ticket.status) ? (
          <button
            type="button"
            onClick={() => {
              setCloseError(null);
              setShowCloseConfirm(true);
            }}
            disabled={closeTicketMutation.isPending}
            className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50 cursor-pointer"
          >
            <XCircle className="size-4" />
            بستن تیکت
          </button>
        ) : null}
      </aside>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden border-y border-gray-200/70 bg-white dark:border-white/5 dark:bg-[#111111] sm:mx-3 sm:my-2 sm:rounded-[1.35rem] sm:border lg:mx-0 lg:my-0">
        <div
          ref={listRef}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 py-4 sm:px-5 lg:px-8 lg:py-6"
        >
          <ConversationThread messages={messages} />
        </div>

        <div className="shrink-0 border-t border-gray-200/70 bg-gray-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-white/5 dark:bg-[#141414] sm:p-3.5 lg:p-4">
          {!isTicketClosed(ticket.status) ? (
            <button
              type="button"
              onClick={() => {
                setCloseError(null);
                setShowCloseConfirm(true);
              }}
              disabled={closeTicketMutation.isPending}
              className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 transition-colors hover:text-red-500 disabled:opacity-50 cursor-pointer lg:hidden"
            >
              <XCircle className="size-3.5" />
              بستن تیکت
            </button>
          ) : null}

          <ReplyBox
            ticketId={ticket.id}
            ticketStatus={ticket.status}
            onSent={appendMessage}
            onNewTicket={() => router.push("/panel/support?create=1")}
            onFocusComposer={() => scrollToBottom(true)}
          />
        </div>
      </section>

      <CloseTicketConfirmModal
        isOpen={showCloseConfirm}
        ticketTitle={ticket.title}
        isPending={closeTicketMutation.isPending}
        error={closeError}
        onCancel={() => {
          if (closeTicketMutation.isPending) return;
          setCloseError(null);
          setShowCloseConfirm(false);
        }}
        onConfirm={() => void handleCloseTicket()}
      />
    </div>
  );
}
