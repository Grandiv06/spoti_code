import Image from "next/image";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      <div className="mesh-bg"></div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-20 py-12 relative z-10">
        {/* Breadcrumb and Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              کاوش در دنیای{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-green-600 relative inline-block">
                برنامه‌نویسی
              </span>
            </h2>
          </div>
          <div className="relative w-full md:w-[32rem] group">
            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none z-10">
              <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors text-[28px]">
                search
              </span>
            </div>
            <input
              className="w-full glass-premium text-lg border-0 rounded-4xl py-5 pr-16 pl-6 focus:ring-0 focus:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all shadow-lg placeholder-gray-400 dark:placeholder-gray-500 font-bold text-gray-700 dark:text-white"
              placeholder="جستجوی پیشرفته دوره..."
              type="text"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="glass-premium p-8 rounded-4xl sticky top-28 transition-all">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200/50 dark:border-white/10">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    tune
                  </span>
                  فیلترها
                </h2>
                <a
                  className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                  href="#"
                >
                  پاک کردن
                </a>
              </div>

              {/* Categories */}
              <div className="mb-10">
                <p className="text-xs font-black text-gray-400 mb-5 uppercase tracking-widest px-2">
                  دسته‌بندی‌ها
                </p>
                <div className="space-y-2">
                  <label className="flex items-center justify-between group cursor-pointer p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center">
                        <input
                          defaultChecked
                          className="peer h-6 w-6 cursor-pointer appearance-none rounded-xl border-2 border-gray-300/80 transition-all checked:border-primary checked:bg-primary hover:border-primary focus:ring-0"
                          type="checkbox"
                        />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-[16px] font-bold pointer-events-none">
                          check
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                        فرانت‌اند
                      </span>
                    </div>
                    <span className="size-6 flex items-center justify-center text-[10px] font-bold bg-primary/10 text-primary-dark dark:text-primary rounded-full">
                      5
                    </span>
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center">
                        <input
                          className="peer h-6 w-6 cursor-pointer appearance-none rounded-xl border-2 border-gray-300/80 transition-all checked:border-primary checked:bg-primary hover:border-primary focus:ring-0"
                          type="checkbox"
                        />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-[16px] font-bold pointer-events-none">
                          check
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                        بک‌اند
                      </span>
                    </div>
                    <span className="size-6 flex items-center justify-center text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-500 rounded-full">
                      18
                    </span>
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center">
                        <input
                          className="peer h-6 w-6 cursor-pointer appearance-none rounded-xl border-2 border-gray-300/80 transition-all checked:border-primary checked:bg-primary hover:border-primary focus:ring-0"
                          type="checkbox"
                        />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-[16px] font-bold pointer-events-none">
                          check
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                        فول‌استک
                      </span>
                    </div>
                    <span className="size-6 flex items-center justify-center text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-500 rounded-full">
                      12
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
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
              ].map((course) => (
                <div
                  key={course.id}
                  className="group flex flex-col glass-premium rounded-4xl border border-white/40 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]"
                >
                  <div className="relative h-64 overflow-hidden rounded-t-4xl isolate">
                    <Image
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={course.alt}
                      src={course.image}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                      <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                        {course.difficulty}
                      </span>
                      <div className="flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 flex items-center justify-center transition-all shadow-lg cursor-pointer">
                          <span className="material-symbols-outlined text-[20px]">
                            favorite
                          </span>
                        </button>
                        <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-blue-500 flex items-center justify-center transition-all shadow-lg cursor-pointer">
                          <span className="material-symbols-outlined text-[20px]">
                            share
                          </span>
                        </button>
                      </div>
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
                        مشاهده دوره
                        <span className="material-symbols-outlined text-[18px] rtl:rotate-180 group-hover/btn:translate-x-1 transition-transform">
                          arrow_right_alt
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-24 flex justify-center gap-4">
              <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background-dark transition-all duration-300 backdrop-blur-md shadow-lg group cursor-pointer">
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>
              <button className="size-16 rounded-full bg-primary text-background-dark font-black text-xl flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.5)] scale-110 cursor-pointer">
                ۱
              </button>
              <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-colors font-bold backdrop-blur-md shadow-lg cursor-pointer">
                ۲
              </button>
              <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-colors font-bold backdrop-blur-md shadow-lg cursor-pointer">
                ۳
              </button>
              <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background-dark transition-all duration-300 backdrop-blur-md shadow-lg group cursor-pointer">
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  chevron_left
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
