import Image from "next/image";
import Link from "next/link";
import TestimonialSlider from "./components/TestimonialSlider";
import PremiumStats from "./components/PremiumStats";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
      {/* Background Blobs */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob-shape bg-primary/20 w-96 h-96 rounded-full top-0 right-0 -translate-y-1/2 translate-x-1/2 dark:bg-primary/10"></div>
        <div className="blob-shape bg-blue-400/20 w-80 h-80 rounded-full bottom-0 left-0 translate-y-1/2 -translate-x-1/2 dark:bg-blue-600/10"></div>
      </div> */}

      <main>
        {/* Hero Section */}
        <header className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark rounded-full shadow-sm text-xs font-bold text-primary border border-primary/20">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                دوره جدید Full-Stack شروع شد
              </div>
              <h1 className="text-4xl lg:text-7xl font-black leading-[1.2] text-gray-900 dark:text-white">
                مسیر{" "}
                <span className="text-primary relative inline-block">
                  حرفه‌ای
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 100 8"
                    width="100%"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5C20 2 40 2 60 4C80 6 90 6 99 2"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></path>
                  </svg>
                </span>{" "}
                شدن <br />
                در دنیای برنامه‌نویسی
              </h1>
              <p className="text-xl text-text-muted-light dark:text-text-muted-dark leading-loose max-w-2xl mx-auto lg:mx-0">
                با متدهای روز دنیا و همراهی منتورهای ارشد، مهارت‌هایی یاد بگیرید
                که بازار کار تشنه‌ی آن‌هاست. از صفر مطلق تا استخدام، کنار شما
                هستیم.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <a
                  className="bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-4xl text-lg font-extrabold transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 group"
                  href="#"
                >
                  شروع یادگیری
                  <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                </a>
                <a
                  className="bg-white/70 dark:bg-surface-dark/80 md:backdrop-blur-xl md:hover:bg-white/90 md:dark:hover:bg-surface-dark text-text-light dark:text-white px-10 py-5 rounded-4xl text-lg font-extrabold transition-all duration-300 shadow-lg flex items-center justify-center gap-3 border border-white/30 dark:border-white/10"
                  href="/courses"
                >
                  <span className="material-symbols-outlined text-primary">
                    category
                  </span>
                  مشاهده دوره‌ها
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-6">
                <div className="flex -space-x-3 space-x-reverse">
                  <Image
                    alt="User"
                    className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                    src="/images/user1.jpg"
                    width={48}
                    height={48}
                  />
                  <Image
                    alt="User"
                    className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                    src="/images/user2.jpg"
                    width={48}
                    height={48}
                  />
                  <Image
                    alt="User"
                    className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                    src="/images/user3.jpg"
                    width={48}
                    height={48}
                  />
                  <div className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark bg-primary/20 flex items-center justify-center text-sm font-black text-primary backdrop-blur-sm">
                    +۲۵۰
                  </div>
                </div>
                <p className="text-sm font-bold text-text-muted-light dark:text-text-muted-dark">
                  دانشجوی فعال در این ترم
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-video w-full bg-black rounded-4xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden relative group cursor-pointer border-8 border-white dark:border-surface-dark/50">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-black/90 z-10"></div>
                <Image
                  alt="Coding workspace"
                  className="absolute inset-0 w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-1000 transform-gpu"
                  src="/images/hero_image.jpg"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-24 h-24 bg-primary/90 md:backdrop-blur-md rounded-full flex items-center justify-center pl-1 text-white shadow-[0_0_50px_rgba(34,197,94,0.6)] md:group-hover:scale-110 transition-transform duration-500 transform-gpu">
                    <span className="material-icons-round text-6xl">
                      play_arrow
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute -bottom-8 -right-8 w-32 h-32 bg-yellow-400 rounded-4xl -z-10 rotate-12 opacity-80 blur-sm transform-gpu"></div>
              <div className="hidden md:block absolute -top-8 -left-8 w-24 h-24 bg-blue-500 rounded-full -z-10 opacity-40 blur-xl transform-gpu"></div>
            </div>
          </div>
        </header>

        {/* Animated Premium Stats Section */}
        <PremiumStats />

        {/* Featured Courses Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="flex flex-col items-center justify-center md:items-start md:text-right w-full md:w-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary-dark dark:text-primary rounded-full text-xs font-black mb-4 border border-primary/20">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                  پیشنهاد ویژه
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white text-center md:text-right">
                  دوره‌های{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-green-600 relative inline-block">
                    پرطرفدار
                  </span>
                </h2>
              </div>
              <a
                className="hidden md:flex items-center gap-3 text-primary font-black hover:gap-5 transition-all text-lg group"
                href="/courses"
              >
                مشاهده همه دوره‌ها
                <span className="material-symbols-outlined font-bold rtl:rotate-180">
                  arrow_right_alt
                </span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  id: "javascript",
                  title: "جادوی جاوااسکریپت",
                  description: "قلب تعاملات — ES6+، DOM، Fetch API و مدیریت داده",
                  instructor: "امیررضا رضایی",
                  instructorImg: "/images/inst1.jpg",
                  image: "/images/js-green.png",
                  difficulty: "متوسط",
                  hours: "۳۲",
                  students: "۱,۶۵۰",
                  price: "۲,۲۰۰,۰۰۰",
                  alt: "JavaScript course",
                },
                {
                  id: "react",
                  title: "فریمورک React",
                  description: "تفکر کامپوننتی — هوک‌ها، مدیریت وضعیت و اکوسیستم React",
                  instructor: "مهرداد حیدری",
                  instructorImg: "/images/inst4.jpg",
                  image: "/images/react-green.png",
                  difficulty: "متوسط",
                  hours: "۴۰",
                  students: "۱,۲۴۰",
                  price: "۳,۵۰۰,۰۰۰",
                  alt: "React course",
                },
                {
                  id: "nextjs",
                  title: "Next.js پیشرفته",
                  description: "قدرت فول‌استک — SSR، SSG و بهینه‌سازی عملکرد",
                  instructor: "امیررضا رضایی",
                  instructorImg: "/images/inst1.jpg",
                  image: "/images/nextjs-green.png",
                  difficulty: "پیشرفته",
                  hours: "۴۸",
                  students: "۸۹۰",
                  price: "۴,۵۰۰,۰۰۰",
                  alt: "Next.js course",
                },
                {
                  id: "html",
                  title: "آشنایی با HTML",
                  description: "اسکلت‌بندی وب — تگ‌های معنایی، دسترسی‌پذیری و اصول سئو",
                  instructor: "نیما علوی",
                  instructorImg: "/images/inst3.jpg",
                  image: "/images/html-green.png",
                  difficulty: "مقدماتی",
                  hours: "۱۲",
                  students: "۱,۸۵۰",
                  price: "۹۸۰,۰۰۰",
                  alt: "HTML course",
                },
                {
                  id: "css",
                  title: "استایل‌دهی با CSS",
                  description: "جادوی بصری وب — Flexbox، Grid و طراحی واکنش‌گرا",
                  instructor: "سارا محمدی",
                  instructorImg: "/images/inst2.jpg",
                  image: "/images/css-green.png",
                  difficulty: "مقدماتی",
                  hours: "۱۸",
                  students: "۲,۱۲۰",
                  price: "۱,۴۵۰,۰۰۰",
                  alt: "CSS course",
                },
                {
                  id: "python",
                  title: "ورود به دنیای پایتون",
                  description: "برنامه‌نویسی، ساخت اسکریپت و تحلیل داده مقدماتی",
                  instructor: "امیرحسین عباسی",
                  instructorImg: "/images/inst3.jpg",
                  image: "/images/js-green.png",
                  difficulty: "مقدماتی",
                  hours: "۲۵",
                  students: "۳,۲۰۰",
                  price: "۱,۸۰۰,۰۰۰",
                  alt: "Python course",
                },
              ].map((course) => (
                 <div
                  key={course.id}
                  className="group flex flex-col h-full bg-white dark:bg-transparent dark:glass-premium rounded-4xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none transition-all duration-500 md:hover:-translate-y-3 md:hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]"
                >
                  <div className="relative h-64 overflow-hidden rounded-t-4xl isolate">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover transform-gpu md:group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                    </div>
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-8 rounded-full border border-white/50 p-0.5">
                        <Image
                          className="w-full h-full rounded-full object-cover"
                          alt={course.instructor}
                          src={course.instructorImg}
                          width={32}
                          height={32}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-bold">
                        {course.instructor}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-8">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        <span>{course.hours} ساعت</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          groups
                        </span>
                        <span>{course.students} دانشجو</span>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50 dark:border-white/5">
                      <span className="bg-primary/10 text-primary-dark dark:text-primary px-5 py-2.5 rounded-2xl font-black text-sm">
                        {course.price}{" "}
                        <span className="text-[10px] opacity-80 font-bold mr-1">
                          تومان
                        </span>
                      </span>
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex-1 bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-background-dark text-gray-900 dark:text-white rounded-2xl py-2.5 font-bold transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        مشاهده
                        <span className="material-symbols-outlined text-[18px] rtl:rotate-180 group-hover/btn:-translate-x-2 transition-transform">
                          arrow_right_alt
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex justify-end">
              <a
                className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold transition-colors group"
                href="/courses"
              >
                مشاهده همه دوره‌ها
                <span className="material-symbols-outlined rtl:rotate-180 group-hover:-translate-x-1 transition-transform">
                  arrow_right_alt
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Zig-Zag Learning Paths Section */}
        <section className="py-32 relative overflow-hidden">
          {/* Global Ambient Glow - Hidden on mobile for performance */}
          <div className="hidden md:block absolute top-0 right-1/4 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10 transform-gpu"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            {/* Section Header */}
            <div className="text-center mb-28">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white">
                تخصص‌های طلایی اپلیکیشن‌سازی
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                اسپاتی‌کد شما را با دو مسیر کاملاً تخصصی و تضمین‌شده، از نقطه‌ی صفر تا تبدیل شدن به یک برنامه‌نویس ارشد همراهی می‌کند.
              </p>
            </div>

            {/* Feature 1: Front-End (Text Right, Image Left) */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-32 group">
              {/* Content (Right Side in RTL) */}
              <div className="w-full lg:w-1/2 rtl:lg:pl-10">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/40 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 shadow-sm">
                  <span className="material-symbols-outlined text-3xl font-bold">
                    code_blocks
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                  جادوی خلقِ <br/>
                  <span className="text-blue-600 dark:text-blue-400">رابط کاربری مسحورکننده</span>
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                  در مسیر مهندسی فرانت‌اند، یاد می‌گیرید چگونه طرح‌های بی‌جان را با قدرت جاوااسکریپت و ری‌اکت به اپلیکیشن‌های زنده، تعاملی و بی‌نهایت روان تبدیل کنید.
                </p>
                
                <ul className="space-y-4 mb-12">
                  {[
                    "تسلط کامل بر HTML, CSS و JavaScript",
                    "ساخت رابط‌های پیچیده با React و Next.js",
                    "مدیریت استیت‌ها و اتصال به APIهای قدرتمند"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-lg text-gray-700 dark:text-gray-300 font-medium">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <a href="/roadmaps" className="inline-flex w-full md:w-auto items-center justify-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-2xl font-black text-lg transition-colors shadow-lg">
                  شروع مسیر فرانت‌اند
                  <span className="material-symbols-outlined rtl:rotate-180">
                    arrow_right_alt
                  </span>
                </a>
              </div>
              
              {/* Graphic (Left Side in RTL) */}
              <div className="w-full lg:w-1/2 relative">
                {/* Background glow optimized */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-[3rem] blur-3xl -z-10 group-hover:bg-blue-400/30 transition-all duration-1000 transform-gpu"></div>
                
                {/* Main Card */}
                <div className="bg-white dark:bg-[#1a1c23] md:bg-white/95 md:dark:bg-[#1a1c23]/95 md:backdrop-blur-md border border-gray-100 dark:border-white/5 rounded-[3rem] p-8 shadow-xl relative md:group-hover:-translate-y-4 transition-transform duration-700 transform-gpu">
                  {/* Decorative terminal/browser header */}
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  {/* Abstract code representation */}
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                    <div className="h-4 bg-blue-100 dark:bg-blue-900/50 rounded-full w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
                    <div className="flex gap-4 pt-4">
                      <div className="h-24 w-1/3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl"></div>
                      <div className="h-24 w-2/3 bg-gray-100 dark:bg-gray-800/50 rounded-2xl"></div>
                    </div>
                  </div>
                  
                  {/* Floating UI Elements */}
                  <div className="hidden md:flex absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-white dark:bg-[#252836] md:bg-white/95 md:dark:bg-[#252836]/95 md:backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-2xl flex-col gap-2 md:group-hover:-translate-y-4 md:group-hover:-rotate-6 transition-all duration-700 delay-100 z-20 transform-gpu">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined">view_quilt</span>
                      </div>
                      <div>
                        <div className="text-sm font-black text-gray-900 dark:text-white mb-1">کامپوننت‌های مدرن</div>
                        <div className="flex gap-1 w-full justify-start rtl:justify-end">
                          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
                          <div className="w-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex absolute top-1/3 -left-10 bg-white/95 dark:bg-[#252836]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl py-2 px-4 shadow-xl items-center gap-3 group-hover:-translate-y-4 group-hover:rotate-6 transition-all duration-700 delay-300 z-20 transform-gpu">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wider">UX بی‌نظیر</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Back-End (Text Left, Image Right -> Reversed Visual Flow) */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24 group">
              {/* Content (Left Side in RTL) */}
              <div className="w-full lg:w-1/2 rtl:lg:pr-10">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/40 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-8 shadow-sm">
                  <span className="material-symbols-outlined text-3xl font-bold">
                    storage
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                  معماریِ پنهان <br/>
                  <span className="text-emerald-600 dark:text-emerald-400">یک هسته‌ی بی‌نقص</span>
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                  در مهندسی بک‌اند، شما مغز متفکر سیستم‌ها را با Node.js خلق می‌کنید. طراحی دیتابیس‌های چندمیلیونی، تامین امنیت و ساخت APIهای سریع تخصص واقعی شماست.
                </p>
                
                <ul className="space-y-4 mb-12">
                  {[
                    "توسعه سرورهای پرسرعت با Node.js",
                    "معماری پایگاه‌های داده پیشرفته و NoSQL",
                    "تست نفوذ، امنیت بالا و رمزنگاری داده‌ها"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-lg text-gray-700 dark:text-gray-300 font-medium">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <a href="/roadmaps" className="inline-flex w-full md:w-auto items-center justify-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 rounded-2xl font-black text-lg transition-colors shadow-lg">
                  شروع مسیر بک‌اند
                  <span className="material-symbols-outlined rtl:rotate-180">
                    arrow_right_alt
                  </span>
                </a>
              </div>
              
              {/* Graphic (Right Side in RTL) */}
              <div className="w-full lg:w-1/2 relative">
                {/* Background glow optimized */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-[3rem] blur-3xl -z-10 group-hover:bg-emerald-400/30 transition-all duration-1000 transform-gpu"></div>
                
                {/* Main Card */}
                <div className="bg-white dark:bg-[#1a1c23] md:bg-white/95 md:dark:bg-[#1a1c23]/95 md:backdrop-blur-md border border-gray-100 dark:border-white/5 rounded-[3rem] p-8 shadow-xl relative md:group-hover:-translate-y-4 transition-transform duration-700 transform-gpu">
                  {/* Decorative server grid layout */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-gray-100 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center">
                       <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-700">dns</span>
                    </div>
                    <div className="h-32 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl flex flex-col items-center justify-center text-emerald-500">
                      <span className="material-symbols-outlined text-3xl mb-2">cloud_done</span>
                      <span className="text-xs font-bold">API Active</span>
                    </div>
                    <div className="col-span-2 h-20 bg-gray-200/50 dark:bg-gray-800/80 rounded-2xl flex items-center px-6 gap-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                      <div className="h-2 w-full bg-emerald-400/20 rounded-full">
                         <div className="h-full w-2/3 bg-emerald-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating UI Element */}
                  <div className="hidden md:flex absolute -top-4 -left-4 md:-top-8 md:-left-8 bg-white dark:bg-[#252836] md:bg-white/95 md:dark:bg-[#252836]/95 md:backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-2xl items-center gap-4 md:group-hover:-translate-y-4 md:group-hover:-rotate-6 transition-all duration-700 delay-100 z-20 transform-gpu">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 tracking-widest leading-none">LATENCY</span>
                      <span className="text-sm font-black text-gray-900 dark:text-white font-mono leading-none" dir="ltr">~2 ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialSlider />
      </main>
    </div>
  );
}
