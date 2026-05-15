"use client";

import React, { useState } from "react";

import TicketStats from "./_components/TicketStats";
import TicketList from "./_components/TicketList";
import TicketForm from "./_components/TicketForm";
import ContactCard from "./_components/ContactCard";

export default function SupportPage() {
  const [view, setView] = useState<"list" | "create">("list");

  return (
    <div className="max-w-[1400px] mx-auto px-2 md:px-4 pb-20 animate-in fade-in duration-1000" dir="rtl">


      {/* Main Content Area */}
      <div className="space-y-8">
        {view === "list" ? (
          <>
            {/* Stats Overview */}
            <TicketStats />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              {/* Ticket List - Main Focus */}
              <div className="xl:col-span-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">تیکت‌های من</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">مدیریت و پیگیری درخواست‌های ثبت شده</p>
                  </div>
                  <button 
                    onClick={() => setView("create")}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-[1.25rem] font-black shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="material-symbols-outlined">add</span>
                    <span>ثبت تیکت جدید</span>
                  </button>
                </div>

                <TicketList onNewTicket={() => setView("create")} />
              </div>

              {/* Sidebar Info */}
              <div className="xl:col-span-4 space-y-8">
                <ContactCard />
                
                {/* FAQ Quick Link */}
                <div className="bg-gradient-to-br from-primary/10 to-emerald-500/10 dark:from-primary/5 dark:to-emerald-500/5 rounded-[2.5rem] p-8 border border-primary/20 dark:border-white/5 relative overflow-hidden group shadow-sm">
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1c1e26] flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/10 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">menu_book</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">سوالات متداول</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-6">
                      قبل از ثبت تیکت، نگاهی به سوالات متداول بیندازید؛ احتمالاً جواب خود را در کمتر از ۱ دقیقه پیدا می‌کنید!
                    </p>
                    <button className="w-full py-3.5 bg-white dark:bg-white/10 text-primary dark:text-primary-foreground rounded-2xl text-sm font-black shadow-sm hover:shadow-md transition-all active:scale-95 border border-primary/10">
                      مشاهده سوالات پر تکرار
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-5xl mx-auto">
             <div className="mb-10">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">ثبت درخواست پشتیبانی</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">مشکل خود را مطرح کنید تا در سریع‌ترین زمان بررسی شود.</p>
              </div>
            <TicketForm onBack={() => setView("list")} />
          </div>
        )}
      </div>
    </div>
  );
}
