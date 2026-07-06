import React from "react";
import { Users, UserCheck, UserX } from "lucide-react";
import { User } from "./types";
import { toPersianDigits } from "./utils";

interface UsersStatsProps {
  users: User[];
}

export default function UsersStats({ users }: UsersStatsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "فعال").length;
  const inactiveUsers = users.filter((u) => u.status === "غیرفعال").length;

  const stats = [
    {
      label: "کل کاربران",
      value: toPersianDigits(totalUsers),
      desc: "کل هنرجویان پلتفرم",
      icon: <Users className="h-5 w-5 text-emerald-400" />,
      color: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20",
      bgGlow: "bg-emerald-500/5",
    },
    {
      label: "کاربران فعال",
      value: toPersianDigits(activeUsers),
      desc: "دارای دسترسی فعال",
      icon: <UserCheck className="h-5 w-5 text-green-400" />,
      color: "from-green-500/10 to-emerald-500/5 border-green-500/20",
      bgGlow: "bg-green-500/5",
    },
    {
      label: "کاربران غیرفعال",
      value: toPersianDigits(inactiveUsers),
      desc: "حساب غیرفعال شده",
      icon: <UserX className="h-5 w-5 text-zinc-400" />,
      color: "from-zinc-500/10 to-neutral-500/5 border-zinc-500/20",
      bgGlow: "bg-zinc-500/5",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md dark:border-white/5 dark:bg-[#1c1e26] dark:hover:border-white/10"
        >
          <div
            className={`absolute top-0 right-0 h-24 w-24 ${stat.bgGlow} translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150`}
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-400">{stat.label}</span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} transition-transform duration-300 group-hover:scale-110`}
              >
                {stat.icon}
              </div>
            </div>

            <div>
              <p className="mb-1 text-xl font-black leading-none text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{stat.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
