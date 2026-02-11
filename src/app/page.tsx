import Image from "next/image";
import Link from "next/link";

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
                  className="bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-text-light dark:text-white px-10 py-5 rounded-4xl text-lg font-extrabold transition-all shadow-lg flex items-center justify-center gap-3 border border-gray-100 dark:border-gray-700"
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
        <section className="py-24 bg-gray-50 dark:bg-transparent">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-4">نظرات دانشجویان ما</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-20 text-lg">
              بشنوید از کسانی که این مسیر را با موفقیت پیموده‌اند.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white dark:bg-surface-dark p-10 rounded-4xl shadow-xl relative mt-8">
                <Image
                  alt="Student"
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg absolute -top-10 left-1/2 -translate-x-1/2"
                  src="/images/student1.jpg"
                  width={80}
                  height={80}
                />
                <p className="text-gray-600 dark:text-gray-400 leading-loose italic mt-6">
                  &quot;پروژه‌های عملی این آکادمی باعث شد ترس من از کدنویسی
                  بریزه و الان در یک شرکت معتبر مشغولم.&quot;
                </p>
                <h4 className="font-bold text-xl mt-6">سهراب امینی</h4>
                <span className="text-primary text-sm font-bold">
                  توسعه‌دهنده React
                </span>
              </div>
              <div className="bg-primary p-10 rounded-4xl shadow-2xl shadow-primary/30 relative scale-105 z-10 text-white">
                <Image
                  alt="Student"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg absolute -top-12 left-1/2 -translate-x-1/2"
                  src="/images/student2.jpg"
                  width={96}
                  height={96}
                />
                <p className="leading-loose italic mt-8 text-white/90">
                  &quot;بهترین تصمیمی که برای آینده‌ام گرفتم شرکت در دوره موبایل
                  بود. منتورها واقعاً دلسوزانه کمک می‌کنند.&quot;
                </p>
                <h4 className="font-black text-2xl mt-6">سارا رضایی</h4>
                <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold mt-2 inline-block">
                  توسعه‌دهنده موبایل
                </span>
              </div>
              <div className="bg-white dark:bg-surface-dark p-10 rounded-4xl shadow-xl relative mt-8">
                <Image
                  alt="Student"
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg absolute -top-10 left-1/2 -translate-x-1/2"
                  src="/images/student3.jpg"
                  width={80}
                  height={80}
                />
                <p className="text-gray-600 dark:text-gray-400 leading-loose italic mt-6">
                  &quot;محتوای آموزشی بسیار به‌روز و با کیفیت هست. پشتیبانی ۲۴
                  ساعته واقعاً یک مزیت بزرگه.&quot;
                </p>
                <h4 className="font-bold text-xl mt-6">نیما حسینی</h4>
                <span className="text-primary text-sm font-bold">
                  متخصص دیتاساینس
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white rounded-t-[4rem] mt-12 pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Image
                src="/favicon.svg"
                alt="اسپاتی‌کد"
                width={15}
                height={15}
                className="w-8 h-8 group-hover:scale-110 transition-transform"
              />
              <span className="text-2xl font-black">اسپاتی کد</span>
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
                <a
                  className="hover:text-primary transition-colors flex items-center gap-2"
                  href="#"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  دوره‌ها
                </a>
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
