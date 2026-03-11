import { Download, Filter } from "lucide-react";
import { StatusPill } from "@/components/admin/AdminCharts";
import { recentOrders } from "@/components/admin/admin-data";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black">مدیریت سفارش‌ها و پرداخت</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">بررسی وضعیت تراکنش‌ها، بازپرداخت و مغایرت‌های مالی</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold dark:border-gray-800"><Filter className="ml-1 inline h-3.5 w-3.5" />فیلتر</button>
            <button className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white"><Download className="ml-1 inline h-3.5 w-3.5" />خروجی</button>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <table className="min-w-full text-right text-sm">
          <thead className="text-xs text-gray-500 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="py-3">شناسه</th>
              <th className="py-3">کاربر</th>
              <th className="py-3">محصول</th>
              <th className="py-3">مبلغ</th>
              <th className="py-3">تاریخ</th>
              <th className="py-3">وضعیت</th>
              <th className="py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 font-semibold">{order.id}</td>
                <td className="py-3">{order.user}</td>
                <td className="py-3">{order.course}</td>
                <td className="py-3">{order.amount}</td>
                <td className="py-3">{order.date}</td>
                <td className="py-3"><StatusPill status={order.status} /></td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-800">جزئیات</button>
                    <button className="rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-800">بازپرداخت</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
