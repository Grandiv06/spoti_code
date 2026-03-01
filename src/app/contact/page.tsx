"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      <div className="mesh-bg" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-[#105230]/40 dark:bg-[#105230]/20 rounded-full blur-[140px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[20%] w-[35vw] h-[35vw] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <main className="flex-1 flex flex-col items-center w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-12 gap-16 sm:gap-24">
        {/* Hero Section */}
        <section className="w-full pt-10 sm:pt-16">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 dark:bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2 animate-float">
              <span className="material-symbols-outlined text-lg">contact_support</span>
              پشتیبانی ۲۴/۷
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em] text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900/50 dark:from-white dark:via-white dark:to-white/50 drop-shadow-sm max-w-4xl">
              ارتباط با ما
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium leading-normal max-w-2xl">
              سوال، پیشنهاد یا درخواست همکاری دارید؟ تیم پشتیبانی اسپاتی‌کد آماده پاسخگویی به شماست.
            </p>
          </div>
        </section>

        <div className="w-full grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-panel rounded-4xl p-8 flex flex-col gap-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors border-t-4 border-t-primary/50">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-3xl">location_on</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">آدرس</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                تهران، خیابان آزادی، کارخانه نوآوری، ساختمان آکادمی کد
              </p>
            </div>
            <div className="glass-panel rounded-4xl p-8 flex flex-col gap-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors border-t-4 border-t-primary/50">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-3xl">call</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">تلفن</h3>
              <a
                href="tel:02191001000"
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-bold text-lg dir-ltr text-right"
              >
                ۰۲۱-۹۱۰۰۱۰۰۰
              </a>
            </div>
            <div className="glass-panel rounded-4xl p-8 flex flex-col gap-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors border-t-4 border-t-primary/50">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">ایمیل</h3>
              <a
                href="mailto:support@spoticode.ir"
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                support@spoticode.ir
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-4xl p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900/30 to-white dark:to-gray-800 flex items-center justify-center text-primary shadow-sm border border-white/50 dark:border-gray-700">
                    <span className="material-symbols-outlined filled text-2xl">edit_note</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                    فرم تماس
                  </h2>
                </div>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
                    <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-primary filled">
                        check_circle
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                      پیام شما با موفقیت ارسال شد
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      تیم پشتیبانی در اسرع وقت به پیام شما پاسخ خواهد داد.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-primary font-bold hover:text-primary-hover transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      ارسال پیام جدید
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-bold text-gray-700 dark:text-gray-300"
                        >
                          نام و نام خانوادگی
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="علی محمدی"
                          className="w-full px-5 py-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-bold text-gray-700 dark:text-gray-300"
                        >
                          ایمیل
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                          className="w-full px-5 py-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-bold text-gray-700 dark:text-gray-300"
                      >
                        موضوع
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 dark:text-white"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="course">سوال درباره دوره‌ها</option>
                        <option value="support">پشتیبانی فنی</option>
                        <option value="partnership">همکاری و مشارکت</option>
                        <option value="other">سایر</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-bold text-gray-700 dark:text-gray-300"
                      >
                        پیام شما
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="پیام خود را اینجا بنویسید..."
                        rows={5}
                        className="w-full px-5 py-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-primary hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed text-white px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-primary/30 hover:shadow-primary/40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">
                            progress_activity
                          </span>
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          ارسال پیام
                          <span className="material-symbols-outlined">send</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <section className="w-full">
          <div className="glass-panel rounded-4xl p-8 md:p-12">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 text-center">
              لینک‌های مفید
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/courses"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-primary hover:text-white transition-all font-bold"
              >
                <span className="material-symbols-outlined">school</span>
                دوره‌ها
              </Link>
              <Link
                href="/learning-path"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-primary hover:text-white transition-all font-bold"
              >
                <span className="material-symbols-outlined">route</span>
                مسیر یادگیری
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-primary hover:text-white transition-all font-bold"
              >
                <span className="material-symbols-outlined">info</span>
                درباره ما
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
