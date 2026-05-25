"use client";

import React, { useState } from "react";
import { Send, AlertCircle, Paperclip, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomSelect from "@/components/ui/CustomSelect";
import { apiPost } from "@/lib/api";

export default function TicketForm({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("normal");
  const [error, setError] = useState("");

  const categoryOptions = [
    { label: "دوره های آموزشی", value: "courses" },
    { label: "مالی و پرداخت", value: "payment" },
    { label: "حساب کاربری", value: "account" },
    { label: "مشکلات فنی", value: "technical" },
    { label: "سایر موارد", value: "other" },
  ];

  const priorityOptions = [
    { label: "عادی", value: "normal" },
    { label: "مهم", value: "high" },
    { label: "فوری", value: "urgent" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      await apiPost(
        "/api/tickets/my",
        {
          title,
          description,
          category,
          priority,
        },
        token ? { Authorization: `Bearer ${token}` } : undefined
      );
      onBack();
    } catch {
      setError("ثبت تیکت انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all font-bold group"
        >
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span>بازگشت به لیست تیکت‌ها</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#1c1e26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-4 bg-gray-50/50 dark:bg-white/[0.02] p-8 md:p-12 border-l border-gray-100 dark:divide-white/5 space-y-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">راهنمای ثبت تیکت</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                برای دریافت پاسخ دقیق‌تر و سریع‌تر، لطفاً اطلاعات خواسته شده را با دقت تکمیل کنید.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { title: "عنوان گویا", desc: "خلاصه‌ای از مشکل را در عنوان بنویسید." },
                { title: "دسته‌بندی درست", desc: "بخش مرتبط با مشکل را انتخاب کنید." },
                { title: "جزئیات کامل", desc: "هرچه اطلاعات بیشتری بدهید، بهتر کمک می‌کنیم." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <div className="flex items-center gap-3 text-primary mb-3">
                <AlertCircle className="w-5 h-5" />
                <span className="font-black text-sm">پشتیبانی فعال</span>
              </div>
              <p className="text-xs text-primary/70 font-bold leading-relaxed">
                تیم پشتیبانی ما در حال حاضر آنلاین است و تیکت‌های جدید را بررسی می‌کند.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-8 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <p className="text-sm font-bold text-red-500">{error}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 mr-1">عنوان درخواست شما</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="یک عنوان کوتاه و گویا انتخاب کنید..."
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-right font-bold"
                  />
                </div>

                <div className="z-30">
                  <CustomSelect
                    label="دسته‌بندی موضوع"
                    value={category}
                    options={categoryOptions}
                    onChange={setCategory}
                    placeholder="انتخاب کنید..."
                  />
                </div>

                <div className="z-20">
                  <CustomSelect
                    label="اولویت درخواست"
                    value={priority}
                    options={priorityOptions}
                    onChange={setPriority}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 mr-1">توضیحات کامل مشکل</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    placeholder="جزئیات مشکل، خطاها و مراحلی که طی کردید را اینجا بنویسید..."
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-right resize-none font-medium leading-relaxed"
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                <button
                  type="button"
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95 border border-transparent"
                >
                  <Paperclip className="w-5 h-5" />
                  <span>پیوست فایل (تصویر یا لاگ)</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:flex-1 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>ارسال نهایی تیکت پشتیبانی</span>
                      <Send className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
