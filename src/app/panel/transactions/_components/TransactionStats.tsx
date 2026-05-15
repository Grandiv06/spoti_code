"use client";

import React from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";

const stats = [
  { label: "مجموع پرداخت‌ها", value: "۱۱,۲۵۰,۰۰۰", icon: <CreditCard />, color: "primary", unit: "تومان" },
  { label: "تراکنش‌های موفق", value: "۸", icon: <CheckCircle2 />, color: "green", unit: "مورد" },
  { label: "آخرین تراکنش", value: "۲,۹۰۰,۰۰۰", icon: <ArrowUpRight />, color: "amber", unit: "تومان" },
];

export default function TransactionStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-[#1c1e26] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color === 'primary' ? 'primary' : stat.color}-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
              stat.color === 'primary' ? 'bg-primary/10 text-primary' : 
              stat.color === 'green' ? 'bg-green-500/10 text-green-500' :
              stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : 
              'bg-amber-500/10 text-amber-500'
            }`}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: "w-6 h-6" })}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</span>
                <span className="text-[10px] font-bold text-gray-400">{stat.unit}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
