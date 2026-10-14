"use client";

import Link from "next/link";

const FRONTEND_STEPS = [
  {
    stepNumber: "۰۱",
    stepLabel: "گام اول",
    level: "مقدماتی",
    title: "آشنایی با HTML و وب معنایی",
    subtitle: "اسکلت‌بندی و استانداردهای مدرن دسترسی‌پذیری",
    description: "یادگیری ساختار بنیادین وب. تسلط بر تگ‌های معنایی (Semantic HTML)، فرم‌ها و اعتبارسنجی ورودی‌ها، اصول دسترس‌پذیری (ARIA) و رعایت پایه‌های سئو تکنیکال برای ساخت صفحات بهینه‌شده.",
    concepts: [
      "تگ‌های معنایی (header, nav, article, section, footer)",
      "ساختار پیشرفته فرم‌ها و اعتبارسنجی استاندارد",
      "اصول دسترسی‌پذیری وب (Accessibility & WAI-ARIA)",
      "متا تگ‌های سئو، OpenGraph و اشتراک‌گذاری اجتماعی",
    ],
    skills: ["HTML5", "Semantics", "Accessibility", "Forms", "SEO"],
    project: {
      name: "طراحی لندینگ‌پیج استاندارد و معنایی",
      description: "پیاده‌سازی یک صفحه فرود کامل با سمانتیک بی‌نقص، بدون ارورهای W3C و نمره ۱۰۰ دسترس‌پذیری.",
    },
    codeSnippet: `<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <title>اسپاتی‌کد | فرانت‌اند</title>
  </head>
  <body>
    <main role="main">...</main>
  </body>
</html>`,
    accent: {
      gradient: "from-orange-500 to-amber-500",
      glow: "bg-orange-500/10",
      badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      node: "border-orange-500 text-orange-500 shadow-orange-500/20",
      iconBg: "bg-gradient-to-br from-orange-400 to-amber-500",
    },
    icon: "html",
  },
  {
    stepNumber: "۰۲",
    stepLabel: "گام دوم",
    level: "مقدماتی تا متوسط",
    title: "استایل‌دهی مدرن با CSS و Tailwind",
    subtitle: "جادوی بصری، چیدمان‌های مدرن و طراحی واکنش‌گرا",
    description: "تسلط کامل بر معماری استایل‌دهی مدرن. از چیدمان‌های Flexbox و CSS Grid گرفته تا متغیرهای CSS، مدیاکوئری‌های ریسپانسیو، ترنزیشن‌ها و فریمورک محبوب Tailwind CSS برای سرعت‌بخشی به طراحی رابط کاربری.",
    concepts: [
      "سیستم‌های چیدمان دوبعدی و یک‌بعدی (Grid & Flexbox)",
      "طراحی واکنش‌گرا (Responsive) برای تمامی ابعاد نمایشگر",
      "انیمیشن‌ها، ترنزیشن‌ها و جلوه‌های مدرن Glassmorphism",
      "سیستم طراحی و یوتیلیتی‌های Tailwind CSS با تم Dark Mode",
    ],
    skills: ["CSS3", "Flexbox", "CSS Grid", "Tailwind CSS", "Animations"],
    project: {
      name: "قالب ریسپانسیو با تم روز و شب",
      description: "ساخت رابط کاربری مدرن با کارت‌های شیشه‌ای، هدر هوشمند و انیمیشن‌های نرم کلاینت.",
    },
    codeSnippet: `.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  align-items: center;
}`,
    accent: {
      gradient: "from-sky-500 to-blue-600",
      glow: "bg-sky-500/10",
      badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      node: "border-sky-500 text-sky-500 shadow-sky-500/20",
      iconBg: "bg-gradient-to-br from-sky-400 to-blue-600",
    },
    icon: "palette",
  },
  {
    stepNumber: "۰۳",
    stepLabel: "گام سوم",
    level: "متوسط",
    title: "جادوی جاوااسکریپت مدرن (ES6+)",
    subtitle: "موتور محرک تعاملات، لاجیک و مفاهیم ناهمگام",
    description: "قلب تپنده وب مدرن. یادگیری عمیق ساختار داده‌ها، توابع، دستکاری ساختار DOM، فراخوانی APIها با Fetch و Axios، پرامیس‌ها و Async/Await، رویدادها و ابزارهای خطایابی مرورگر.",
    concepts: [
      "مفاهیم مدرن ES6+ (Destructuring, Spread, Modules)",
      "تعامل مستقیم با درخت DOM و مدیریت رویدادها (Events)",
      "برنامه‌نویسی ناهمگام (Promises, Async / Await, Fetch API)",
      "کار با حافظه مرورگر (LocalStorage, Session, Cookies)",
    ],
    skills: ["JavaScript", "ES6+", "Async/Await", "DOM", "Fetch API"],
    project: {
      name: "اپلیکیشن مدیریت تسک با اتصال به API",
      description: "برنامه تک‌صفحه‌ای تعاملی با ذخیره‌سازی داده، فیلترهای لحظه‌ای و مدیریت خطای شبکه.",
    },
    codeSnippet: `async function fetchCourses() {
  const res = await fetch('/api/courses');
  if (!res.ok) throw new Error('خطا در ارتباط');
  return await res.json();
}`,
    accent: {
      gradient: "from-amber-400 to-yellow-500",
      glow: "bg-amber-500/10",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      node: "border-amber-500 text-amber-500 shadow-amber-500/20",
      iconBg: "bg-gradient-to-br from-amber-400 to-yellow-500",
    },
    icon: "code",
  },
  {
    stepNumber: "۰۴",
    stepLabel: "گام چهارم",
    level: "پیشرفته",
    title: "کتابخانه قدرتمند React.js",
    subtitle: "تفکر کامپوننتی، هوک‌های اختصاصی و مدیریت وضعیت",
    description: "انقلاب توسعه رابط کاربری. تفکر در قالب کامپوننت‌های مستقل، چرخه حیات، هوک‌های پایه و پیشرفته (useState, useEffect, useMemo, useCallback)، مدیریت وضعیت با Zustand و فرم‌های تعاملی.",
    concepts: [
      "معماری کامپوننت‌ها، Props و ترکیب‌پذیری (Composition)",
      "هوک‌های استاندارد و طراحی Custom Hooks سفارشی",
      "مدیریت وضعیت سراسری با ابزارهای مدرن (Zustand)",
      "مدیریت درخواست‌ها و کش سرور با TanStack Query",
    ],
    skills: ["React 19", "Hooks", "Zustand", "React Query", "Tailwind"],
    project: {
      name: "فروشگاه آنلاین کامل با سبد خرید زنده",
      description: "پیاده‌سازی فروشگاه SPA کامل با فیلتر دسته‌بندی، سبد خرید زنده و تسویه‌حساب مرحله‌ای.",
    },
    codeSnippet: `const { cart, addItem } = useCartStore();
const total = useMemo(() => {
  return cart.reduce((sum, item) => sum + item.price, 0);
}, [cart]);`,
    accent: {
      gradient: "from-cyan-500 to-sky-600",
      glow: "bg-cyan-500/10",
      badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      node: "border-cyan-500 text-cyan-500 shadow-cyan-500/20",
      iconBg: "bg-gradient-to-br from-cyan-400 to-sky-600",
    },
    icon: "hub",
  },
  {
    stepNumber: "۰۵",
    stepLabel: "گام پنجم",
    level: "تخصصی / شغلی",
    title: "توسعه فول‌استک با Next.js",
    subtitle: "App Router، رندرینگ سمت سرور (SSR) و سئو فوق‌العاده",
    description: "قله مهارت فرانت‌اند. استفاده از معماری نوین Next.js با React Server Components، رندرینگ سمت سرور (SSR)، تولید سایت استاتیک (SSG)، اکشن‌های سرور (Server Actions)، بهینه‌سازی تصاویر و فونت‌ها و دیپلوی پایدار.",
    concepts: [
      "معماری Next.js App Router و Server Components",
      "رندرینگ ترکیبی (SSR, SSG, ISR) برای بالاترین سرعت",
      "تعریف Route Handlers و Server Actions بدون نیاز به سرور مجزا",
      "بهینه‌سازی تصاویر، سئو متادیتا و دیپلوی استاندارد",
    ],
    skills: ["Next.js", "App Router", "SSR / SSG", "Server Actions", "SEO"],
    project: {
      name: "پلتفرم آموزشی جامع با داشبورد کاربر",
      description: "توسعه یک پلتفرم کامل با احراز هویت، درگاه پرداخت، پلیر ویدیو و سئو عالی.",
    },
    codeSnippet: `export default async function DashboardPage() {
  const profile = await getProfile();
  return <UserDashboard user={profile} />;
}`,
    accent: {
      gradient: "from-emerald-500 to-teal-600",
      glow: "bg-emerald-500/10",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      node: "border-emerald-500 text-emerald-500 shadow-emerald-500/20",
      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600",
    },
    icon: "rocket_launch",
  },
];

export default function FrontendRoadmap() {
  return (
    <div className="bg-background-base text-text-main overflow-x-hidden min-h-screen flex flex-col selection:bg-primary selection:text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-[80px] animate-drift"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-green-100/50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full blur-[100px] animate-drift" style={{ animationDelay: "-5s" }}></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-white dark:bg-emerald-900/10 rounded-full blur-[60px] opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      </div>

      {/* Hero Header */}
      <header className="relative pt-24 pb-32 px-6 min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center overflow-hidden z-10">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.15] text-text-main drop-shadow-sm">
            مسیر <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">حرفه‌ای</span> شدن <br />
            <span className="font-display font-light text-text-muted">در توسعه فرانت‌اند</span>
          </h1>
          <p className="text-lg md:text-2xl text-text-muted max-w-3xl leading-relaxed font-light">
            یک نقشه یادگیری گام‌به‌گام و <span className="text-primary font-bold">پروژه‌محور</span> برای ورود به بازار کار.
            از پایه‌های وب تا معماری پیشرفته در قالب ۵ گام تخصصی.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <a
              href="#roadmap-chart"
              className="bg-primary hover:bg-emerald-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>مشاهده مراحل نقشه راه</span>
              <span className="material-symbols-outlined text-xl rotate-180">arrow_forward</span>
            </a>
            <Link
              href="/learning-path"
              className="bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-text-main border border-gray-200/80 dark:border-white/[0.08] px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg backdrop-blur-md transition-all cursor-pointer"
            >
              همه مسیرهای یادگیری
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a href="#roadmap-chart" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors cursor-pointer">
          <span className="text-xs font-bold">اسکرول کنید</span>
          <span className="material-symbols-outlined text-2xl text-primary animate-bounce-smooth">keyboard_double_arrow_down</span>
        </a>
      </header>

      {/* Main Roadmap Chart */}
      <main id="roadmap-chart" className="relative py-20 px-4 sm:px-6 z-10 max-w-7xl mx-auto w-full scroll-mt-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-4 border border-emerald-200/50 dark:border-emerald-800/40">
            <span className="material-symbols-outlined text-base">route</span>
            <span>نقشه راه مهندسی فرانت‌اند</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-main mb-4 tracking-tight">
            مراحل گام‌به‌گام تا تسلط کامل
          </h2>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            هر مرحله شامل تخصص‌های کلیدی، ابزارها و پروژه عملی مختص همان فاز است
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Glowing Spine on Desktop */}
          <div className="hidden md:block absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-orange-400 via-sky-400 via-amber-400 via-cyan-400 to-emerald-500 rounded-full opacity-40 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />

          {/* Timeline Nodes & Rows */}
          <div className="space-y-16 md:space-y-28">
            {FRONTEND_STEPS.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div key={step.stepNumber} className="relative flex flex-col md:flex-row items-center gap-8 md:gap-0">
                  {/* Step Card (Main) */}
                  <div className={`w-full md:w-[calc(50%-48px)] ${isEven ? "md:order-1" : "md:order-3"}`}>
                    <div className="group relative bg-white/90 dark:bg-[#14161f]/90 hover:bg-white dark:hover:bg-[#191b26] p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-white/[0.08] shadow-lg shadow-black/[0.03] hover:shadow-2xl transition-all duration-300">
                      {/* Subtle Ambient Glow */}
                      <div className={`absolute top-0 right-0 w-48 h-48 ${step.accent.glow} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                      {/* Header Badge Row */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`px-3 py-1 rounded-xl text-xs font-black border ${step.accent.badge}`}>
                          {step.stepLabel}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                          {step.level}
                        </span>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-center gap-3.5 mb-3">
                        <div className={`size-12 rounded-2xl ${step.accent.iconBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                          <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-text-main group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-text-muted font-medium mt-0.5">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-6 font-normal">
                        {step.description}
                      </p>

                      {/* Key Concepts List */}
                      <div className="space-y-2 mb-6 bg-gray-50/70 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-100 dark:border-white/[0.04]">
                        <p className="text-xs font-black text-text-main mb-2 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-primary">task_alt</span>
                          سرفصل‌های کلیدی این مرحله:
                        </p>
                        {step.concepts.map((concept, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 text-xs sm:text-[13px] text-gray-700 dark:text-gray-300 font-medium">
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                            <span>{concept}</span>
                          </div>
                        ))}
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-white/[0.05]">
                        {step.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg bg-gray-100/80 dark:bg-white/[0.04] text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Central Node on Desktop */}
                  <div className="hidden md:flex md:order-2 items-center justify-center shrink-0 w-24 relative z-20">
                    <div className={`size-16 rounded-2xl bg-white dark:bg-[#12141a] border-2 ${step.accent.node} flex flex-col items-center justify-center shadow-xl font-black transition-transform duration-300 group-hover:scale-110`}>
                      <span className="text-lg tracking-tight font-black">{step.stepNumber}</span>
                      <span className="text-[9px] font-bold opacity-60">گام</span>
                    </div>
                  </div>

                  {/* Showcase / Project Card on Opposite Side */}
                  <div className={`w-full md:w-[calc(50%-48px)] ${isEven ? "md:order-3" : "md:order-1"}`}>
                    <div className="bg-gray-50/80 dark:bg-[#11131a]/80 p-6 sm:p-7 rounded-3xl border border-gray-200/70 dark:border-white/[0.06] shadow-sm space-y-4">
                      {/* Project Header */}
                      <div className="flex items-center gap-2.5 text-primary">
                        <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                        </div>
                        <span className="text-xs font-black tracking-wide uppercase">پروژه عملی این فاز</span>
                      </div>

                      <div>
                        <h4 className="text-base sm:text-lg font-black text-text-main mb-1">
                          {step.project.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                          {step.project.description}
                        </p>
                      </div>

                      {/* Terminal Code Preview */}
                      <div className="rounded-2xl bg-[#0a0b10] border border-white/10 p-4 font-mono text-xs overflow-x-auto shadow-inner" dir="ltr">
                        <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-white/10 opacity-70">
                          <span className="size-2.5 rounded-full bg-red-500/80" />
                          <span className="size-2.5 rounded-full bg-yellow-500/80" />
                          <span className="size-2.5 rounded-full bg-green-500/80" />
                          <span className="text-[10px] text-gray-400 font-sans ml-2">preview.code</span>
                        </div>
                        <pre className="text-emerald-400 leading-relaxed text-[11px] sm:text-xs">
                          <code>{step.codeSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Why This Path Section */}
      <section className="py-24 px-6 relative border-t border-emerald-100 dark:border-emerald-800/30 z-10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-text-main">چرا یادگیری با اسپاتی‌کد؟</h2>
            <p className="text-text-muted text-base sm:text-lg">ویژگی‌هایی که مسیر یادگیری فرانت‌اند را متمایز می‌کند</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-7 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">groups</span>
              </div>
              <span className="text-4xl font-black text-text-main">+۲,۵۰۰</span>
              <span className="text-sm text-text-muted font-bold">دانشجوی فعال</span>
            </div>
            <div className="bg-white/80 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-7 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">schedule</span>
              </div>
              <span className="text-4xl font-black text-text-main">۱۲۰ ساعت</span>
              <span className="text-sm text-text-muted font-bold">آموزش تخصصی</span>
            </div>
            <div className="bg-white/80 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-7 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">code_blocks</span>
              </div>
              <span className="text-4xl font-black text-text-main">+۱۵ پروژه</span>
              <span className="text-sm text-text-muted font-bold">پروژه عملی واقعی</span>
            </div>
            <div className="bg-white/80 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-7 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">workspace_premium</span>
              </div>
              <span className="text-4xl font-black text-text-main">۱۰۰٪</span>
              <span className="text-sm text-text-muted font-bold">تضمین کیفیت محتوا</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
