import Image from "next/image";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body transition-colors duration-300">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob-shape bg-primary/20 w-96 h-96 rounded-full top-0 right-0 -translate-y-1/2 translate-x-1/2 dark:bg-primary/10"></div>
        <div className="blob-shape bg-blue-400/20 w-80 h-80 rounded-full bottom-0 left-0 translate-y-1/2 -translate-x-1/2 dark:bg-blue-600/10"></div>
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 glass-header border-b border-white/20 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined font-bold">
                  terminal
                </span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                اسپاتی<span className="text-primary">کد</span>
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <a
                className="px-5 py-2 text-sm font-bold rounded-4xl bg-primary/10 text-primary transition-all"
                href="/"
              >
                خانه
              </a>
              <a
                className="px-5 py-2 text-sm font-medium rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 hover:text-primary"
                href="/courses"
              >
                دوره‌ها
              </a>
              <a
                className="px-5 py-2 text-sm font-medium rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 hover:text-primary"
                href="#"
              >
                مسیر یادگیری
              </a>
              <a
                className="px-5 py-2 text-sm font-medium rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 hover:text-primary"
                href="/about"
              >
                درباره ما
              </a>
              <a
                className="px-5 py-2 text-sm font-medium rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 hover:text-primary"
                href="#"
              >
                ارتباط با ما
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              className="hidden md:flex bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-4xl text-sm font-bold transition-all shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 items-center gap-2"
              href="#"
            >
              ورود / ثبت‌نام
              <span className="material-symbols-outlined text-xl">login</span>
            </a>
            <button className="lg:hidden p-3 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </nav>
      </header>

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
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAazZSzTe3MdhTzPF3dHu5a6qk3uJvliezBsbiDS3J6kmbeMjRET2LFFgodqE-LJZCWx1AB2FQ9ff40jaoL-3sdL1D31YU7tiI16JUMc-SxIANn7-Wqr4Y4UlAJZ1616qaBJTNEFT4YDLkK8ZSEGecrKibdo7A13LPmBPOqL4AWRAOm2J__H_Csu3wbl88JoKaI9GtSuvhOWwzzMRVmtfp7pN8xVgW1-HhJmePeASf2FacBQ01gBsbVCkcvaQEZ4T9RXwxNVKHJfY6f"
                    width={48}
                    height={48}
                  />
                  <Image
                    alt="User"
                    className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhZjlbzi0KH6Wc7h8OA-Cc_Xj8c9-6WhzM_W4HCaeUFUOOmGyFYuQwii6uHEo724TYDLAMJj0OdQwJ-WtDiia8g6EnTj-yA8o85_qQreW-eBJpQKHD4aO1GKcBPRNSOQeTn9WkyIC9zwDo-1EUcyM_2gZzYG768GNRAQgDOa4ncQuKfisUESSr4LLLviJE5CcQroYqkm70XPUxP3Z5UARAmIjSENSbAZSYMws7udJ5Od_xVL0zpLfXC7PQSR9czdBcCi7adN5roKef"
                    width={48}
                    height={48}
                  />
                  <Image
                    alt="User"
                    className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-md"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZzvndaxs8tWctegXESOt8G2Sr-B4h_6eK7iWg3kDFqTY6rpYKsU_L-lEMpL8I2xIyYN-F9v_XHqxxzW3pqXn048bQ6kcgSGqhzSASgHbI8U_viS-5EC-k6IaCLpyjYwZ3R3vRvB9PmjWziTLp1iK4phbkmxcmqTit5dDQmW09UMMunD6AObFRj1GrNPDjmHxpE60Hrr2Bf5FnyzhwK55t776K9raMzDGPW8Q83dpreAv9e5sFP4D8oHapuRtY5n1g8XFeyB5zvgVq"
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBGwIz3RE15OuWqY3np5mw1yisfwiNcY8K57Nce439EBABYm3Xcw2nEvmBbnqHNQkeY1O1_fC57JSTlKYFjCkfbuyk2uUeSd4vWMt1gpXGT5DnFiBtWg_Ld6ry6bvUNXZo0B4rxCCG2X1C0vhRQGoAodnqHYleM02CjAd3fLz2lppGur5EAicFs18-8dD_7yWjiDgMz_hh0CfTJJnuv1KIxcmD1FVlw1CfUJMfr8ZpZBd1EeTJTdFMhbG9EuyHvojHVHrLLebGhYpO"
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
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="glass-card rounded-4xl p-12 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_-12px_rgba(34,197,94,0.18)] dark:shadow-none border border-white dark:border-gray-800 hover:-translate-y-3 transition-all duration-500 group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-900/20 rounded-4xl flex items-center justify-center mb-8 text-primary shadow-inner group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-6xl font-light">
                    school
                  </span>
                </div>
                <h3 className="text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                  ۱۰,۰۰۰+
                </h3>
                <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
                  دانشجوی مستعد
                </p>
              </div>
              <div className="glass-card rounded-4xl p-12 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_-12px_rgba(34,197,94,0.18)] dark:shadow-none border border-white dark:border-gray-800 hover:-translate-y-3 transition-all duration-500 group">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-900/20 rounded-4xl flex items-center justify-center mb-8 text-blue-500 shadow-inner group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-6xl font-light">
                    menu_book
                  </span>
                </div>
                <h3 className="text-6xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">
                  ۵۰+
                </h3>
                <p className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-6">
                  دوره تخصصی
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-4xl text-sm font-black border border-blue-500/20">
                  <span className="material-symbols-outlined text-lg">
                    timer
                  </span>
                  ۱۵۰۰+ ساعت محتوا
                </div>
              </div>
              <div className="glass-card rounded-4xl p-12 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_-12px_rgba(34,197,94,0.18)] dark:shadow-none border border-white dark:border-gray-800 hover:-translate-y-3 transition-all duration-500 group">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-900/20 rounded-4xl flex items-center justify-center mb-8 text-purple-500 shadow-inner group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-6xl font-light">
                    support_agent
                  </span>
                </div>
                <h3 className="text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                  ۲۴/۷
                </h3>
                <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
                  پشتیبانی اختصاصی
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrf1RdMrodFjhWJh-iK0XhouvsguIc_tqt1eWfmtW3mlexRVf7sjoWuI1x5IZhQ_gGygXex_D75Z8Gb4m1jNnP21y21f7eAriTeXNUGubdtVgFMN8AsNoTcD778AyQvO07-blnfK4wJptF2aQaiO545okVeIJJOJYSe_oW3I9W6xvJb--Zo2ngO0C8LX8Xii18oga40DOPc0xTC8Q0-g4H8ScMBysCL2_5SNcMWbHYPU7MNS-zF_ehST9IpneJvGx0r6JcuDIAGrYG"
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SOsEeQSj_gKZRlFLcvtfLiORWOblAq9GHZkXeH1i8LD1wdGmu27BM3y3BbYzz7yLk4SJXNM-Dnbe5Ep0xW2NeGOU-AYO-mNcl4PQNUu7pzG8rQ4OaWpmZ6PVNwfgjXeusQ8t_Q3pQ4bdTf25pxvnoKeDidCF6BsDT09ldAYoaFsF-qJ57-K2b34YgtcXa-r2N9KoR9l0D0Th8PSGkJwfXQOT-ceVI1e24ifGlVlm4PLRR8NpCRSmSh7pLDDzCy7fuS-AZflC8wsR"
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqLxI5l9LptlDqcl0isYj3mv3ijPcEak2a_0B9KGXDgpWeUhLqT9ZOo0VPRVbS5RWuRe9NoFAMrLpRotrUiE7kbg9AUfefCiItSixRrYQaAPwE15VNOQ2_bFaQfOOsOLsgCEZILMAcB7YUOE9g2-KIRX0movKlctPaGhr5OvTKGBYzxSUczp3OXnUIXsZb22C2iNZhoLs43irP4mtL8810m4KPk4S-qDYe9mVm4o-fizV_u2z7BBs8vzfcf6lu8aAWCv92egcw6ALl"
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
