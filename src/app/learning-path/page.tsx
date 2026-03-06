"use client";

import Link from "next/link";

export default function LearningPathsOverview() {
  return (
    <div className="bg-background-base text-text-main overflow-x-hidden min-h-screen flex flex-col selection:bg-primary selection:text-white">
      <header className="relative pt-20 pb-32 px-6 min-h-[calc(100vh-100px)] flex flex-col justify-center items-center text-center overflow-hidden z-10">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/80 dark:bg-surface-dark/80 border border-white dark:border-gray-700 shadow-sm backdrop-blur-md animate-float">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-primary-dark dark:text-emerald-400 tracking-wide">Roadmaps</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.2] text-text-main drop-shadow-sm">
            مسیرهای <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">یادگیری</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-2xl leading-relaxed font-light mt-4">
            نقشه راهی برای تبدیل شدن به یک متخصص. ما مسیر را برای شما روشن کرده‌ایم تا بدون سردرگمی، قدم به قدم پیش بروید.
          </p>
        </div>

        {/* نشانگر اسکرول - انیمیشن نرم بالا پایین */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
          <span className="text-sm font-medium text-text-muted">اسکرول کنید به پایین</span>
          <span className="material-symbols-outlined text-3xl text-primary animate-bounce-smooth">keyboard_double_arrow_down</span>
        </div>
      </header>

      <main className="relative pb-32 px-4 z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-10">
          <div className="group relative bg-gray-50 dark:bg-[#1c1e26] hover:bg-gray-100 dark:hover:bg-[#24262e] backdrop-blur-xl p-8 md:p-12 rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark hover:shadow-learning-card-light dark:hover:shadow-learning-card-dark transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full items-start">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 mb-8 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-4xl text-white">devices</span>
              </div>
              <h2 className="text-3xl font-extrabold text-text-main mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">توسعه فرانت‌اند</h2>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                طراحی و پیاده‌سازی رابط کاربری وب‌سایت‌ها. یادگیری تکنولوژی‌های بصری و تعاملی وب.
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-800">HTML</span>
                <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-800">CSS</span>
                <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-800">JavaScript</span>
                <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-800">React</span>
                <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-800">Next.js</span>
              </div>
              <div className="mt-auto w-full pt-6 border-t border-emerald-100/50 dark:border-emerald-800/30">
                <Link 
                  href="/learning-path/frontend"
                  className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 hover:shadow-emerald-300 hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 group-hover:gap-4"
                >
                  مشاهده مسیر فرانت‌اند
                  <span className="material-symbols-outlined text-xl rtl:rotate-180">arrow_right_alt</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="group relative bg-gray-50 dark:bg-[#1c1e26] hover:bg-gray-100 dark:hover:bg-[#24262e] backdrop-blur-xl p-8 md:p-12 rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark hover:shadow-learning-card-light dark:hover:shadow-learning-card-dark transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/50 dark:bg-slate-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full items-start">
              <div className="w-20 h-20 rounded-[2rem] bg-sage dark:bg-sage text-white flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-slate-900/30 mb-8 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-4xl">dns</span>
              </div>
              <h2 className="text-3xl font-extrabold text-text-main mb-4 group-hover:text-sage dark:group-hover:text-emerald-300 transition-colors">توسعه بک‌اند</h2>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                منطق سمت سرور، پایگاه‌های داده و APIها. ستون فقرات برنامه‌های کاربردی وب.
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                <span className="px-4 py-2 bg-sage-light text-sage dark:text-emerald-200 rounded-xl text-sm font-bold">Node.js</span>
                <span className="px-4 py-2 bg-sage-light text-sage dark:text-emerald-200 rounded-xl text-sm font-bold">Express</span>
                <span className="px-4 py-2 bg-sage-light text-sage dark:text-emerald-200 rounded-xl text-sm font-bold">Databases</span>
                <span className="px-4 py-2 bg-sage-light text-sage dark:text-emerald-200 rounded-xl text-sm font-bold">API</span>
                <span className="px-4 py-2 bg-sage-light text-sage dark:text-emerald-200 rounded-xl text-sm font-bold">Security</span>
              </div>
              <div className="mt-auto w-full pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link 
                  href="/learning-path/backend"
                  className="w-full py-4 rounded-2xl bg-text-main dark:bg-surface-dark text-white font-bold text-lg shadow-lg hover:shadow-xl hover:bg-black dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group-hover:gap-4 border-0"
                >
                  مشاهده مسیر بک‌اند
                  <span className="material-symbols-outlined text-xl rtl:rotate-180">arrow_right_alt</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-24 relative">
          <div className="bg-gray-50 dark:bg-[#1c1e26] p-8 md:p-16 rounded-4xl border border-gray-200/80 dark:border-white/[0.06] shadow-learning-card-light dark:shadow-learning-card-dark backdrop-blur-md relative overflow-hidden">
            <div className="absolute -left-20 top-0 w-96 h-96 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl"></div>
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs mb-6 border border-emerald-100 dark:border-emerald-800/30">
                  <span className="material-symbols-outlined text-base">help</span>
                  <span>راهنما</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-text-main mb-6 leading-tight">نقشه راه یادگیری چیست؟</h2>
                <p className="text-lg text-text-muted leading-relaxed mb-8">
                  در دنیای وسیع برنامه‌نویسی، گم شدن آسان است. نقشه راه (Roadmap) یک راهنمای بصری و گام‌به‌گام است که به شما نشان می‌دهد:
                </p>
                <ul className="flex flex-col gap-4">
                  <li className="flex items-center gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-2xl">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <span className="material-symbols-outlined">check</span>
                    </span>
                    <span className="font-medium text-text-main">چه مهارت‌هایی را باید یاد بگیرید</span>
                  </li>
                  <li className="flex items-center gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-2xl">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <span className="material-symbols-outlined">low_priority</span>
                    </span>
                    <span className="font-medium text-text-main">بهترین ترتیب برای یادگیری چیست</span>
                  </li>
                  <li className="flex items-center gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-2xl">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <span className="material-symbols-outlined">workspace_premium</span>
                    </span>
                    <span className="font-medium text-text-main">چطور به یک متخصص تبدیل شوید</span>
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-1/2 relative flex justify-center">
                <div className="relative w-full max-w-md flex flex-col gap-4">
                  <Link
                    href="/learning-path/frontend"
                    className="flex items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl text-white">devices</span>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-bold text-lg text-text-main">مسیر فرانت‌اند</p>
                      <p className="text-sm text-text-muted">HTML، CSS، React، Next.js</p>
                    </div>
                    <span className="material-symbols-outlined text-emerald-500 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                  <Link
                    href="/learning-path/backend"
                    className="flex items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700/50 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-sage dark:bg-sage flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl text-white">dns</span>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-bold text-lg text-text-main">مسیر بک‌اند</p>
                      <p className="text-sm text-text-muted">Node.js، Express، Database</p>
                    </div>
                    <span className="material-symbols-outlined text-sage dark:text-emerald-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
