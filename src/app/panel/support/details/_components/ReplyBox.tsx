"use client";

import React, { useState } from "react";
import { Send, Paperclip, AlertCircle, Plus } from "lucide-react";
import { Message, isTicketClosed } from "../../data";
import { sendMyTicketMessage } from "@/lib/panel-tickets";

export default function ReplyBox({
  ticketId,
  ticketStatus,
  onSent,
  onNewTicket,
}: {
  ticketId: string;
  ticketStatus: string;
  onSent?: (message: Message) => void;
  onNewTicket: () => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void sendMessage();
  };

  if (isClosed) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-8 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">این تیکت بسته شده است</h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
          اگر هنوز مشکل دارید یا سوال جدیدی برایتان پیش آمده، می‌توانید یک تیکت جدید ثبت کنید.
        </p>
        <button
          onClick={onNewTicket}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>ثبت تیکت جدید</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-xl shadow-gray-200/40 dark:border-white/5 dark:bg-[#1c1e26] dark:shadow-none md:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm font-bold text-red-500">{error}</p>}
        <div className="relative group">
          <textarea
            required
            rows={3}
            value={message}
            disabled={loading}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (loading) return;
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="پاسخ خود را اینجا بنویسید..."
            className="w-full min-h-[88px] max-h-[140px] resize-none rounded-3xl border border-gray-100 bg-gray-50 px-5 py-3 text-right text-sm font-medium leading-relaxed text-gray-900 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="max-w-sm text-right text-xs font-bold text-gray-400">
            برای خط جدید Shift+Enter را بزنید.
          </p>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <button
              type="button"
              disabled={loading}
              className="cursor-pointer rounded-2xl bg-gray-100 p-3.5 text-gray-500 transition-all hover:bg-gray-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:disabled:hover:bg-white/5"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="group flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-3.5 font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-primary md:flex-none"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>ارسال پاسخ</span>
                  <Send className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
