import Image from "next/image";
import Link from "next/link";
import TestimonialSlider from "./components/TestimonialSlider";

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
                  className="bg-white/70 dark:bg-[#14161c]/10 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-[#14161c]/20 text-text-light dark:text-white px-10 py-5 rounded-4xl text-lg font-extrabold transition-all duration-300 shadow-lg flex items-center justify-center gap-3 border border-white/30 dark:border-white/10"
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
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  src="/images/hero_image.jpg"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-24 h-24 bg-primary/90 backdrop-blur-md rounded-full flex items-center justify-center pl-1 text-white shadow-[0_0_50px_rgba(34,197,94,0.6)] group-hover:scale-110 transition-transform duration-500">
                    <span className="material-icons-round text-6xl">
                      play_arrow
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-yellow-400 rounded-4xl -z-10 rotate-12 opacity-80 blur-sm"></div>
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-500 rounded-full -z-10 opacity-40 blur-xl"></div>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-[0_12px_40px_-8px_rgba(34,197,94,0.15)] dark:shadow-none border border-white dark:border-gray-800 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-900/20 rounded-2xl flex items-center justify-center mb-4 text-primary shadow-inner group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-3xl font-light">
                    school
                  </span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">
                  ۱۰,۰۰۰+
                </h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  دانشجوی مستعد
                </p>
              </div>
              <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-[0_12px_40px_-8px_rgba(34,197,94,0.15)] dark:shadow-none border border-white dark:border-gray-800 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-900/20 rounded-2xl flex items-center justify-center mb-4 text-blue-500 shadow-inner group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-3xl font-light">
                    menu_book
                  </span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">
                  ۵۰+
                </h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
                  دوره تخصصی
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-2xl text-xs font-black border border-blue-500/20">
                  <span className="material-symbols-outlined text-sm">
                    timer
                  </span>
                  ۱۵۰۰+ ساعت محتوا
                </div>
              </div>
              <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-[0_12px_40px_-8px_rgba(34,197,94,0.15)] dark:shadow-none border border-white dark:border-gray-800 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mb-4 text-purple-500 shadow-inner group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-3xl font-light">
                    support_agent
                  </span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">
                  ۲۴/۷
                </h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  پشتیبانی اختصاصی
                </p>
              </div>
              <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-[0_12px_40px_-8px_rgba(34,197,94,0.15)] dark:shadow-none border border-white dark:border-gray-800 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-900/20 rounded-2xl flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 shadow-inner group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-3xl font-light">
                    verified
                  </span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">
                  ۹۸٪
                </h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  رضایت دانشجویان
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary-dark dark:text-primary rounded-full text-xs font-black mb-4 border border-primary/20">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                  پیشنهاد ویژه
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
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
                  className="group flex flex-col bg-white/60 dark:bg-surface-dark border border-gray-200/80 dark:border-white/5 rounded-4xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] transition-all duration-500 backdrop-blur-xl"
                >
                  <div className="relative h-60 overflow-hidden rounded-t-4xl isolate">
                    <Image
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={course.alt}
                      src={course.image}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70"></div>
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                      <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                        {course.difficulty}
                      </span>
                      <div className="flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <button className="size-9 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 flex items-center justify-center transition-all shadow-lg cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]">
                            favorite
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-7 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-transparent to-white/40 dark:to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-8 rounded-full border border-gray-200 dark:border-white/20 p-0.5 shadow-sm bg-white dark:bg-transparent">
                        <Image
                          className="w-full h-full rounded-full object-cover"
                          alt={course.instructor}
                          src={course.instructorImg}
                          width={32}
                          height={32}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">
                        {course.instructor}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-bold mb-8">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        <span>{course.hours} ساعت</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          groups
                        </span>
                        <span>{course.students}</span>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                      <span className="bg-primary/10 text-primary-dark dark:text-primary px-4 py-2 rounded-2xl font-black text-sm whitespace-nowrap">
                        {course.price}{" "}
                        <span className="text-[10px] opacity-80 font-bold mr-0.5">
                          تومان
                        </span>
                      </span>
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex-1 bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-background-dark text-gray-700 dark:text-white border border-gray-200/50 dark:border-transparent rounded-2xl py-2 font-bold transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        مشاهده 
                        <span className="material-symbols-outlined text-[18px] rtl:rotate-180 group-hover/btn:translate-x-1 transition-transform">
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

        {/* Categories Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-5xl font-black mb-6 tracking-tight text-gray-900 dark:text-white">
                  دسته‌بندی‌های طلایی
                </h2>
                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                  تخصص مورد علاقه خود را پیدا کنید و با بهترین اساتید وارد بازار
                  کار شوید.
                </p>
              </div>
              <a
                className="hidden md:flex items-center gap-3 text-primary font-black hover:gap-5 transition-all text-xl group"
                href="#"
              >
                مشاهده همـه دوره‌ها
                <span className="material-symbols-outlined font-bold">
                  keyboard_backspace
                </span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="group bg-white dark:bg-surface-dark rounded-4xl p-10 border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                    <span className="material-symbols-outlined text-4xl">
                      html
                    </span>
                  </div>
                  <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/30 rounded-4xl border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-300 font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    ۸۵ ساعت
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-5 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  توسعه وب (Full Stack)
                </h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                  تسلط بر اکوسیستم مدرن وب؛ از React و Next.js تا Node.js و
                  پایگاه‌داده‌های پیشرفته.
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-8">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                    ۲۰ پروژه حرفه‌ای
                  </span>
                  <div className="w-12 h-12 rounded-4xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all">
                    <span className="material-symbols-outlined font-bold">
                      chevron_left
                    </span>
                  </div>
                </div>
              </div>
              <div className="group bg-white dark:bg-surface-dark rounded-4xl p-10 border border-gray-100 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-400 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-purple-500/40 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                    <span className="material-symbols-outlined text-4xl">
                      smartphone
                    </span>
                  </div>
                  <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/30 rounded-4xl border border-purple-100 dark:border-purple-800/50 text-purple-600 dark:text-purple-300 font-black shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    ۶۰ ساعت
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-5 text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  برنامه‌نویسی موبایل
                </h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                  ساخت اپلیکیشن‌های Native و Cross-platform با Flutter و کاتلین
                  برای بازار جهانی.
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-8">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                    ۱۵ پروژه حرفه‌ای
                  </span>
                  <div className="w-12 h-12 rounded-4xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 transition-all">
                    <span className="material-symbols-outlined font-bold">
                      chevron_left
                    </span>
                  </div>
                </div>
              </div>
              <div className="group bg-white dark:bg-surface-dark rounded-4xl p-10 border border-gray-100 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/40 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                    <span className="material-symbols-outlined text-4xl">
                      psychology
                    </span>
                  </div>
                  <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-4xl border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-300 font-black shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    ۱۲۰ ساعت
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-5 text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  هوش مصنوعی و داده
                </h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                  ورود به دنیای پایتون، یادگیری ماشین و تحلیل داده؛ پردرآمدترین
                  تخصص عصر حاضر.
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-8">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                    ۳۰ پروژه حرفه‌ای
                  </span>
                  <div className="w-12 h-12 rounded-4xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all">
                    <span className="material-symbols-outlined font-bold">
                      chevron_left
                    </span>
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
