"use client";

import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader2, Paperclip, Send, X } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { TICKET_CATEGORY_OPTIONS } from "@/app/panel/support/data";
import { ticketQueryKey } from "@/hooks/api/useTicketsQuery";
import { apiPostNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";
import { uploadTicketAttachment, type TicketAttachment } from "@/lib/ticket-attachments";

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const MAX_ATTACHMENTS = 1;

export default function TicketForm({ onBack }: { onBack: () => void }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [error, setError] = useState("");

  const categoryOptions = TICKET_CATEGORY_OPTIONS;

  const handleAttachmentPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (attachments.length >= MAX_ATTACHMENTS) {
      setError("فقط یک فایل می‌توانید پیوست کنید");
      return;
    }

    if (file.size > MAX_ATTACHMENT_BYTES) {
      setError("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const uploaded = await uploadTicketAttachment(file);
      setAttachments([uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "آپلود فایل انجام نشد");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPostNoMock(
        "/api/tickets/my",
        {
          subject: title.trim(),
          description,
          category,
          tags: [],
          firstMessage: description,
          attachments,
        },
        getAuthHeaders()
      );
      await queryClient.invalidateQueries({ queryKey: ticketQueryKey });
      onBack();
    } catch {
      setError("ثبت تیکت انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="rounded-3xl border border-gray-200/70 bg-white dark:border-white/5 dark:bg-[#1c1e26]/80 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition-colors hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-[#14161c] dark:text-slate-300 cursor-pointer"
            aria-label="بازگشت"
          >
            <ArrowRight className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] font-bold tracking-wide text-primary/90">
              پشتیبانی آنلاین
            </p>
            <h1 className="text-xl font-black leading-tight text-gray-900 dark:text-white sm:text-2xl">
              تیکت جدید
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              موضوع و توضیحات مشکل خود را بنویسید؛ تیم پشتیبانی در اسرع وقت
              پاسخ می‌دهد.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-gray-200/70 bg-white dark:border-white/5 dark:bg-[#1c1e26]/80 p-5 sm:p-6"
      >
        <div className="space-y-1.5">
          <label
            htmlFor="ticket-subject"
            className="text-xs font-bold text-gray-500 dark:text-slate-400"
          >
            موضوع
          </label>
          <input
            id="ticket-subject"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="یک عنوان کوتاه و گویا انتخاب کنید..."
            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/50 dark:border-white/10 dark:bg-[#14161c] dark:text-white dark:placeholder:text-slate-600"
          />
        </div>

        <div className="relative z-30 space-y-1.5">
          <CustomSelect
            label="دسته‌بندی موضوع"
            value={category}
            options={categoryOptions}
            onChange={setCategory}
            placeholder="انتخاب کنید..."
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="ticket-message"
            className="text-xs font-bold text-gray-500 dark:text-slate-400"
          >
            توضیحات کامل مشکل
          </label>
          <textarea
            id="ticket-message"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            maxLength={4000}
            placeholder="جزئیات مشکل، خطاها و مراحلی که طی کردید را اینجا بنویسید..."
            className="min-h-[9rem] w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm leading-7 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/50 dark:border-white/10 dark:bg-[#14161c] dark:text-white dark:placeholder:text-slate-600"
          />
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {attachments.map((file) => (
              <div
                key={file.url}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-700 dark:border-white/10 dark:bg-[#14161c] dark:text-slate-200"
              >
                <Paperclip className="size-4 text-primary" />
                <span className="max-w-[180px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAttachments([]);
                    setError("");
                  }}
                  className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
                  aria-label={`حذف ${file.name}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.txt,.log,.zip"
            className="hidden"
            onChange={(event) => void handleAttachmentPick(event)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || loading || attachments.length >= MAX_ATTACHMENTS}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-bold text-gray-600 transition-colors hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Paperclip className="size-4" />
            {uploading
              ? "در حال آپلود..."
              : attachments.length >= MAX_ATTACHMENTS
                ? "فایل پیوست شده"
                : "پیوست فایل (تصویر یا لاگ)"}
          </button>

          <button
            type="submit"
            disabled={loading || uploading}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-black text-white shadow-[0_10px_28px_rgba(34,197,94,0.22)] transition-all hover:bg-primary-hover active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              <>
                <Send className="size-4" />
                ارسال تیکت
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
