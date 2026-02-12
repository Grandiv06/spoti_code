"use client";

import Link from "next/link";

export default function BackendRoadmap() {
  return (
    <div className="bg-background-base text-text-main overflow-x-hidden min-h-screen flex flex-col selection:bg-primary selection:text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-[80px] animate-drift"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-green-100/50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full blur-[100px] animate-drift" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-white dark:bg-emerald-900/10 rounded-full blur-[60px] opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
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
            <span className="font-display font-light text-text-muted">در توسعه بک‌اند</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-3xl leading-relaxed font-light mt-4">
            تخصص در مهندسی سمت سرور با رویکردی <span className="bg-primary-soft text-primary-dark dark:text-emerald-300 px-2 rounded-lg font-medium">مدرن</span> و <span className="bg-primary-soft text-primary-dark dark:text-emerald-300 px-2 rounded-lg font-medium">پروژه‌محور</span>. 
            معماری سیستم‌های مقیاس‌پذیر را بیاموزید.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-10">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-emerald-300 dark:hover:shadow-emerald-900/50 hover:scale-105 transition-all flex items-center justify-center gap-3">
              <span>شروع یادگیری</span>
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <button className="bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-text-main border border-white dark:border-white/10 px-10 py-5 rounded-2xl font-medium text-xl shadow-glass hover:shadow-glass-hover backdrop-blur-md transition-all">
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
              <div className="roadmap-card bg-glass-surface hover:bg-glass-surface-hover border border-glass-border p-10 rounded-4xl backdrop-blur-2xl shadow-glass relative overflow-hidden group-hover:border-emerald-300 dark:group-hover:border-emerald-700">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">جاوااسکریپت پیشرفته</h3>
                  <p className="text-text-muted text-lg leading-relaxed">زبان مادر. درک عمیق Asynchronous Programming، Event Loop و مفاهیم پایه‌ای برای توسعه سمت سرور.</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-700 dark:text-emerald-300 font-bold shadow-sm">ES6+</span>
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-700 dark:text-emerald-300 font-bold shadow-sm">Async/Await</span>
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-700 dark:text-emerald-300 font-bold shadow-sm">V8 Engine</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-emerald-500 drop-shadow-md relative z-10 transform translate-z-10">javascript</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-3 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute right-10 animate-float px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-emerald-800 dark:text-emerald-200 font-mono text-sm transform rotate-3">
                  {'Promise.all([db, api])'}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 mb-40 group">
            <div className="w-full md:w-5/12 order-3 md:order-1 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute left-10 animate-float-delayed px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-teal-600 dark:text-teal-300 font-mono text-sm transform -rotate-3">
                  {"fs.readFile('data.json')"}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-teal-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-teal-500 drop-shadow-md relative z-10">deployed_code</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-2 md:order-3 text-center md:text-right" dir="rtl">
              <div className="roadmap-card bg-glass-surface hover:bg-glass-surface-hover border border-glass-border p-10 rounded-4xl backdrop-blur-2xl shadow-glass relative overflow-hidden group-hover:border-teal-300 dark:group-hover:border-teal-700">
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">هسته Node.js</h3>
                  <p className="text-text-muted text-lg leading-relaxed">موتور اجرایی قدرتمند. کار با ماژول‌ها، سیستم فایل، بافرها و استریم‌ها در محیط نود.</p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <span className="px-5 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/30 text-sm text-teal-600 dark:text-teal-300 font-bold shadow-sm">Modules</span>
                    <span className="px-5 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/30 text-sm text-teal-600 dark:text-teal-300 font-bold shadow-sm">File System</span>
                    <span className="px-5 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/30 text-sm text-teal-600 dark:text-teal-300 font-bold shadow-sm">Streams</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 mb-40 group">
            <div className="w-full md:w-5/12 order-2 md:order-1 text-center md:text-left rtl:md:text-right" dir="rtl">
              <div className="roadmap-card bg-glass-surface hover:bg-glass-surface-hover border border-glass-border p-10 rounded-4xl backdrop-blur-2xl shadow-glass relative overflow-hidden group-hover:border-emerald-300 dark:group-hover:border-emerald-700">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">پایگاه‌های داده</h3>
                  <p className="text-text-muted text-lg leading-relaxed">قلب تپنده داده‌ها. تسلط بر دیتابیس‌های رابطه‌ای (SQL) و غیررابطه‌ای (NoSQL) و طراحی اسکیما.</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-5 py-2 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/30 text-sm text-green-700 dark:text-green-300 font-bold shadow-sm">PostgreSQL</span>
                    <span className="px-5 py-2 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/30 text-sm text-green-700 dark:text-green-300 font-bold shadow-sm">MongoDB</span>
                    <span className="px-5 py-2 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/30 text-sm text-green-700 dark:text-green-300 font-bold shadow-sm">Redis</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-green-600 drop-shadow-md relative z-10">database</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-3 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute right-20 animate-float px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-green-800 dark:text-green-200 font-mono text-sm transform rotate-6">
                  {'SELECT * FROM users;'}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 mb-40 group">
            <div className="w-full md:w-5/12 order-3 md:order-1 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute left-16 animate-float-delayed px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-emerald-700 dark:text-emerald-200 font-mono text-sm transform -rotate-2">
                  {"app.get('/api', ...)"}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-emerald-600 drop-shadow-md relative z-10">api</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-2 md:order-3 text-center md:text-right" dir="rtl">
              <div className="roadmap-card bg-glass-surface hover:bg-glass-surface-hover border border-glass-border p-10 rounded-4xl backdrop-blur-2xl shadow-glass relative overflow-hidden group-hover:border-emerald-300 dark:group-hover:border-emerald-700">
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">فریمورک Express.js</h3>
                  <p className="text-text-muted text-lg leading-relaxed">ساخت RESTful API. مدیریت روت‌ها، Middlewareها، احراز هویت (Auth) و مدیریت خطاها.</p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-600 dark:text-emerald-300 font-bold shadow-sm">REST API</span>
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-600 dark:text-emerald-300 font-bold shadow-sm">Middleware</span>
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-600 dark:text-emerald-300 font-bold shadow-sm">JWT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 mb-40 group">
            <div className="w-full md:w-5/12 order-2 md:order-1 text-center md:text-left rtl:md:text-right" dir="rtl">
              <div className="roadmap-card bg-glass-surface hover:bg-glass-surface-hover border border-glass-border p-10 rounded-4xl backdrop-blur-2xl shadow-glass relative overflow-hidden group-hover:border-teal-300 dark:group-hover:border-teal-700">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">ارتباطات درنگ (Real-time)</h3>
                  <p className="text-text-muted text-lg leading-relaxed">تعامل زنده. پیاده‌سازی چت، نوتیفیکیشن و آپدیت‌های آنی با استفاده از WebSockets.</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-5 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/30 text-sm text-teal-700 dark:text-teal-300 font-bold shadow-sm">Socket.io</span>
                    <span className="px-5 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/30 text-sm text-teal-700 dark:text-teal-300 font-bold shadow-sm">WebSockets</span>
                    <span className="px-5 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/30 text-sm text-teal-700 dark:text-teal-300 font-bold shadow-sm">Events</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-teal-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-teal-500 drop-shadow-md relative z-10">swap_calls</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-3 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute right-12 animate-float px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-teal-800 dark:text-teal-200 font-mono text-sm transform rotate-1">
                  {"io.emit('message', msg)"}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 group">
            <div className="w-full md:w-5/12 order-3 md:order-1 hidden md:block">
              <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                <div className="absolute left-12 animate-float-delayed px-8 py-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-md border border-white dark:border-white/10 shadow-lg text-emerald-800 dark:text-emerald-200 font-mono text-sm transform -rotate-1">
                  {"expect(res).toBe(200)"}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-white/50 dark:border-white/10 shadow-2xl flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-[2.5rem] backdrop-blur-[2px]"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-emerald-600 drop-shadow-md relative z-10">bug_report</span>
              </div>
            </div>
            <div className="w-full md:w-5/12 order-2 md:order-3 text-center md:text-right" dir="rtl">
              <div className="roadmap-card bg-glass-surface hover:bg-glass-surface-hover border border-glass-border p-10 rounded-4xl backdrop-blur-2xl shadow-glass relative overflow-hidden group-hover:border-emerald-300 dark:group-hover:border-emerald-700">
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-5">
                  <h3 className="text-4xl font-extrabold text-text-main">تست و استقرار</h3>
                  <p className="text-text-muted text-lg leading-relaxed">تضمین کیفیت. نوشتن تست‌های Unit و Integration و دیپلوی امن روی سرورهای ابری.</p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-700 dark:text-emerald-300 font-bold shadow-sm">Jest</span>
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-700 dark:text-emerald-300 font-bold shadow-sm">Docker</span>
                    <span className="px-5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 text-sm text-emerald-700 dark:text-emerald-300 font-bold shadow-sm">CI/CD</span>
                  </div>
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
            <p className="text-text-muted text-lg">آمار و ارقامی که نشان‌دهنده کیفیت این دوره آموزشی بک‌اند است</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white dark:border-white/10 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex flex-col items-center gap-3 group">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-4xl">groups</span>
              </div>
              <span className="text-5xl font-black text-text-main">3.2k+</span>
              <span className="text-base text-text-muted font-medium">دانشجوی فعال</span>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white dark:border-white/10 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex flex-col items-center gap-3 group">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-4xl">schedule</span>
              </div>
              <span className="text-5xl font-black text-text-main">140h</span>
              <span className="text-base text-text-muted font-medium">محتوای ویدیویی</span>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white dark:border-white/10 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex flex-col items-center gap-3 group">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-4xl">dns</span>
              </div>
              <span className="text-5xl font-black text-text-main">20+</span>
              <span className="text-base text-text-muted font-medium">پروژه عملی</span>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white dark:border-white/10 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex flex-col items-center gap-3 group">
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
