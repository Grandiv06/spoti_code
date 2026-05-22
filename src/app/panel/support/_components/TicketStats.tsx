"use client";

import React from "react";
import { MessageSquare, Clock, CheckCircle2, Inbox, LucideIcon } from "lucide-react";

const stats = [
  { label: "کل تیکت‌ها", value: "۱۲", icon: Inbox, color: "blue" },
  { label: "تیکت‌های باز", value: "۳", icon: MessageSquare, color: "primary" },
  { label: "در حال بررسی", value: "۲", icon: Clock, color: "amber" },
  { label: "پاسخ داده شده", value: "۷", icon: CheckCircle2, color: "green" },
];

export default function TicketStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-[#1c1e26] p-4 md:p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className={`absolute top-0 right-0 w-16 h-16 bg-${stat.color}-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
              stat.color === 'primary' ? 'bg-primary/10 text-primary' : 
              stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
              stat.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : 
              'bg-green-500/10 text-green-500'
            }`}>
              {React.createElement(stat.icon as LucideIcon, { className: "w-6 h-6" })}
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
