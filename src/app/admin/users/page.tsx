import { Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { StatusPill } from "@/components/admin/AdminCharts";
import { usersData } from "@/components/admin/admin-data";

export default function AdminUsersPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">مدیریت کاربران</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">جستجو، فیلتر، وضعیت اشتراک و ارزش طول عمر کاربران</p>
          </div>
          <button className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white">
            <UserPlus className="ml-1 inline h-4 w-4" />
            افزودن کاربر
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="col-span-2 flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 dark:border-gray-800">
            <Search className="h-4 w-4 text-gray-500" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="جستجو براساس نام، شماره یا شناسه" />
          </label>
          <button className="rounded-2xl border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-gray-800">
            <SlidersHorizontal className="ml-1 inline h-4 w-4" />
            فیلتر پیشرفته
          </button>
        </div>
      </section>

      <section className="overflow-x-auto rounded-3xl border border-gray-100 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-[#1c1e26]">
        <table className="min-w-full text-right text-sm">
          <thead className="text-xs text-gray-500 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="py-3">شناسه</th>
              <th className="py-3">نام</th>
              <th className="py-3">شماره</th>
              <th className="py-3">پلن</th>
              <th className="py-3">وضعیت</th>
              <th className="py-3">دوره‌ها</th>
              <th className="py-3">LTV</th>
              <th className="py-3">عضویت</th>
              <th className="py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 font-semibold">{user.id}</td>
                <td className="py-3">{user.name}</td>
                <td className="py-3">{user.phone}</td>
                <td className="py-3">{user.plan}</td>
                <td className="py-3"><StatusPill status={user.status} /></td>
                <td className="py-3">{user.courses}</td>
                <td className="py-3">{user.ltv}</td>
                <td className="py-3">{user.joinedAt}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-800">نمایش</button>
                    <button className="rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-800">ویرایش</button>
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
