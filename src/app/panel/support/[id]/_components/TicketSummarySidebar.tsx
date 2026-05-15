"use client";

import React from "react";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Circle,
  Paperclip,
  Activity
} from "lucide-react";
import { Ticket } from "../../data";
import { cn } from "@/lib/utils";

export default function TicketSummarySidebar({ ticket }: { ticket: Ticket }) {
  return (
    <div className="space-y-8">
      {/* Quick Info Card */}
      <div className="bg-white dark:bg-[#1c1e26] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/40 dark:shadow-none">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <span>اطلاعات تکمیلی</span>
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">دسته‌بندی</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">{ticket.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">تعداد پیام‌ها</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">{ticket.messages.length} مورد</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">فایل‌های پیوست</span>
            <span className="text-sm font-black text-gray-900 dark:text-white">{ticket.attachments.length} فایل</span>
          </div>
          <div className="pt-6 border-t border-gray-100 dark:border-white/5">
            <p className="text-[10px] text-gray-400 font-bold mb-2">زمان تقریبی پاسخگویی</p>
            <p className="text-sm font-black text-primary">کمتر از ۲ ساعت</p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white dark:bg-[#1c1e26] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/40 dark:shadow-none">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">timeline</span>
          <span>روند پیشرفت تیکت</span>
        </h3>
        
        <div className="space-y-8 relative">
          {/* Vertical Line */}
          <div className="absolute top-2 bottom-2 right-[15px] w-0.5 bg-gray-100 dark:bg-white/5" />
          
          {ticket.timeline.map((event) => (
            <div key={event.id} className="relative flex items-start gap-4 pr-10">
              <div className={cn(
                "absolute right-0 top-0 w-8 h-8 rounded-full border-4 flex items-center justify-center z-10",
                event.status === "completed" 
                  ? "bg-primary border-white dark:border-[#1c1e26] text-white" 
                  : "bg-white dark:bg-[#1c1e26] border-gray-100 dark:border-white/10 text-gray-400"
              )}>
                <span className="material-symbols-outlined text-base">{event.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className={cn(
                  "text-sm font-black mb-1",
                  event.status === "completed" ? "text-gray-900 dark:text-white" : "text-gray-400"
                )}>
                  {event.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{event.time}</p>
              </div>
            </div>
          ))}
          
          {ticket.status !== "closed" && (
            <div className="relative flex items-start gap-4 pr-10 opacity-50">
              <div className="absolute right-0 top-0 w-8 h-8 rounded-full border-4 bg-white dark:bg-[#1c1e26] border-gray-100 dark:border-white/10 text-gray-400 flex items-center justify-center z-10">
                <Circle className="w-3 h-3 fill-current" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold mb-1 text-gray-400">بسته شدن تیکت</h4>
                <p className="text-xs text-gray-400 font-bold">---</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attachments Section */}
      {ticket.attachments.length > 0 && (
        <div className="bg-white dark:bg-[#1c1e26] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/40 dark:shadow-none">
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <Paperclip className="w-5 h-5 text-primary" />
            <span>فایل‌های پیوست</span>
          </h3>
          
          <div className="space-y-4">
            {ticket.attachments.map((file) => (
              <div key={file.id} className="group p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/30 transition-all flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white truncate max-w-[120px]">{file.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">{file.size}</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
