"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  Clock, 
  Tag, 
  AlertCircle, 
  MoreHorizontal,
  ArrowUpRight,
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useTicketsQuery } from "@/hooks/api/useTicketsQuery";

const tabs = [
  { id: "all", label: "همه تیکت‌ها" },
  { id: "open", label: "باز" },
  { id: "investigating", label: "در حال بررسی" },
  { id: "answered", label: "پاسخ داده شده" },
  { id: "closed", label: "بسته شده" },
];

const statusMap = {
  open: { label: "باز", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  investigating: { label: "در حال بررسی", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  answered: { label: "پاسخ داده شده", class: "bg-green-500/10 text-green-500 border-green-500/20" },
  closed: { label: "بسته شده", class: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
};

const priorityMap = {
  normal: { label: "عادی", class: "text-gray-400 bg-gray-100 dark:bg-white/5" },
  high: { label: "مهم", class: "text-amber-500 bg-amber-500/5" },
  urgent: { label: "فوری", class: "text-red-500 bg-red-500/5" },
};

export default function TicketList({ onNewTicket }: { onNewTicket: () => void }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tickets = [] } = useTicketsQuery();

  const filteredTickets = tickets.filter(ticket => {
    const matchesTab = activeTab === "all" || ticket.status === activeTab;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#1c1e26] p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative group min-w-[280px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="جستجو در تیکت‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-right"
          />
        </div>
      </div>

      {/* List Container */}
      <div className="bg-white dark:bg-[#1c1e26] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden">
        {filteredTickets.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="group flex flex-col lg:flex-row lg:items-center justify-between p-8 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-all cursor-pointer relative"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/5">
                      {ticket.id}
                    </span>
                    <span className={cn(
                      "text-[11px] font-black px-3 py-1 rounded-full border uppercase tracking-tight",
                      statusMap[ticket.status as keyof typeof statusMap].class
                    )}>
                      {statusMap[ticket.status as keyof typeof statusMap].label}
                    </span>
                    <span className={cn(
                      "text-[11px] font-bold px-3 py-1 rounded-lg",
                      priorityMap[ticket.priority as keyof typeof priorityMap].class
                    )}>
                      {priorityMap[ticket.priority as keyof typeof priorityMap].label}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                    {ticket.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <span>{ticket.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>ثبت: {ticket.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                      <span>بروزرسانی: {ticket.updatedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 lg:mt-0 flex items-center gap-4 lg:pr-8">
                   <button 
                    onClick={() => router.push(`/panel/support/${ticket.id}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-black text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-sm"
                  >
                    <span>مشاهده جزئیات</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Visual hover indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
              </div>
            ))}
          </div>
        ) : (
          <SupportEmptyState onNewTicket={onNewTicket} />
        )}
      </div>
      
      {/* Pagination Placeholder */}
      {filteredTickets.length > 0 && (
        <div className="flex justify-center pt-4">
           <div className="flex items-center gap-2 bg-white dark:bg-[#1c1e26] p-2 rounded-2xl border border-gray-100 dark:border-white/5">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold">۱</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all">۲</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

function SupportEmptyState({ onNewTicket }: { onNewTicket: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-[2.5rem] bg-primary/5 flex items-center justify-center relative z-10">
          <Inbox className="w-16 h-16 text-primary opacity-20" />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white dark:bg-[#252833] shadow-xl flex items-center justify-center animate-bounce">
          <span className="material-symbols-outlined text-primary text-2xl">question_mark</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">هنوز هیچ تیکتی ثبت نکرده‌اید!</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed font-medium mb-10">
        اگر با مشکلی مواجه شده‌اید یا سوالی دارید، تیم پشتیبانی ما در کنار شماست. همین حالا اولین درخواست خود را ثبت کنید.
      </p>
      
      <button 
        onClick={onNewTicket}
        className="px-10 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
      >
        <span className="material-symbols-outlined">add</span>
        <span>ثبت اولین تیکت پشتیبانی</span>
      </button>
    </div>
  );
}
