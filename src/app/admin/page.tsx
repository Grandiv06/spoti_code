import { ArrowUpRight, BellRing, Coins, Download, LayoutDashboard, TrendingDown, UserRound, Users2, Waves } from "lucide-react";
import { DonutChannels, HorizontalBars, MiniAreaChart, StatusPill } from "@/components/admin/AdminCharts";
import { adminKpis, channelData, monthlyRevenue, recentOrders, salesByCategory, ticketsData } from "@/components/admin/admin-data";

export default function AdminDashboardPage() {
  const kpiIcons = [UserRound, Waves, Coins, TrendingDown];

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-700" dir="rtl">
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[220px] h-[220px] bg-emerald-500/10 rounded-full blur-[70px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-500">
                <LayoutDashboard className="w-8 h-8" />
              </div>
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">داشبورد مدیریت</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                نمای یکپارچه از رشد کاربران، درآمد، فروش و عملکرد پشتیبانی
              </p>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]">
            <Download className="w-4 h-4" />
            <span>خروجی گزارش مدیریتی</span>
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {adminKpis.map((kpi, index) => {
          const KpiIcon = kpiIcons[index] ?? UserRound;

          return (
          <div
            key={kpi.title}
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#1c1e26] relative overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full blur-2xl bg-primary/10 pointer-events-none" />
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{kpi.title}</p>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                <KpiIcon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              {kpi.value}
              {kpi.unit ? <span className="mr-1 text-sm font-semibold text-gray-500">{kpi.unit}</span> : null}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-primary/20 dark:text-emerald-300">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {kpi.delta}
            </p>
          </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3 mb-8">
        <div className="xl:col-span-2">
          <MiniAreaChart data={monthlyRevenue.map((item) => ({ label: item.month, value: item.revenue }))} />
        </div>
        <DonutChannels data={channelData} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2 mb-8">
        <HorizontalBars data={salesByCategory} />

        <div className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-white/5 dark:bg-[#1c1e26]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">تیکت‌های اخیر پشتیبانی</h3>
            <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-white/10">
              مشاهده همه
            </button>
          </div>
          <div className="space-y-3">
            {ticketsData.slice(0, 4).map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{ticket.title}</p>
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

      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-white/5 dark:bg-[#1c1e26]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">آخرین سفارش‌ها</h3>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold dark:border-white/10">
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
              <tr className="border-b border-gray-100 dark:border-white/10">
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
                <tr key={order.id} className="border-b border-gray-100 text-gray-700 dark:border-white/10 dark:text-gray-200">
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
