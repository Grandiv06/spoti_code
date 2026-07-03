"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiGetNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";
import { formatTicketDate } from "@/app/panel/support/data";

type ProfileComment = {
  id: string;
  project: string;
  content: string;
  date: string;
};

export default function ActivityTabs() {
  const [activeTab, setActiveTab] = useState<"comments">("comments");
  const [comments, setComments] = useState<ProfileComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      try {
        const result = await apiGetNoMock<{ data?: unknown }>(
          "/api/dashboard/my-comments",
          getAuthHeaders()
        );

        const rawList = Array.isArray(result?.data)
          ? result.data
          : Array.isArray((result?.data as { items?: unknown[] } | undefined)?.items)
            ? ((result?.data as { items?: unknown[] }).items as unknown[])
            : [];

        const mapped = rawList.map((item, index) => {
          const row = (item ?? {}) as Record<string, unknown>;
          return {
            id: String(row.id ?? `comment-${index + 1}`),
            project: String(row.project ?? row.courseTitle ?? row.title ?? "دوره"),
            content: String(row.content ?? row.text ?? row.body ?? ""),
            date: formatTicketDate(row.createdAt ?? row.date),
          };
        });

        setComments(mapped);
      } catch {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    void loadComments();
  }, []);

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

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 rounded-2xl bg-gray-100 dark:bg-white/5" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#14161c] p-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
          هنوز دیدگاهی ثبت نکرده‌اید.
        </div>
      ) : (
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
      )}
    </div>
  );
}
