"use client";

import React, { useState } from "react";
import { Send, Paperclip, AlertCircle, Plus } from "lucide-react";

export default function ReplyBox({ ticketStatus, onNewTicket }: { ticketStatus: string, onNewTicket: () => void }) {
  const [loading, setLoading] = useState(false);
  const isClosed = ticketStatus === "closed";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("پاسخ شما با موفقیت ارسال شد.");
    }, 1500);
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
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>ثبت تیکت جدید</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1c1e26] rounded-[2.5rem] p-6 md:p-7 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/40 dark:shadow-none">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative group">
          <textarea
            required
            rows={3}
            placeholder="پاسخ خود را اینجا بنویسید..."
            className="w-full min-h-[120px] max-h-[170px] px-5 py-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-right resize-y font-medium leading-relaxed"
          ></textarea>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-400 font-bold max-w-sm text-right">
            لطفاً جزئیات بیشتر، اسکرین‌شات یا خطای مشاهده شده را ارسال کنید تا بهتر کمکتان کنیم.
          </p>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              type="button"
              className="p-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-90"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none px-10 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group"
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
