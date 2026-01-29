import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function CoursesPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body transition-colors duration-300 relative overflow-x-hidden min-h-screen">
      <div className="mesh-bg"></div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 glass-header border-b border-white/20 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined font-bold">
                  terminal
                </span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                اسپاتی<span className="text-primary">کد</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              <Link
                className="px-5 py-2 text-sm font-medium rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 hover:text-primary"
                href="/"
              >
                خانه
              </Link>
              <Link
                className="px-5 py-2 text-sm font-bold rounded-4xl bg-primary/10 text-primary transition-all"
                href="/courses"
              >
                دوره‌ها
              </Link>
              <Link
                className="px-5 py-2 text-sm font-medium rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 hover:text-primary"
                href="#"
              >
                مسیر یادگیری
              </Link>
              <Link
                className="px-5 py-2 text-sm font-medium rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 hover:text-primary"
                href="/about"
              >
                درباره ما
              </Link>
              <Link
                className="px-5 py-2 text-sm font-medium rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 hover:text-primary"
                href="#"
              >
                ارتباط با ما
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              className="hidden md:flex bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-4xl text-sm font-bold transition-all shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 items-center gap-2"
              href="#"
            >
              ورود / ثبت‌نام
              <span className="material-symbols-outlined text-xl">login</span>
            </Link>
            <button className="lg:hidden p-3 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-20 py-12 relative z-10">
        {/* Breadcrumb and Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-bold">
              <Link className="hover:text-primary transition-colors" href="/">
                خانه
              </Link>
              <span className="material-symbols-outlined text-xs">
                chevron_left
              </span>
              <span className="text-text-light dark:text-white">
                دوره‌های وب
              </span>
            </div>
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
                      24
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

              {/* Level */}
              <div className="mb-10">
                <p className="text-xs font-black text-gray-400 mb-5 uppercase tracking-widest px-2">
                  سطح دوره
                </p>
                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer">
                    <input
                      defaultChecked
                      className="peer sr-only"
                      name="level"
                      type="radio"
                    />
                    <div className="text-sm px-5 py-4 rounded-3xl border border-transparent bg-white/40 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-bold hover:bg-white/60 hover:shadow-sm transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary flex items-center justify-between">
                      <span>همه سطوح</span>
                      <div className="w-3 h-3 rounded-full bg-gray-300 peer-checked:bg-primary shadow-sm"></div>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input className="peer sr-only" name="level" type="radio" />
                    <div className="text-sm px-5 py-4 rounded-3xl border border-transparent bg-white/40 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-bold hover:bg-white/60 hover:shadow-sm transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary flex items-center justify-between">
                      <span>مقدماتی</span>
                      <div className="w-3 h-3 rounded-full bg-gray-300 peer-checked:bg-primary shadow-sm"></div>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input className="peer sr-only" name="level" type="radio" />
                    <div className="text-sm px-5 py-4 rounded-3xl border border-transparent bg-white/40 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-bold hover:bg-white/60 hover:shadow-sm transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary flex items-center justify-between">
                      <span>پیشرفته</span>
                      <div className="w-3 h-3 rounded-full bg-gray-300 peer-checked:bg-primary shadow-sm"></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-xs font-black text-gray-400 mb-5 uppercase tracking-widest px-2">
                  محدوده قیمت
                </p>
                <div className="px-2">
                  <input
                    className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-dark transition-all"
                    type="range"
                  />
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-500">
                    <span>رایگان</span>
                    <span>۵۰ میلیون تومان</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Course Card 1 */}
              <div className="group flex flex-col glass-premium rounded-4xl border border-white/40 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]">
                <div className="relative h-64 overflow-hidden rounded-t-4xl isolate">
                  <Image
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Modern workspace with code on monitor"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc49PM7jv0TAyt2M6g0rPORbBPnROb4uEehDRs7HG74pWFGVpKmtho5YveesNwMWo8VXq9XG-VeRxR2Kp-Rfw-JXQijDnjY56abTYQ7iP2JJQmpF7jyc_fIx0rqUCeefKUoAMJGlPhLwxJaipxy9v17D32ShQOXvPHguh9wMIsQlhedGMqU50s1_7JTUNS1cirfdSCgWaqjYsS_cFtck9E64skPAq-yY6g3M7kEbEeClYzJ9IhI821kBzTba5LMKVRGb4vVqOckMay"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                    <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                      پیشرفته
                    </span>
                    <div className="flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 flex items-center justify-center transition-all shadow-lg">
                        <span className="material-symbols-outlined text-[20px]">
                          favorite
                        </span>
                      </button>
                      <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-blue-500 flex items-center justify-center transition-all shadow-lg">
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
                        alt="Instructor portrait"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm_bq93_om11KQbxen09lrL0WuPW2RmtceC9FQXQk6JGF6Y-z3e4Lycw4nqbqMHf_BLpkqrJ_Ly2raDLElsvKtnNwbImG1k7yHSbSd-aj-tKQ2rimk0KfNSigR45Jz8EXsIu0OlxCd7SsuJXxQmSs6pAsSoZK3bop6AcT1qHFxEwmV-WuNqjySMwq0CAPcwpR51ByrfDDyheTh6cDdk_EQblC6V8-41nRFP94dQclqTQPEZ1YPHX5mcTjmskhrcFc3ZKrtPqwZ_nto"
                        width={32}
                        height={32}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-bold">
                      امیررضا رضایی
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                    دوره جامع متخصص React.js و Next.js برای بازار کار
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-8">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>
                      <span>۴۸ ساعت</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        groups
                      </span>
                      <span>۱,۲۴۰ دانشجو</span>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50 dark:border-white/5">
                    <span className="bg-primary/10 text-primary-dark dark:text-primary px-5 py-2.5 rounded-2xl font-black text-sm">
                      ۴,۵۰۰,۰۰۰{" "}
                      <span className="text-[10px] opacity-80 font-bold mr-1">
                        تومان
                      </span>
                    </span>
                    <Link
                      href="/courses/react-nextjs"
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

              {/* Course Card 2 */}
              <div className="group flex flex-col glass-premium rounded-4xl border border-white/40 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]">
                <div className="relative h-64 overflow-hidden rounded-t-4xl isolate">
                  <Image
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Abstract code blocks on dark background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzPJRMEmaq6EH8R50vA9qjGAlhgETXatorf4f-Ul3X1LZYECqkk0JXFpNKHRTrfgghkw_5Az346whqrMcpe9oyC61C4fp6MNzvbuxWOvsvpqXPsYUuwzBRcnPomHra3VhDsVDhE4rF7gjcDonHdbS-jcU9lRxlEp0b5s_53ZQcLhep14FIbVJ1BbLmxnKc-hbGkl9GJAdKYC0H29AfO14GXww8ej91u9cEXObz6jGXVemo2dduzhWgL1nYBY2GtUe4iJOrkCHxNVhw"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                    <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                      متوسط
                    </span>
                    <div className="flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 flex items-center justify-center transition-all shadow-lg">
                        <span className="material-symbols-outlined text-[20px]">
                          favorite
                        </span>
                      </button>
                      <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-blue-500 flex items-center justify-center transition-all shadow-lg">
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
                        alt="Instructor portrait"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTo48yWCkbbL4AUX4ph1xh7BO27nQI6Wc3mSVwkc3CYlvs6oy6jfaVubgLkdQBEengKR7tNh68jE1ws5CuCDu1LPUY6C-EtYkwEhcwToXDBvo2OZ4BKKVVn0aqkG47sEDE86wz0_zHeSzKKV8bygulsasrRryc7Nnc5WEBiOtpoVFGoDs1MfjCazxG75QCpOh01ZfPW2jV7sJYGwUP-dysGuVxs01jfAKIS30R7UjLJFtANaMDkANjBaRqM2IMVmQxHTc6VbAdBcnl"
                        width={32}
                        height={32}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-bold">
                      سارا محمدی
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                    استادی در Node.js و معماری Microservices پیشرفته
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-8">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>
                      <span>۳۵ ساعت</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        groups
                      </span>
                      <span>۸۹۰ دانشجو</span>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50 dark:border-white/5">
                    <span className="bg-primary/10 text-primary-dark dark:text-primary px-5 py-2.5 rounded-2xl font-black text-sm">
                      ۳,۸۰۰,۰۰۰{" "}
                      <span className="text-[10px] opacity-80 font-bold mr-1">
                        تومان
                      </span>
                    </span>
                    <Link
                      href="/courses/react-nextjs"
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

              {/* Course Card 3 */}
              <div className="group flex flex-col glass-premium rounded-4xl border border-white/40 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]">
                <div className="relative h-64 overflow-hidden rounded-t-4xl isolate">
                  <Image
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Laptop with programming code"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3JkfhbK69ePR81B0wvBcL3LmRuDBmfB-lBcQivncJqyqpxQBUp84QjceFJT3fiNBlfTLR-x9fKCXfTwN_NAruzXtSM0dSHQ_HIl2-cgLqLkbVzD_qVWLV90WVMT99esxlpc0yaz0TdmBs2JbZzDG78sUCmJOg9MM9fq9wVOFnjv5djcg_Hb-oOPknbB8QNLFCi568dFbFbSl9uI1R5K09ut0S-HjkXuBqFvzELvATnBfIyq1X3mrkpw0zZD1gpj9nn_Vnfo1IZkj2"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                    <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                      مقدماتی
                    </span>
                    <div className="flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 flex items-center justify-center transition-all shadow-lg">
                        <span className="material-symbols-outlined text-[20px]">
                          favorite
                        </span>
                      </button>
                      <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-blue-500 flex items-center justify-center transition-all shadow-lg">
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
                        alt="Instructor portrait"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxm84iyo35eMZfxun4pcwru8Vjqh9Z0CM1BT1KMucM3D5cSkFwv-gh0CtNtL34Znf17icDy1IAGW32f-DV67azOtohwLsT8ySk9NQl1JQv-MhRegYfJqqb0M_eOkDgN2uqWHK1X7twW_OC9FWYk-K57MVCr4rdPDDERZZK-q3CsTdCKJzUGEcehJfnMtekHOlErA97u2iRtqCBnIA28bnLZ80nLcvjBCmMQaLpBg8LBR79RMPZutojDcRwsBZniAwCC7Bd5kP8OsPU"
                        width={32}
                        height={32}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-bold">
                      نیما علوی
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                    بوت‌کمپ صفر تا صد طراحی وب (Fullstack)
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-8">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>
                      <span>۶۰ ساعت</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        groups
                      </span>
                      <span>۲,۱۰۰ دانشجو</span>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50 dark:border-white/5">
                    <span className="bg-primary/10 text-primary-dark dark:text-primary px-5 py-2.5 rounded-2xl font-black text-sm">
                      ۵,۹۰۰,۰۰۰{" "}
                      <span className="text-[10px] opacity-80 font-bold mr-1">
                        تومان
                      </span>
                    </span>
                    <Link
                      href="/courses/react-nextjs"
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

              {/* Course Card 4 */}
              <div className="group flex flex-col glass-premium rounded-4xl border border-white/40 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.15)]">
                <div className="relative h-64 overflow-hidden rounded-t-4xl isolate">
                  <Image
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Developer coding on laptop"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT_9VUIMGffSoKrMo2QF8H7UdHkYMN2oMsJu0WcMcMrrtaG8OqWDulwvU52a9msDgCP3GfAg0R1Dx7Mvq08eT0mPDH74fK9vdvN8i6Ex11v-D8ED9LNrkAbM0EyfXoQKiMDx8xMUaCbJBBnTxcvFJh8wbZJ40wqqoBHHUubV6rC6IxOKNBt9K0Tt5E_U9rIsBnyfKi9HsJyTd8dK9DVmhbcLSFThtuLn1PxaMWBG6ttKSelwM5S1MUFmXPBpB2XNIgXtbaoZC2I90W"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                    <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                      متوسط
                    </span>
                    <div className="flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 flex items-center justify-center transition-all shadow-lg">
                        <span className="material-symbols-outlined text-[20px]">
                          favorite
                        </span>
                      </button>
                      <button className="size-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-blue-500 flex items-center justify-center transition-all shadow-lg">
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
                        alt="Instructor portrait"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOqH7DCb3-JLBZI7COh_kM5CI95F9LAdm9LYvOVPVm5BZwXclKHzqau-u_oxRCE_T25kS6DZAn5T0yo9oOb8AkCyJeCRzrU-lkwZL-C6MzeK2yxDRIOmVmSHMkdm41c_mzWSNUAOsuHEDmaYZ_20_y_XFolSeawmMWoVRAXq47GKWwAovy-B9g9ZNbT2Evy5o2EpUysMiW9aL46E70WucdsHm97kS5DRrZ2hhknzwre_CdOMvtiWMLVGwzHbp9O5zxAsMnxboe76VW"
                        width={32}
                        height={32}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-bold">
                      مهرداد حیدری
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                    آموزش Tailwind CSS و طراحی رابط کاربری مدرن
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-8">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>
                      <span>۱۲ ساعت</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        groups
                      </span>
                      <span>۳۴۰ دانشجو</span>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100/50 dark:border-white/5">
                    <span className="bg-primary/10 text-primary-dark dark:text-primary px-5 py-2.5 rounded-2xl font-black text-sm">
                      ۱,۲۰۰,۰۰۰{" "}
                      <span className="text-[10px] opacity-80 font-bold mr-1">
                        تومان
                      </span>
                    </span>
                    <Link
                      href="/courses/react-nextjs"
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
            </div>

            {/* Pagination */}
            <div className="mt-24 flex justify-center gap-4">
              <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background-dark transition-all duration-300 backdrop-blur-md shadow-lg group">
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>
              <button className="size-16 rounded-full bg-primary text-background-dark font-black text-xl flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.5)] scale-110">
                ۱
              </button>
              <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-colors font-bold backdrop-blur-md shadow-lg">
                ۲
              </button>
              <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-colors font-bold backdrop-blur-md shadow-lg">
                ۳
              </button>
              <button className="size-16 rounded-full border border-white/60 bg-white/40 dark:bg-white/5 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-background-dark transition-all duration-300 backdrop-blur-md shadow-lg group">
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  chevron_left
                </span>
              </button>
            </div>
          </div>
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
