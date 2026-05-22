"use client";

import React from "react";
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  LucideIcon,
  Download, 
  Hash, 
  Calendar,
  CreditCard,
  Target,
  ShieldCheck,
  FileText
} from "lucide-react";
import { Transaction } from "../data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const statusMap = {
  success: { label: "پرداخت موفق", color: "green", icon: CheckCircle2 },
  failed: { label: "پرداخت ناموفق", color: "red", icon: XCircle },
  pending: { label: "در انتظار پرداخت", color: "amber", icon: Clock },
  refunded: { label: "بازگشت وجه", color: "blue", icon: RotateCcw },
};

export default function TransactionDetailsModal({ transaction, onClose }: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const currentStatus = statusMap[transaction.status];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" dir="rtl">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#1c1e26] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header/Status Section */}
          <div className={cn(
            "p-10 text-center relative overflow-hidden",
            currentStatus.color === 'green' ? 'bg-green-500/10' :
            currentStatus.color === 'red' ? 'bg-red-500/10' :
            currentStatus.color === 'blue' ? 'bg-blue-500/10' : 'bg-amber-500/10'
          )}>
             <div className={cn(
               "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl",
               currentStatus.color === 'green' ? 'bg-green-500 text-white shadow-green-500/20' :
               currentStatus.color === 'red' ? 'bg-red-500 text-white shadow-red-500/20' :
               currentStatus.color === 'blue' ? 'bg-blue-500 text-white shadow-blue-500/20' : 
               'bg-amber-500 text-white shadow-amber-500/20'
             )}>
               {React.createElement(currentStatus.icon as LucideIcon, { className: "w-10 h-10" })}
             </div>
             <h3 className={cn(
               "text-2xl font-black mb-2",
               currentStatus.color === 'green' ? 'text-green-600 dark:text-green-400' :
               currentStatus.color === 'red' ? 'text-red-600 dark:text-red-400' :
               currentStatus.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 
               'text-amber-600 dark:text-amber-400'
             )}>
               {currentStatus.label}
             </h3>
             <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{transaction.amount.toLocaleString()}</span>
                <span className="text-xs font-bold text-gray-400">تومان</span>
             </div>
          </div>

          {/* Details Section */}
          <div className="p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
               <DetailItem icon={<Hash className="w-4 h-4" />} label="شناسه تراکنش" value={transaction.id} />
               <DetailItem icon={<Calendar className="w-4 h-4" />} label="تاریخ و ساعت" value={`${transaction.date} - ${transaction.time}`} />
               <DetailItem icon={<Target className="w-4 h-4" />} label="شرح تراکنش" value={transaction.description} />
               <DetailItem icon={<ShieldCheck className="w-4 h-4" />} label="شماره پیگیری" value={transaction.trackingCode} />
               <DetailItem icon={<CreditCard className="w-4 h-4" />} label="روش پرداخت" value={transaction.paymentMethod} />
               <DetailItem icon={<FileText className="w-4 h-4" />} label="نام محصول" value={transaction.productTitle} />
            </div>



            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                <Download className="w-5 h-5" />
                <span>دریافت رسید پرداخت</span>
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-black text-gray-900 dark:text-gray-100 pr-6">{value}</p>
    </div>
  );
}
