"use client";

import React, { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Eye,
  FileText
} from "lucide-react";
import { Transaction } from "../data";
import { cn } from "@/lib/utils";
import TransactionDetailsModal from "./TransactionDetailsModal";

const statusMap = {
  success: { label: "موفق", class: "bg-green-500/10 text-green-500 border-green-500/20", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  failed: { label: "ناموفق", class: "bg-red-500/10 text-red-500 border-red-500/20", icon: <XCircle className="w-3.5 h-3.5" /> },
  pending: { label: "در انتظار", class: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: <Clock className="w-3.5 h-3.5" /> },
  refunded: { label: "برگشت وجه", class: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: <RotateCcw className="w-3.5 h-3.5" /> },
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1c1e26] rounded-[2.5rem] p-16 text-center border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="w-24 h-24 rounded-[2rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-8 text-gray-300">
          <FileText className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">هنوز تراکنشی ثبت نشده است</h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-md mx-auto leading-relaxed">
          تمامی پرداخت‌ها، تمدید اشتراک‌ها و بازگشت وجه‌های شما در این لیست نمایش داده خواهد شد.
        </p>
        <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/25 hover:scale-105 transition-transform active:scale-95">
          مشاهده دوره‌های آموزشی
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block bg-white dark:bg-[#1c1e26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden">
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/[0.02] text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-6">نوع و شرح تراکنش</th>
              <th className="px-8 py-6">شناسه</th>
              <th className="px-8 py-6">تاریخ و زمان</th>
              <th className="px-8 py-6">مبلغ (تومان)</th>
              <th className="px-8 py-6">وضعیت</th>
              <th className="px-8 py-6">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {transactions.map((trx) => (
              <tr key={trx.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      trx.type === "payment" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500"
                    )}>
                      {trx.type === "payment" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white mb-1">{trx.description}</p>
                      <p className="text-xs text-gray-400 font-bold">{trx.productTitle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs font-black text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                  {trx.id}
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-black text-gray-700 dark:text-gray-300 mb-1">{trx.date}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{trx.time}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "text-base font-black",
                    trx.type === "payment" ? "text-gray-900 dark:text-white" : "text-blue-500"
                  )}>
                    {trx.type === "payment" ? trx.amount.toLocaleString() : `-${trx.amount.toLocaleString()}`}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black",
                    statusMap[trx.status].class
                  )}>
                    {statusMap[trx.status].icon}
                    <span>{statusMap[trx.status].label}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => setSelectedTrx(trx)}
                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all group/btn active:scale-90"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {transactions.map((trx) => (
          <div key={trx.id} className="bg-white dark:bg-[#1c1e26] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  trx.type === "payment" ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500"
                )}>
                  {trx.type === "payment" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-black text-gray-500 dark:text-gray-400 mb-0.5">{trx.id}</p>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black",
                    statusMap[trx.status].class
                  )}>
                    {statusMap[trx.status].icon}
                    <span>{statusMap[trx.status].label}</span>
                  </div>
                </div>
              </div>
              <p className={cn(
                "text-lg font-black",
                trx.type === "payment" ? "text-gray-900 dark:text-white" : "text-blue-500"
              )}>
                {trx.type === "payment" ? trx.amount.toLocaleString() : `-${trx.amount.toLocaleString()}`}
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-sm font-black text-gray-800 dark:text-gray-100">{trx.description}</p>
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                <span>{trx.date} - {trx.time}</span>
                <span>{trx.paymentMethod}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTrx(trx)}
              className="w-full py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-black flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>مشاهده جزئیات تراکنش</span>
            </button>
          </div>
        ))}
      </div>

      <TransactionDetailsModal 
        transaction={selectedTrx} 
        onClose={() => setSelectedTrx(null)} 
      />
    </div>
  );
}
