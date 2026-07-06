import React from "react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Wallet 
} from "lucide-react";
import { User } from "./types";
import { toPersianDigits, formatPrice } from "./utils";

interface UsersStatsProps {
  users: User[];
}

export default function UsersStats({ users }: UsersStatsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "فعال").length;
  const inactiveUsers = users.filter((u) => u.status === "غیرفعال").length;
  const totalLTV = users.reduce((sum, u) => sum + u.ltv, 0);

  const stats = [
    {
      label: "کل کاربران",
      value: toPersianDigits(totalUsers),
      desc: "کل هنرجویان پلتفرم",
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      color: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20",
      bgGlow: "bg-emerald-500/5",
    },
    {
      label: "کاربران فعال",
      value: toPersianDigits(activeUsers),
      desc: "دارای دسترسی فعال",
      icon: <UserCheck className="w-5 h-5 text-green-400" />,
      color: "from-green-500/10 to-emerald-500/5 border-green-500/20",
      bgGlow: "bg-green-500/5",
    },
    {
      label: "کاربران غیرفعال",
      value: toPersianDigits(inactiveUsers),
      desc: "حساب غیرفعال شده",
      icon: <UserX className="w-5 h-5 text-zinc-400" />,
      color: "from-zinc-500/10 to-neutral-500/5 border-zinc-500/20",
      bgGlow: "bg-zinc-500/5",
    },
    {
      label: "مجموع درآمد (LTV)",
      value: formatPrice(totalLTV),
      desc: "ارزش چرخه عمر کل",
      icon: <Wallet className="w-5 h-5 text-blue-400" />,
      color: "from-blue-500/10 to-indigo-500/5 border-blue-500/20",
      bgGlow: "bg-blue-500/5",
      isLarge: true,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`col-span-1 ${
            stat.isLarge ? "col-span-2 md:col-span-3 xl:col-span-1" : ""
          } bg-white dark:bg-[#1c1e26] p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 group overflow-hidden relative flex flex-col justify-between`}
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 ${stat.bgGlow} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}
          />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400">
                {stat.label}
              </span>
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} transition-transform group-hover:scale-110 duration-300`}
              >
                {stat.icon}
              </div>
            </div>

            <div>
              <p
                className={`font-black text-gray-900 dark:text-white leading-none mb-1 ${
                  stat.isLarge ? "text-base sm:text-lg" : "text-xl"
                }`}
              >
                {stat.value}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                {stat.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
