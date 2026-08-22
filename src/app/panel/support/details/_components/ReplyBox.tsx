"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Message, isTicketClosed } from "../../data";
import { sendMyTicketMessage } from "@/lib/panel-tickets";

export default function ReplyBox({
  ticketId,
  ticketStatus,
  onSent,
  onNewTicket,
  onFocusComposer,
}: {
  ticketId: string;
  ticketStatus: string;
  onSent?: (message: Message) => void;
  onNewTicket: () => void;
  onFocusComposer?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isClosed = isTicketClosed(ticketStatus);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setError("");
    setLoading(true);
    try {
      const sentMessage = await sendMyTicketMessage(ticketId, trimmed);
      setMessage("");
      onSent?.(sentMessage);
    } catch {
      setError("ارسال پاسخ انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  if (isClosed) {
    return (
      <div className="space-y-2.5">
        <div className="rounded-2xl border border-gray-200/70 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
          این تیکت بسته شده است. برای موضوع جدید، تیکت دیگری ثبت کنید.
        </div>
        <button
          type="button"
          onClick={onNewTicket}
          className="flex h-11 w-full items-center justify-center rounded-2xl bg-primary text-sm font-black text-white shadow-[0_10px_28px_rgba(34,197,94,0.22)] transition-all hover:bg-primary-hover active:scale-[0.98] cursor-pointer"
        >
          ثبت تیکت جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error ? (
        <p className="text-[11px] font-bold text-red-500">{error}</p>
      ) : null}
      <div className="flex items-end gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          rows={1}
          maxLength={4000}
          disabled={loading}
          className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-base leading-6 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/45 dark:border-white/10 dark:bg-[#000000] dark:text-white dark:placeholder:text-slate-600"
          onFocus={() => {
            window.setTimeout(() => onFocusComposer?.(), 250);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void sendMessage();
            }
          }}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white transition-colors hover:bg-primary-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="ارسال پیام"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </button>
      </div>
    </form>
  );
}
