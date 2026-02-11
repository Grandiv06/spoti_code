import Image from "next/image";
import Link from "next/link";
import CourseCurriculum from "../../components/CourseCurriculum";
import CourseFAQ from "../../components/CourseFAQ";

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      <div className="mesh-bg"></div>
      <div className="fixed top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl -z-10"></div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 relative z-10">
        {/* Hero Section */}
        <div className="glass-panel rounded-5xl p-2 mb-16 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
          <div className="flex flex-col-reverse lg:flex-row items-stretch gap-0 rounded-4xl bg-white/20 dark:bg-white/5 overflow-hidden backdrop-blur-sm">
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="bg-emerald-100/80 dark:bg-emerald-900/30 backdrop-blur-md text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-700">
                  فرانت‌اند
                </span>
                <span className="bg-amber-100/80 dark:bg-amber-900/30 backdrop-blur-md text-amber-700 dark:text-amber-300 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border border-amber-200 dark:border-amber-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] filled">
                    star
                  </span>
                  ۴.۹
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.2] mb-8">
                متخصص{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary-dark to-emerald-500 drop-shadow-sm">
                  React
                </span>{" "}
                و{" "}
                <span className="relative inline-block">
                  Next.js
                  <svg
                    className="absolute w-full h-3 -bottom-1 right-0 text-primary opacity-60"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 10"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                    ></path>
                  </svg>
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-medium leading-loose max-w-xl mb-10">
                مسیر صفر تا صد ورود به بازار کار جهانی. یادگیری عمیق هوک‌ها،
                SSR، و معماری مدرن وب با جدیدترین نسخه Next.js 14.
              </p>
              <div className="flex flex-wrap items-center gap-6 md:gap-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center text-primary shadow-sm border border-white dark:border-gray-700">
                    <span className="material-symbols-outlined text-2xl">
                      school
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">
                      سطح دوره
                    </span>
                    <span className="font-extrabold text-gray-900 dark:text-white">
                      پیشرفته
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center text-primary shadow-sm border border-white dark:border-gray-700">
                    <span className="material-symbols-outlined text-2xl">
                      schedule
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">
                      مدت زمان
                    </span>
                    <span className="font-extrabold text-gray-900 dark:text-white">
                      ۶۵ ساعت
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[400px] lg:min-h-auto relative group/video cursor-pointer overflow-hidden rounded-4xl lg:rounded-l-none lg:rounded-r-4xl m-2 lg:m-0 lg:ml-2">
              <Image
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/video:scale-105"
                alt="Course Preview"
                src="/images/course3.jpg"
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-emerald-900/20 dark:bg-emerald-900/40 mix-blend-multiply transition-colors group-hover/video:bg-emerald-900/10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
                  <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl"></div>
                  <div className="size-24 rounded-full bg-white/10 backdrop-blur-lg border border-white/50 flex items-center justify-center group-hover/video:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(34,197,94,0.8)]">
                    <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center pl-1 shadow-lg">
                      <span className="material-symbols-outlined text-4xl filled">
                        play_arrow
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 right-8 left-8 z-20">
                <div className="bg-black/40 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex items-center justify-between text-white shadow-lg">
                  <div className="flex flex-col">
                    <span className="text-xs text-white/70 mb-1">
                      جلسه اول رایگان
                    </span>
                    <span className="font-bold text-base">
                      آشنایی با اکوسیستم React
                    </span>
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1.5 rounded-xl font-mono dir-ltr">
                    05:34
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* About Section */}
            <section className="glass-panel rounded-4xl p-8 md:p-12 glass-card-hover">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900/30 to-white dark:to-gray-800 flex items-center justify-center text-primary shadow-sm border border-white/50 dark:border-gray-700">
                  <span className="material-symbols-outlined filled text-2xl">
                    description
                  </span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                  درباره این دوره
                </h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-9 font-medium">
                <p className="mb-4">
                  این دوره حاصل تجربه‌ی سال‌ها کار بر روی پروژه‌های بزرگ مقیاس
                  است. هدف ما صرفاً آموزش سینتکس نیست، بلکه انتقال{" "}
                  <span className="text-primary font-bold bg-primary/10 dark:bg-primary/20 px-1 rounded">
                    طرز تفکر مهندسی
                  </span>{" "}
                  است.
                </p>
                <p>
                  در طول این مسیر، شما با چالش‌های واقعی روبرو می‌شوید. از
                  بهینه‌سازی پرفرمنس گرفته تا مدیریت state‌های پیچیده با Redux
                  Toolkit و پیاده‌سازی Authentication امن در Next.js. این یک
                  دوره تئوری نیست؛ یک شبیه‌ساز محیط کار است.
                </p>
              </div>
            </section>

            {/* Curriculum Section */}
            <CourseCurriculum totalLessons={120} />

            {/* FAQ Section */}
            <CourseFAQ />

            {/* Instructor Section */}
            <section className="glass-panel rounded-4xl p-8 md:p-12 glass-card-hover mt-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                <div className="relative shrink-0 group">
                  <div className="size-40 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <Image
                      className="w-full h-full object-cover"
                      alt="Instructor"
                      src="/images/inst1.jpg"
                      width={160}
                      height={160}
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <Image
                      alt="TS"
                      className="size-8"
                      src="/images/inst4.jpg"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    امیررضا رضایی
                  </h3>
                  <span className="text-primary font-bold block mb-4">
                    توسعه‌دهنده ارشد در اسنپ
                  </span>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-6">
                    عاشق جاوااسکریپت و یادگیری مستمر. در این سال‌ها به بیش از
                    ۵۰۰۰ دانشجو کمک کرده‌ام تا با اعتماد به نفس وارد دنیای
                    حرفه‌ای برنامه‌نویسی شوند. تمرکز من بر روی انتقال تجربیات
                    واقعی بازار کار است.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a
                      className="px-6 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold text-sm shadow-sm transition-colors border border-white dark:border-gray-700"
                      href="#"
                    >
                      مشاهده رزومه
                    </a>
                    <div className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-bold text-sm border border-primary/20 dark:border-primary/30">
                      <span className="material-symbols-outlined text-lg filled">
                        stars
                      </span>
                      <span>مدرس برگزیده سال</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 relative z-20">
            <div className="sticky top-28 space-y-6">
              {/* Price Card */}
              <div className="glass-panel rounded-4xl p-8 border border-white/80 dark:border-gray-700 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 size-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center mb-8">
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 line-through decoration-red-500 decoration-2 mb-2">
                      ۶,۰۰۰,۰۰۰ تومان
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                        ۴,۵۰۰,۰۰۰
                      </span>
                      <span className="text-lg font-bold text-primary">
                        تومان
                      </span>
                    </div>
                    <span className="mt-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-red-500/30">
                      ۲۰٪ تخفیف محدود
                    </span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-primary to-emerald-400 text-white text-xl font-black py-6 rounded-[2rem] shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 group/btn border border-white/20 relative overflow-hidden">
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                    <span className="material-symbols-outlined text-[28px] relative z-10">
                      local_mall
                    </span>
                    <span className="relative z-10">ثبت‌نام در دوره</span>
                  </button>
                  <p className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 mt-5 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      verified_user
                    </span>
                    گارانتی بازگشت وجه تا ۳۰ روز
                  </p>
                </div>
              </div>

              {/* Features Card */}
              <div className="glass-panel rounded-4xl p-8 border border-white/60 dark:border-gray-700">
                <h4 className="font-black text-gray-900 dark:text-white text-lg mb-6 px-2 border-r-4 border-primary rounded-r">
                  ویژگی‌های متمایز
                </h4>
                <ul className="space-y-5">
                  <li className="flex items-center gap-4 text-gray-700 dark:text-gray-300 font-bold text-sm">
                    <span className="size-10 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-primary-dark dark:text-primary flex items-center justify-center shrink-0 border border-primary/20 dark:border-primary/30">
                      <span className="material-symbols-outlined text-[20px]">
                        all_inclusive
                      </span>
                    </span>
                    دسترسی همیشگی به آپدیت‌ها
                  </li>
                  <li className="flex items-center gap-4 text-gray-700 dark:text-gray-300 font-bold text-sm">
                    <span className="size-10 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-blue-500 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/30">
                      <span className="material-symbols-outlined text-[20px]">
                        workspace_premium
                      </span>
                    </span>
                    مدرک معتبر و قابل ترجمه
                  </li>
                  <li className="flex items-center gap-4 text-gray-700 dark:text-gray-300 font-bold text-sm">
                    <span className="size-10 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-purple-500 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/30">
                      <span className="material-symbols-outlined text-[20px]">
                        forum
                      </span>
                    </span>
                    پشتیبانی اختصاصی در دیسکورد
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white rounded-t-[4rem] mt-12 pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl font-bold">
                  terminal
                </span>
              </div>
              <span className="text-2xl font-black">آکادمی کد</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">
              تخصصی‌ترین مرکز آموزش برنامه‌نویسی در ایران با هدف تربیت نیروهای
              حرفه‌ای برای بازارهای جهانی.
            </p>
            <div className="flex gap-4">
              <a
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1"
                href="#"
              >
                <span className="material-icons-round">alternate_email</span>
              </a>
              <a
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1"
                href="#"
              >
                <span className="material-icons-round">camera_alt</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-black text-xl mb-8 border-r-4 border-primary pr-4">
              دسترسـی
            </h4>
            <ul className="space-y-5 text-gray-400 font-medium">
              <li>
                <Link
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="/courses"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  دوره‌ها
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  مسیرهای یادگیری
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  وبلاگ آموزشی
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  داستان موفقیت
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xl mb-8 border-r-4 border-primary pr-4">
              پشتیبانی
            </h4>
            <ul className="space-y-5 text-gray-400 font-medium">
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  درباره ما
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  ارتباط با ما
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  سوالات متداول
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  قوانین و مقررات
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xl mb-8 border-r-4 border-primary pr-4">
              تماس بـا مـا
            </h4>
            <div className="space-y-6 text-gray-400">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">
                  location_on
                </span>
                <p className="text-sm">
                  تهران، خیابان آزادی، کارخانه نوآوری، ساختمان آکادمی کد
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">
                  call
                </span>
                <p className="text-lg font-black dir-ltr text-right">
                  ۰۲۱-۹۱۰۰۱۰۰۰
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">
                  mail
                </span>
                <p className="text-sm">support@codeacademy.ir</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-6">
          <p>تمامی حقوق مادی و معنوی برای آکادمی کد محفوظ است © ۱۴۰۳</p>
          <div className="flex gap-10">
            <a className="hover:text-white transition-colors" href="#">
              حریم خصوصی
            </a>
            <a className="hover:text-white transition-colors" href="#">
              شرایط استفاده
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
