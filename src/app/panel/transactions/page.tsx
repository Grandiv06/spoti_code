const transactions = [
  { id: "TRX-3821", title: "خرید مسترکلاس Next.js", amount: "2,900,000", date: "1404/12/18", status: "موفق" },
  { id: "TRX-3817", title: "خرید دوره TypeScript", amount: "1,980,000", date: "1404/11/28", status: "موفق" },
  { id: "TRX-3811", title: "بازپرداخت دوره UI", amount: "-980,000", date: "1404/11/05", status: "بازگشت وجه" },
];

export default function PanelTransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1c1e26]">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">تراکنش‌های من</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ریز پرداخت‌ها و بازگشت وجه دوره‌های خریداری‌شده</p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#1c1e26]">
        <table className="min-w-full text-right text-sm">
          <thead className="text-xs text-gray-500 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="py-3">شناسه</th>
              <th className="py-3">شرح</th>
              <th className="py-3">مبلغ (تومان)</th>
              <th className="py-3">تاریخ</th>
              <th className="py-3">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 dark:border-gray-800/80">
                <td className="py-3 font-semibold text-gray-900 dark:text-white">{item.id}</td>
                <td className="py-3 text-gray-700 dark:text-gray-200">{item.title}</td>
                <td className="py-3 text-gray-700 dark:text-gray-200">{item.amount}</td>
                <td className="py-3 text-gray-500 dark:text-gray-400">{item.date}</td>
                <td className="py-3">
                  <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
