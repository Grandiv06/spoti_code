"use client";

import Link from "next/link";

export default function FrontendRoadmap() {
  return (
    <div className="bg-background-base text-text-main overflow-x-hidden min-h-screen flex flex-col selection:bg-primary selection:text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-[80px] animate-drift"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-green-100/50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full blur-[100px] animate-drift" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-white dark:bg-emerald-900/10 rounded-full blur-[60px] opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <header className="relative pt-20 pb-40 px-6 min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center overflow-hidden z-10">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/80 dark:bg-surface-dark/80 border border-white dark:border-gray-700 shadow-sm backdrop-blur-md animate-float">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-primary-dark dark:text-emerald-400 tracking-widest uppercase">Roadmap 2024</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tight leading-[1.1] text-text-main drop-shadow-sm">
            مسیر <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">حرفه‌ای</span> شدن <br/>
            <span className="font-display font-light text-text-muted">در توسعه فرانت‌اند</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-3xl leading-relaxed font-light mt-4">
            یک تجربه یادگیری <span className="bg-primary-soft text-primary-dark dark:text-emerald-300 px-2 rounded-lg font-medium">مدرن</span> و <span className="bg-primary-soft text-primary-dark dark:text-emerald-300 px-2 rounded-lg font-medium">تعاملی</span>. 
            با طراحی زیبا و محتوای عمیق، آینده شغلی خود را بسازید.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-10">
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-emerald-300 dark:hover:shadow-emerald-900/50 hover:scale-105 transition-all flex items-center justify-center gap-3">
              <span>شروع یادگیری</span>
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <button className="bg-gray-50 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 text-text-main border border-gray-200/80 dark:border-white/[0.06] px-10 py-5 rounded-2xl font-medium text-xl shadow-learning-card-light dark:shadow-learning-card-dark backdrop-blur-md transition-all">
              مشاهده سرفصل‌ها
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60 animate-bounce">
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-sm">اسکرول کنید</span>
          <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">keyboard_double_arrow_down</span>
        </div>
      </header>

      <main className="relative py-32 px-4 perspective-container overflow-hidden z-10">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 rounded-full bg-gradient-to-b from-transparent via-emerald-100 dark:via-emerald-900/30 to-transparent opacity-80 backdrop-blur-sm z-0"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 mb-40 group roadmap-connector">
            <div className="w-full md:w-5/12 order-2 md:order-1 text-center md:text-left rtl:md:text-right" dir="rtl">
              <div className="roadmap-card bg-gray-50 dark:bg-[#1c1e26] hover:bg-gray-100 dark:hover:bg-[#24262e] p-10 rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">آشنایی با HTML</h3>
                  <p className="text-text-muted text-lg leading-relaxed">اسکلت‌بندی وب. یادگیری تگ‌های معنایی، دسترسی‌پذیری و اصول اولیه سئو برای ساخت ساختاری مستحکم.</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-5 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/30 text-sm text-orange-600 dark:text-orange-300 font-bold shadow-sm">Semantics</span>
                    <span className="px-5 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/30 text-sm text-orange-600 dark:text-orange-300 font-bold shadow-sm">Forms</span>
                    <span className="px-5 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/30 text-sm text-orange-600 dark:text-orange-300 font-bold shadow-sm">SEO</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-orange-500 drop-shadow-md relative z-10 transform translate-z-10">html</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-3 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute right-10 animate-float px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-emerald-800 dark:text-emerald-200 font-mono text-sm transform rotate-3">
                  {'<!DOCTYPE html>'}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 mb-40 group">
            <div className="w-full md:w-5/12 order-3 md:order-1 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute left-10 animate-float-delayed px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-blue-600 dark:text-blue-300 font-mono text-sm transform -rotate-3">
                  display: flex;
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-blue-500 drop-shadow-md relative z-10">style</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-2 md:order-3 text-center md:text-right" dir="rtl">
              <div className="roadmap-card bg-gray-50 dark:bg-[#1c1e26] hover:bg-gray-100 dark:hover:bg-[#24262e] p-10 rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">استایل‌دهی با CSS</h3>
                  <p className="text-text-muted text-lg leading-relaxed">جادوی بصری وب. از چیدمان‌های Flexbox و Grid گرفته تا انیمیشن‌های پیشرفته و طراحی واکنش‌گرا.</p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <span className="px-5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 text-sm text-blue-600 dark:text-blue-300 font-bold shadow-sm">Flexbox</span>
                    <span className="px-5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 text-sm text-blue-600 dark:text-blue-300 font-bold shadow-sm">Grid</span>
                    <span className="px-5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 text-sm text-blue-600 dark:text-blue-300 font-bold shadow-sm">Responsive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 mb-40 group">
            <div className="w-full md:w-5/12 order-2 md:order-1 text-center md:text-left rtl:md:text-right" dir="rtl">
              <div className="roadmap-card bg-gray-50 dark:bg-[#1c1e26] hover:bg-gray-100 dark:hover:bg-[#24262e] p-10 rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-yellow-100 dark:bg-yellow-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">جادوی جاوااسکریپت</h3>
                  <p className="text-text-muted text-lg leading-relaxed">قلب تپنده تعاملات. یادگیری ES6+، کار با DOM، فراخوانی API و مدیریت داده‌ها به صورت ناهمگام.</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-5 py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800/30 text-sm text-yellow-700 dark:text-yellow-300 font-bold shadow-sm">ES6+</span>
                    <span className="px-5 py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800/30 text-sm text-yellow-700 dark:text-yellow-300 font-bold shadow-sm">DOM</span>
                    <span className="px-5 py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800/30 text-sm text-yellow-700 dark:text-yellow-300 font-bold shadow-sm">Fetch API</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-yellow-500 drop-shadow-md relative z-10">javascript</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-3 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute right-20 animate-float px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-yellow-700 dark:text-yellow-300 font-mono text-sm transform rotate-6">
                  {'console.log("Hello")'}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 mb-40 group">
            <div className="w-full md:w-5/12 order-3 md:order-1 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute left-16 animate-float-delayed px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-sky-600 dark:text-sky-300 font-mono text-sm transform -rotate-2">
                  useState()
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-sky-500 drop-shadow-md relative z-10">data_object</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-2 md:order-3 text-center md:text-right" dir="rtl">
              <div className="roadmap-card bg-gray-50 dark:bg-[#1c1e26] hover:bg-gray-100 dark:hover:bg-[#24262e] p-10 rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-sky-100 dark:bg-sky-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">فریمورک React</h3>
                  <p className="text-text-muted text-lg leading-relaxed">تفکر کامپوننتی. ساخت رابط‌های کاربری پیچیده با استفاده از هوک‌ها، مدیریت وضعیت و اکوسیستم قدرتمند ریاکت.</p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <span className="px-5 py-2 rounded-xl bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800/30 text-sm text-sky-600 dark:text-sky-300 font-bold shadow-sm">Components</span>
                    <span className="px-5 py-2 rounded-xl bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800/30 text-sm text-sky-600 dark:text-sky-300 font-bold shadow-sm">Hooks</span>
                    <span className="px-5 py-2 rounded-xl bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800/30 text-sm text-sky-600 dark:text-sky-300 font-bold shadow-sm">Redux</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 group">
            <div className="w-full md:w-5/12 order-2 md:order-1 text-center md:text-left rtl:md:text-right" dir="rtl">
              <div className="roadmap-card bg-gray-50 dark:bg-[#1c1e26] hover:bg-gray-100 dark:hover:bg-[#24262e] p-10 rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-gray-200 dark:bg-gray-800/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">Next.js پیشرفته</h3>
                  <p className="text-text-muted text-lg leading-relaxed">قدرت فول‌استک. رندرینگ سمت سرور (SSR)، تولید سایت استاتیک (SSG) و بهینه‌سازی عملکرد وب‌سایت.</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/30 text-sm text-gray-800 dark:text-gray-200 font-bold shadow-sm">SSR</span>
                    <span className="px-5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/30 text-sm text-gray-800 dark:text-gray-200 font-bold shadow-sm">App Router</span>
                    <span className="px-5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/30 text-sm text-gray-800 dark:text-gray-200 font-bold shadow-sm">API Routes</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-gray-800 dark:text-white drop-shadow-md relative z-10">rocket_launch</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-3 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute right-12 animate-float px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-gray-600 dark:text-gray-200 font-mono text-sm transform rotate-1">
                  npm run build
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="py-24 px-6 relative border-t border-emerald-100 dark:border-emerald-800/30 z-10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 text-text-main">چرا این مسیر؟</h2>
            <p className="text-text-muted text-lg">آمار و ارقامی که نشان‌دهنده کیفیت این دوره آموزشی است</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-8 rounded-[2rem] shadow-learning-card-light dark:shadow-learning-card-dark hover:shadow-learning-card-light dark:hover:shadow-learning-card-dark transition-all flex flex-col items-center gap-3 group">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-4xl">groups</span>
              </div>
              <span className="text-5xl font-black text-text-main">2.5k+</span>
              <span className="text-base text-text-muted font-medium">دانشجوی فعال</span>
            </div>
            <div className="bg-gray-50 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-8 rounded-[2rem] shadow-learning-card-light dark:shadow-learning-card-dark hover:shadow-learning-card-light dark:hover:shadow-learning-card-dark transition-all flex flex-col items-center gap-3 group">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-4xl">schedule</span>
              </div>
              <span className="text-5xl font-black text-text-main">120h</span>
              <span className="text-base text-text-muted font-medium">محتوای ویدیویی</span>
            </div>
            <div className="bg-gray-50 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-8 rounded-[2rem] shadow-learning-card-light dark:shadow-learning-card-dark hover:shadow-learning-card-light dark:hover:shadow-learning-card-dark transition-all flex flex-col items-center gap-3 group">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-4xl">code_blocks</span>
              </div>
              <span className="text-5xl font-black text-text-main">15+</span>
              <span className="text-base text-text-muted font-medium">پروژه عملی</span>
            </div>
            <div className="bg-gray-50 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-8 rounded-[2rem] shadow-learning-card-light dark:shadow-learning-card-dark hover:shadow-learning-card-light dark:hover:shadow-learning-card-dark transition-all flex flex-col items-center gap-3 group">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-4xl">verified</span>
              </div>
              <span className="text-5xl font-black text-text-main">100%</span>
              <span className="text-base text-text-muted font-medium">تضمین کیفیت</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
