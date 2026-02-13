export default function PanelDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            خوش اومدی، <span className="text-primary">کاربر عزیز</span>! 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            از داشبورد خودت می‌تونی به دوره‌ها و وضعیت یادگیریت دسترسی داشته باشی.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">دوره‌های فعال</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">3</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
            <span className="material-symbols-outlined text-2xl">timer</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">ساعت آموزش</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">12</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e26] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">تکمیل شده</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
