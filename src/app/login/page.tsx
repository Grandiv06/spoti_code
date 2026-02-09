import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود با شماره موبایل - آکادمی برنامه‌نویسی",
  description: "ورود به حساب کاربری با شماره موبایل",
};

export default function LoginPage() {
  return (
    <div className="bg-auth-modern min-h-screen flex flex-col relative overflow-x-hidden text-gray-800 dark:text-gray-200">
      {/* Blobs */}
      <div className="blob-auth bg-green-200/60 dark:bg-green-900/30 w-96 h-96 top-0 -right-20 animate-pulse" />
      <div className="blob-auth bg-green-300/40 dark:bg-green-800/20 w-[30rem] h-[30rem] bottom-0 -left-20" />


      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[460px] bg-white dark:bg-gray-800/95 rounded-[2.5rem] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-xl border border-white/60 dark:border-gray-700/50 backdrop-blur-sm relative">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                ورود به حساب کاربری
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
                برای استفاده از خدمات آکادمی، شماره موبایل خود را وارد کنید
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
              <button
                type="submit"
                className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
              >
                <span>دریافت کد تایید</span>
              </button>
            </form>

            <div className="mt-8 space-y-5 text-center">

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
                  حساب کاربری ندارید؟{" "}
                  <Link
                    href="/register"
                    className="text-[#00c853] dark:text-green-400 font-black hover:underline decoration-2 underline-offset-4 mr-1"
                  >
                    ایجاد حساب
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-gray-400 text-xs font-medium dir-ltr">
          © 2024 Programming Academy
        </p>
      </footer>
    </div>
  );
}
