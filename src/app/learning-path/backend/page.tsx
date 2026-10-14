"use client";

import Link from "next/link";

const BACKEND_STEPS = [
  {
    stepNumber: "۰۱",
    stepLabel: "گام اول",
    level: "پایه‌ای و الزامی",
    title: "جاوااسکریپت پیشرفته و TypeScript",
    subtitle: "درک عمیق موتور V8، ایونت لوپ و تایپ‌سیف بودن",
    description: "تسلط بر مکانیک درونی جاوااسکریپت سمت سرور. درک Event Loop، مدیریت حافظه، متدهای آسنکرون، شی‌گرایی پیشرفته و یادگیری TypeScript برای نوشتن کدهای تمیز، مقیاس‌پذیر و بدون خطا.",
    concepts: [
      "معماری Event Loop، Call Stack و Libuv در پشت صحنه",
      "برنامه‌نویسی آسنکرون (Promises, Async/Await, Microtasks)",
      "سیستم تایپ‌های TypeScript (Interfaces, Generics, Utility Types)",
      "مدیریت خطاها، استثناها و الگوی طراحی شی‌گرا (OOP)",
    ],
    skills: ["JavaScript", "TypeScript", "Event Loop", "OOP", "Generics"],
    project: {
      name: "کتابخانه اعتبارسنجی داده‌ها و Event Emitter سفارشی",
      description: "پیاده‌سازی یک Event Emitter اختصاصی با TypeScript و ساخت سیستم اعتبارسنجی تایپ‌سیف داده‌ها.",
    },
    codeSnippet: `interface AppConfig {
  port: number;
  dbUri: string;
  isProd: boolean;
}

const config: AppConfig = {
  port: 3000,
  dbUri: process.env.DATABASE_URL!,
  isProd: true
};`,
    accent: {
      gradient: "from-amber-500 to-yellow-500",
      glow: "bg-amber-500/10",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      node: "border-amber-500 text-amber-500 shadow-amber-500/20",
      iconBg: "bg-gradient-to-br from-amber-400 to-yellow-500",
    },
    icon: "terminal",
  },
  {
    stepNumber: "۰۲",
    stepLabel: "گام دوم",
    level: "متوسط",
    title: "هسته و معماری Node.js",
    subtitle: "موتور اجرایی، بافرها، استریم‌ها و فایل سیستم",
    description: "ورود به لایه‌های عمیق Node.js. کار با ماژول‌های داخلی (fs, path, http, crypto)، پردازش استریم‌ها برای داده‌های حجیم، بافرها، مدیریت فرآیندها (Child Processes) و پکیج‌منیجرها.",
    concepts: [
      "ماژول‌های داخلی هسته (fs, path, events, crypto, http)",
      "پردازش بهینه جریان داده با Streams و کار با Buffers",
      "مدیریت رویدادها، ایونت‌لیسنرها و جریان‌های ورودی/خروجی (I/O)",
      "ساختار ماژولار CommonJS در برابر ES Modules و پکیج‌بندی",
    ],
    skills: ["Node.js Core", "Streams", "Buffers", "File System", "NPM"],
    project: {
      name: "ابزار CLI و سرور استریمینگ فایل‌های حجیم",
      description: "ساخت ابزار خط فرمان و سرور پایپینگ استریم برای آپلود فایل‌های ویدیویی بدون هدررفت رم.",
    },
    codeSnippet: `import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

async function streamMedia(path: string, res: Response) {
  const readStream = createReadStream(path);
  await pipeline(readStream, res);
}`,
    accent: {
      gradient: "from-emerald-500 to-green-600",
      glow: "bg-emerald-500/10",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      node: "border-emerald-500 text-emerald-500 shadow-emerald-500/20",
      iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
    },
    icon: "deployed_code",
  },
  {
    stepNumber: "۰۳",
    stepLabel: "گام سوم",
    level: "متوسط تا پیشرفته",
    title: "پایگاه‌های داده و کار با Prisma",
    subtitle: "طراحی اسکیما، دیتابیس‌های رابطه‌ای و غیررابطه‌ای",
    description: "قلب پایدار ذخیره‌سازی داده. تسلط بر دیتابیس‌های رابطه‌ای با PostgreSQL، دیتابیس‌های سندمحور با MongoDB، ایندکس‌گذاری، مایگریشن‌ها و استفاده از ORM مدرن Prisma برای کوئری‌نویسی تایپ‌سیف.",
    concepts: [
      "اصول مدل‌سازی رابطه داده‌ها (One-to-Many, Many-to-Many)",
      "کوئری‌نویسی و طراحی اسکیما در PostgreSQL و MongoDB",
      "کار با Prisma ORM، ساخت Migration و مایگریت پایگاه داده",
      "ایندکس‌گذاری (Indexing)، بهینه‌سازی کوئری و تراکنش‌های امن (Transactions)",
    ],
    skills: ["PostgreSQL", "MongoDB", "Prisma ORM", "SQL", "Indexing"],
    project: {
      name: "پایگاه‌داده جامع شبکه اجتماعی و سفارشات",
      description: "طراحی اسکیما با روابط پیچیده، تراکنش‌های بانکی اتومیک و کوئری‌های بهینه شده در Prisma.",
    },
    codeSnippet: `const result = await prisma.$transaction([
  prisma.user.update({
    where: { id: userId },
    data: { walletBalance: { decrement: amount } }
  }),
  prisma.order.create({ data: orderData })
]);`,
    accent: {
      gradient: "from-teal-500 to-emerald-600",
      glow: "bg-teal-500/10",
      badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      node: "border-teal-500 text-teal-500 shadow-teal-500/20",
      iconBg: "bg-gradient-to-br from-teal-400 to-emerald-600",
    },
    icon: "database",
  },
  {
    stepNumber: "۰۴",
    stepLabel: "گام چهارم",
    level: "پیشرفته",
    title: "توسعه API با Express.js",
    subtitle: "معماری RESTful، احراز هویت امن و Middlewareها",
    description: "ساخت وب‌سرویس‌های تجاری و مقیاس‌پذیر. پیاده‌سازی معماری تمیز چندلایه‌ای (Controller, Service, Repository)، میدل‌ورهای احراز هویت با JWT و رفرش توکن، اعتبارسنجی ورودی‌ها با Zod و سیستم لاگینگ.",
    concepts: [
      "معماری استاندارد لایه‌ای (Clean Architecture / MVC)",
      "احراز هویت دومرحله‌ای با JWT و Access / Refresh Tokens",
      "اعتبارسنجی داده‌های ورودی با Zod و میدل‌ورهای سراسری ارور",
      "محدودسازی نرخ درخواست‌ها (Rate Limiting) و ایمن‌سازی سرور با Helmet",
    ],
    skills: ["Express.js", "RESTful API", "JWT Auth", "Zod", "Security"],
    project: {
      name: "وب‌سرویس کامل فروشگاهی با احراز هویت دو مرحله‌ای",
      description: "سیستم کامل ثبت‌نام، ورود با OTP و توکن، پنل محصولات، کنترل دسترسی RBAC و مستندات API.",
    },
    codeSnippet: `router.post(
  '/api/auth/login',
  validate(loginSchema),
  authController.handleLogin
);`,
    accent: {
      gradient: "from-blue-500 to-indigo-600",
      glow: "bg-blue-500/10",
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      node: "border-blue-500 text-blue-500 shadow-blue-500/20",
      iconBg: "bg-gradient-to-br from-blue-400 to-indigo-600",
    },
    icon: "api",
  },
  {
    stepNumber: "۰۵",
    stepLabel: "گام پنجم",
    level: "پیشرفته تا تخصصی",
    title: "ارتباطات Real-time و کشینگ با Redis",
    subtitle: "سوکت‌های زنده، صف پیام‌ها و افزایش چشمگیر سرعت",
    description: "سیستم‌های بلادرنگ و پربازدید. پیاده‌سازی WebSockets با Socket.io برای چت زنده و نوتیفیکیشن‌ها، و استفاده از Redis برای کش کردن کوئری‌های سنگین، مدیریت صف‌ها و Pub/Sub.",
    concepts: [
      "برقراری ارتباط دوطرفه زنده با Socket.io و اتاق‌های چت (Rooms)",
      "کشینگ هوشمند اطلاعات پرکاربرد با Redis (In-Memory Data)",
      "پیاده‌سازی الگوی انتشار و اشتراک (Pub/Sub) برای میکروسرویس‌ها",
      "مدیریت نشست‌های کاربران (Session Store) و کش نامعتبرسازی",
    ],
    skills: ["Socket.io", "WebSockets", "Redis", "Caching", "Pub/Sub"],
    project: {
      name: "سامانه چت و اعلان آنی با کش ردیس",
      description: "پیاده‌سازی چت‌روم چندنفره، وضعیت آنلاین/آفلاین لحظه‌ای و کشینگ لیست پیام‌ها در Redis.",
    },
    codeSnippet: `io.on('connection', (socket) => {
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    socket.to(chatId).emit('user_joined', socket.id);
  });
});`,
    accent: {
      gradient: "from-violet-500 to-purple-600",
      glow: "bg-violet-500/10",
      badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
      node: "border-violet-500 text-violet-500 shadow-violet-500/20",
      iconBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    },
    icon: "swap_calls",
  },
  {
    stepNumber: "۰۶",
    stepLabel: "گام ششم",
    level: "حرفه‌ای / آماده ورود به بازار کار",
    title: "تست‌نویسی، داکر و استقرار (CI/CD)",
    subtitle: "تضمین پایداری، کانتینرسازی و راه‌اندازی روی سرور",
    description: "تبدیل شدن به مهندس نرم‌افزار حرفه‌ای. نوشتن تست‌های Unit و Integration با Jest، کانتینرسازی پروژه با Docker و Docker Compose، و راه‌اندازی پایپ‌لاین‌های CI/CD و دیپلوی روی لینوکس ابری.",
    concepts: [
      "نوشتن تست‌های واحد (Unit) و تست یکپارچگی (Integration) با Jest و Supertest",
      "داکرایز کردن سرور و دیتابیس با Dockerfile و Docker Compose",
      "پیکربندی محیط‌های مجزا (Development, Staging, Production)",
      "راه‌اندازی پایپ‌لاین GitHub Actions برای تست و استقرار خودکار",
    ],
    skills: ["Jest", "Docker", "Docker Compose", "CI/CD", "Linux Deploy"],
    project: {
      name: "کانتینرسازی کامل و پایپ‌لاین استقرار خودکار",
      description: "تست خودکار تمامی Endpointها با پوشش بالای ۸۰٪ و استقرار خودکار کانتینر روی سرور ابری.",
    },
    codeSnippet: `FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
    accent: {
      gradient: "from-rose-500 to-pink-600",
      glow: "bg-rose-500/10",
      badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      node: "border-rose-500 text-rose-500 shadow-rose-500/20",
      iconBg: "bg-gradient-to-br from-rose-400 to-pink-600",
    },
    icon: "bug_report",
  },
];

export default function BackendRoadmap() {
  return (
    <div className="bg-background-base text-text-main overflow-x-hidden min-h-screen flex flex-col selection:bg-primary selection:text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-[80px] animate-drift"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-green-100/50 to-emerald-100/30 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full blur-[100px] animate-drift" style={{ animationDelay: "-5s" }}></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-white dark:bg-emerald-900/10 rounded-full blur-[60px] opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.1]" style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      </div>

      {/* Hero Header */}
      <header className="relative pt-24 pb-32 px-6 min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center overflow-hidden z-10">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.15] text-text-main drop-shadow-sm">
            مسیر <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">حرفه‌ای</span> شدن <br />
            <span className="font-display font-light text-text-muted">در توسعه بک‌اند</span>
          </h1>
          <p className="text-lg md:text-2xl text-text-muted max-w-3xl leading-relaxed font-light">
            تخصص در مهندسی سمت سرور با رویکردی <span className="text-primary font-bold">مدرن</span> و <span className="text-primary font-bold">پروژه‌محور</span>.
            معماری سیستم‌های مقیاس‌پذیر و پایگاه‌های داده در قالب ۶ گام عملی.
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
            <span>نقشه راه مهندسی بک‌اند</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-text-main mb-4 tracking-tight">
            مراحل گام‌به‌گام تا تخصص سمت سرور
          </h2>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            مسیر استاندارد معماری سرور، دیتابیس، کشینگ، وب‌سوکت و دوآپس
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Glowing Spine on Desktop */}
          <div className="hidden md:block absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-amber-400 via-emerald-400 via-teal-400 via-blue-500 via-violet-500 to-rose-500 rounded-full opacity-40 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />

          {/* Timeline Nodes & Rows */}
          <div className="space-y-16 md:space-y-28">
            {BACKEND_STEPS.map((step, idx) => {
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
                          <span className="text-[10px] text-gray-400 font-sans ml-2">server.ts</span>
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
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-text-main">چرا یادگیری بک‌اند با اسپاتی‌کد؟</h2>
            <p className="text-text-muted text-base sm:text-lg">ویژگی‌هایی که دوره مهندسی بک‌اند را منحصر‌به‌فرد می‌کند</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-7 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">groups</span>
              </div>
              <span className="text-4xl font-black text-text-main">+۳,۲۰۰</span>
              <span className="text-sm text-text-muted font-bold">دانشجوی فعال</span>
            </div>
            <div className="bg-white/80 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-7 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">schedule</span>
              </div>
              <span className="text-4xl font-black text-text-main">۱۴۰ ساعت</span>
              <span className="text-sm text-text-muted font-bold">آموزش عمیق</span>
            </div>
            <div className="bg-white/80 dark:bg-[#1c1e26] border border-gray-200/80 dark:border-white/[0.06] p-7 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">dns</span>
              </div>
              <span className="text-4xl font-black text-text-main">+۲۰ پروژه</span>
              <span className="text-sm text-text-muted font-bold">پروژه و میکروسرویس</span>
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
