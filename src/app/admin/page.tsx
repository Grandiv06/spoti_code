import { ArrowUpRight, BellRing, Download, Users2 } from "lucide-react";
import { DonutChannels, HorizontalBars, MiniAreaChart, StatusPill } from "@/components/admin/AdminCharts";
import { adminKpis, channelData, monthlyRevenue, recentOrders, salesByCategory, ticketsData } from "@/components/admin/admin-data";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminKpis.map((kpi) => (
          <div key={kpi.title} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1c1e26]">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{kpi.title}</p>
            <p className="mt-3 text-2xl font-black tracking-tight">
              {kpi.value}
              {kpi.unit ? <span className="mr-1 text-sm font-semibold text-gray-500">{kpi.unit}</span> : null}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-primary/20 dark:text-emerald-300">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {kpi.delta}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MiniAreaChart data={monthlyRevenue.map((item) => ({ label: item.month, value: item.revenue }))} />
        </div>
        <DonutChannels data={channelData} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <HorizontalBars data={salesByCategory} />

        <div className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold">تیکت‌های اخیر پشتیبانی</h3>
            <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-gray-800">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {ticketsData.slice(0, 4).map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{ticket.title}</p>
                  <StatusPill status={ticket.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{ticket.owner}</span>
                  <span>{ticket.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold">آخرین سفارش‌ها</h3>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-gray-800">
              <BellRing className="ml-1 inline h-3.5 w-3.5" />
              هشدار مالی
            </button>
            <button className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white">
              <Download className="ml-1 inline h-3.5 w-3.5" />
              خروجی CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="text-xs text-gray-500 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="py-3 pr-2">شناسه</th>
                <th className="py-3">کاربر</th>
                <th className="py-3">دوره</th>
                <th className="py-3">مبلغ</th>
                <th className="py-3">تاریخ</th>
                <th className="py-3">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-100 text-gray-700 dark:border-gray-800 dark:text-gray-200">
                  <td className="py-3 pr-2 font-semibold">{order.id}</td>
                  <td className="py-3">{order.user}</td>
                  <td className="py-3">{order.course}</td>
                  <td className="py-3">{order.amount}</td>
                  <td className="py-3">{order.date}</td>
                  <td className="py-3"><StatusPill status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200/70 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-500/20 dark:bg-primary/10 dark:text-emerald-300">
          <span className="inline-flex items-center gap-1"><Users2 className="h-3.5 w-3.5" /> امروز 132 کاربر جدید ثبت‌نام کرده‌اند.</span>
          <span>نرخ تبدیل امروز: 5.6%</span>
        </div>
      </section>
    </div>
  );
}
