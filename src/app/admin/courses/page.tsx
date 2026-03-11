import { Plus, TrendingUp } from "lucide-react";
import { HorizontalBars, StatusPill } from "@/components/admin/AdminCharts";
import { coursesData, salesByCategory } from "@/components/admin/admin-data";

export default function AdminCoursesPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">مدیریت دوره‌ها</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">وضعیت انتشار، تکمیل دوره و درآمد هر دوره</p>
          </div>
          <button className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white">
            <Plus className="ml-1 inline h-4 w-4" />
            ایجاد دوره جدید
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 overflow-x-auto rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
          <table className="min-w-full text-right text-sm">
            <thead className="text-xs text-gray-500 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-3">کد</th>
                <th className="py-3">عنوان دوره</th>
                <th className="py-3">مدرس</th>
                <th className="py-3">دانشجو</th>
                <th className="py-3">تکمیل</th>
                <th className="py-3">درآمد</th>
                <th className="py-3">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {coursesData.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 font-semibold">{course.id}</td>
                  <td className="py-3">{course.title}</td>
                  <td className="py-3">{course.instructor}</td>
                  <td className="py-3">{course.students}</td>
                  <td className="py-3">
                    <div className="w-36">
                      <div className="mb-1 text-xs">{course.completion}%</div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${course.completion}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{course.revenue}</td>
                  <td className="py-3"><StatusPill status={course.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-5">
          <HorizontalBars data={salesByCategory} />
          <div className="rounded-3xl border border-emerald-200/70 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-primary/10">
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <TrendingUp className="ml-1 inline h-4 w-4" />
              رشد فروش نسبت به ماه قبل: 18%
            </p>
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-200">بهترین عملکرد مربوط به دوره‌های Frontend بوده است.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
