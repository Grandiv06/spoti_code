import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود با رمز عبور - آکادمی برنامه‌نویسی",
  description: "ورود به حساب کاربری با رمز عبور",
};

export default function LoginPasswordPage() {
  return (
    <div className="bg-auth-grid min-h-screen flex flex-col relative overflow-x-hidden text-gray-800 dark:text-gray-200">
      <div className="blob-auth bg-green-200/60 dark:bg-green-900/30 w-96 h-96 top-0 -right-20 animate-pulse" />
      <div className="blob-auth bg-green-300/40 dark:bg-green-800/20 w-[30rem] h-[30rem] bottom-0 -left-20" />

      <header className="w-full relative z-10 py-6 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-[#00c853] h-10 w-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">
              آکادمی برنامه‌نویسی
            </h2>
          </Link>
          <div className="hidden sm:flex gap-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
            <Link href="/courses" className="hover:text-[#00c853] dark:hover:text-green-400 transition-colors">
              دوره‌ها
            </Link>
            <Link href="#" className="hover:text-[#00c853] dark:hover:text-green-400 transition-colors">
              مقالات
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[460px] bg-white dark:bg-gray-800/95 rounded-[2.5rem] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-xl border border-white/60 dark:border-gray-700/50 backdrop-blur-sm relative">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                ورود با رمز عبور
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
                شماره موبایل و رمز عبور خود را وارد کنید
              </p>
            </div>

            <form className="space-y-6" action="#" method="post">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1"
                >
                  شماره تلفن
                </label>
                <div className="relative group">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    dir="ltr"
                    className="w-full h-14 px-6 pr-14 rounded-[2.5rem] border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00c853]/20 focus:border-[#00c853] focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-lg tracking-wider text-left"
                    placeholder="0912 345 6789"
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
                    smartphone
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1"
                >
                  رمز عبور
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full h-14 px-6 pr-14 rounded-[2.5rem] border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00c853]/20 focus:border-[#00c853] focus:bg-white dark:focus:bg-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-lg"
                    placeholder="رمز عبور"
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
                    lock
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
              >
                <span>ورود</span>
              </button>
            </form>

            <div className="mt-8 space-y-5 text-center">
              <div>
                <Link
                  href="/login"
                  className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#00c853] dark:hover:text-green-400 transition-colors inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">smartphone</span>
                  ورود با شماره موبایل
                </Link>
              </div>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-400 font-medium">
                    یا
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                  هنوز حساب کاربری ندارید؟{" "}
                  <Link
                    href="/register"
                    className="text-[#00c853] dark:text-green-400 font-black hover:underline decoration-2 underline-offset-4 mr-1"
                  >
                    ثبت‌نام
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
