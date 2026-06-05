"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const comments = [
  {
    id: 1,
    project: "سیستم مدیریت تسک",
    content: "خیلی عالی بود! مخصوصا بخش استیت منیجمنت.",
    date: "1 ساعت پیش",
  },
  {
    id: 2,
    project: "لندینگ پیج",
    content: "فکر کنم ریسپانسیو موبایل مشکل داره.",
    date: "1 روز پیش",
  },
  {
    id: 3,
    project: "لاگین فرم",
    content: "از چه کتابخونه‌ای برای فرم استفاده کردی؟",
    date: "3 روز پیش",
  },
];

const ActivityTabs = () => {
  const [activeTab, setActiveTab] = useState<"comments">("comments");

  return (
    <div className="bg-white/60 dark:bg-[#1c1e26]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-sm min-h-[400px]">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <button
          onClick={() => setActiveTab("comments")}
          className={cn(
            "pb-4 -mb-[17px] px-2 font-bold text-lg transition-colors border-b-2 flex items-center gap-2",
            activeTab === "comments"
              ? "text-blue-500 border-blue-500 cursor-pointer"
              : "text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          )}
        >
          <MessageSquare className="w-5 h-5" />
          دیدگاه‌ها
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="group flex flex-col p-4 rounded-2xl hover:bg-white dark:hover:bg-[#1c1e26] border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
                {comment.project}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {comment.date}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              &ldquo;{comment.content}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTabs;
