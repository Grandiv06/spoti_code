import { Calendar, FileText, Plus, WandSparkles } from "lucide-react";

const contentRows = [
  { id: "CNT-220", title: "مقاله: معماری تمیز در React", type: "مقاله", author: "الهام بهشتی", publishAt: "1404/12/22", status: "در انتظار انتشار" },
  { id: "CNT-219", title: "ویدیو: بهینه‌سازی رندر", type: "ویدیو", author: "سروش مشایخی", publishAt: "1404/12/21", status: "منتشر شده" },
  { id: "CNT-218", title: "وبینار: CI/CD حرفه‌ای", type: "رویداد", author: "آیدا رضایی", publishAt: "1404/12/23", status: "پیش‌نویس" },
  { id: "CNT-217", title: "مقاله: الگوهای state management", type: "مقاله", author: "امیر محمدی", publishAt: "1404/12/19", status: "منتشر شده" },
];

export default function AdminContentPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">مدیریت محتوا</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">تقویم انتشار، پیش‌نویس‌ها و وضعیت تولید محتوا</p>
          </div>
          <button className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white">
            <Plus className="ml-1 inline h-4 w-4" />
            محتوای جدید
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">پیش‌نویس باز</p>
            <p className="mt-1 text-xl font-black">14</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">محتوای منتشر شده این ماه</p>
            <p className="mt-1 text-xl font-black">26</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">میانگین زمان تولید</p>
            <p className="mt-1 text-xl font-black">3.4 روز</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="text-xs text-gray-500 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-3">شناسه</th>
                <th className="py-3">عنوان</th>
                <th className="py-3">نوع</th>
                <th className="py-3">نویسنده</th>
                <th className="py-3">تاریخ انتشار</th>
                <th className="py-3">وضعیت</th>
                <th className="py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {contentRows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 font-semibold">{row.id}</td>
                  <td className="py-3">{row.title}</td>
                  <td className="py-3">{row.type}</td>
                  <td className="py-3">{row.author}</td>
                  <td className="py-3">{row.publishAt}</td>
                  <td className="py-3">{row.status}</td>
                  <td className="py-3">
                    <button className="rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-800">ویرایش</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-[#1c1e26]">
          <p className="text-sm font-bold"><Calendar className="ml-1 inline h-4 w-4" /> برنامه انتشار این هفته</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>شنبه: مقاله &quot;SSR در Next.js&quot;</li>
            <li>دوشنبه: ویدیوی &quot;Code Review واقعی&quot;</li>
            <li>چهارشنبه: وبینار &quot;Scaling Frontend Team&quot;</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-emerald-200/70 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-primary/10">
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300"><WandSparkles className="ml-1 inline h-4 w-4" /> پیشنهاد هوشمند</p>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-200">با توجه به رفتار کاربران، انتشار محتواهای کوتاه ویدیویی در روزهای یکشنبه و سه‌شنبه نرخ تعامل را افزایش می‌دهد.</p>
          <button className="mt-3 rounded-xl bg-primary-hover px-3 py-2 text-xs font-bold text-white"><FileText className="ml-1 inline h-3.5 w-3.5" /> تولید برنامه هفتگی</button>
        </div>
      </section>
    </div>
  );
}
