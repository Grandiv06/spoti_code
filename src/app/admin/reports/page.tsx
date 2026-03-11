import { Download, TrendingUp } from "lucide-react";
import { DonutChannels, MiniAreaChart } from "@/components/admin/AdminCharts";
import { channelData, monthlyRevenue } from "@/components/admin/admin-data";

const retentionData = [
  { label: "هفته 1", value: 100 },
  { label: "هفته 2", value: 74 },
  { label: "هفته 3", value: 62 },
  { label: "هفته 4", value: 57 },
  { label: "هفته 5", value: 51 },
  { label: "هفته 6", value: 49 },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">گزارش‌ها و تحلیل</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">نمای کلی از درآمد، نگهداشت کاربران و کانال‌های جذب</p>
          </div>
          <button className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white">
            <Download className="ml-1 inline h-3.5 w-3.5" />
            دانلود گزارش کامل
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MiniAreaChart data={monthlyRevenue.map((item) => ({ label: item.month, value: item.users }))} />
        </div>
        <DonutChannels data={channelData} />
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <h3 className="mb-4 text-sm font-bold">کوهورت نگهداشت کاربران</h3>
        <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-6">
          {retentionData.map((item) => (
            <div key={item.label} className="rounded-2xl border border-gray-200 p-3 text-center dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="mt-1 text-lg font-black">{item.value}%</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-200/70 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-primary/10 dark:text-emerald-200">
          <TrendingUp className="ml-1 inline h-4 w-4" />
          نرخ نگهداشت هفته 4 نسبت به ماه قبل 9% بهتر شده است.
        </div>
      </section>
    </div>
  );
}
