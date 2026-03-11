export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <h2 className="text-lg font-black">تنظیمات پنل ادمین</h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">تنظیمات عمومی، امنیت، اعلان‌ها و قوانین دسترسی</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
          <h3 className="text-sm font-bold">تنظیمات عمومی</h3>
          <label className="block text-sm">
            <span className="mb-1 block text-xs text-gray-500">نام پلتفرم</span>
            <input defaultValue="Spoticode Academy" className="w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 outline-none dark:border-gray-800" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs text-gray-500">ایمیل پشتیبانی</span>
            <input defaultValue="support@spoticode.ir" className="w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 outline-none dark:border-gray-800" />
          </label>
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white">ذخیره تنظیمات</button>
        </div>

        <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
          <h3 className="text-sm font-bold">امنیت و دسترسی</h3>
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-sm font-semibold">احراز هویت دومرحله‌ای ادمین</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">برای تمام ادمین‌ها اجباری شود.</p>
            <button className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-gray-800">فعال</button>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-sm font-semibold">IP Whitelist</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">ورود ادمین فقط از IPهای تاییدشده.</p>
            <button className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-gray-800">مدیریت لیست</button>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-sm font-semibold">لاگ عملیات حساس</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">ثبت همه تغییرات روی کاربران و تراکنش‌ها.</p>
            <button className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-gray-800">دانلود لاگ</button>
          </div>
        </div>
      </section>
    </div>
  );
}
