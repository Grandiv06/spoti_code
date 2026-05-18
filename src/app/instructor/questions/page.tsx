"use client";

import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  MessageSquare,
  Search,
  CheckCircle2,
  X,
  User,
  ArrowLeft,
  ChevronLeft,
  Trash2,
  AlertCircle
} from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";
import { cn } from "@/lib/utils";

export default function InstructorQuestionsPage() {
  const { questions, replyToQuestion, closeQuestion } = useInstructorData();

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // State for active replying question ID
  const [replyingId, setReplyingId] = useState("");
  const [replyText, setReplyText] = useState("");

  // Statistics
  const stats = useMemo(() => {
    const total = questions.length;
    const pending = questions.filter((q) => q.status === "new").length;
    const answered = questions.filter((q) => q.status === "answered").length;
    const closed = questions.filter((q) => q.status === "closed").length;
    return { total, pending, answered, closed };
  }, [questions]);

  // Filters & Search logic
  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((q) => q.status === statusFilter);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (question) =>
          question.title.toLowerCase().includes(q) ||
          question.text.toLowerCase().includes(q) ||
          question.studentName.toLowerCase().includes(q) ||
          question.courseTitle.toLowerCase().includes(q)
      );
    }

    // Sort: newest first
    return result.sort((a, b) => b.id.localeCompare(a.id));
  }, [questions, statusFilter, search]);

  const handleReplySubmit = (qstId: string) => {
    if (replyText.trim()) {
      replyToQuestion(qstId, replyText.trim());
      setReplyText("");
      setReplyingId("");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* 1. Header Banner */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                <HelpCircle className="w-8 h-8" />
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">سوالات دانشجویان</h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                پاسخگویی به سوالات فنی و رفع اشکال کدهای ارسالی دانشجویان در جلسات مختلف دوره‌ها
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Stats Tabs Filters */}
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="جستجو در سوالات، دانشجویان یا عنوان دوره‌ها..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-800 dark:text-white focus:border-primary focus:outline-none transition-all text-right"
          />
        </div>

        {/* Tab Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {[
            { id: "all", label: "همه سوالات", count: stats.total },
            { id: "new", label: "جدید (بدون پاسخ)", count: stats.pending, color: "text-rose-500" },
            { id: "answered", label: "پاسخ داده شده", count: stats.answered, color: "text-emerald-500" },
            { id: "closed", label: "بسته شده", count: stats.closed, color: "text-gray-400" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                statusFilter === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded bg-gray-200/50 dark:bg-white/10", tab.color)}>
                {tab.count.toLocaleString("fa-IR")}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* 3. Questions Thread List */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-[2.5rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">هیچ سوالی یافت نشد!</h3>
          <p className="text-xs text-gray-400 font-bold max-w-sm leading-relaxed">
            هیچ سوالی با شرایط جستجوی شما مطابقت ندارد یا سرفصل سوالات شما در سیستم ثبت نشده است.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="rounded-[2rem] bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 space-y-4"
            >
              {/* Question metadata header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    {q.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={q.avatar} alt={q.studentName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-primary w-5 h-5" />
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">{q.studentName}</h4>
                    <span className="text-[8px] text-gray-400 font-semibold">{q.createdAt}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[8px] font-black bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                    دوره: {q.courseTitle}
                  </span>
                  {q.lessonTitle && (
                    <span className="text-[8px] font-black bg-gray-100 dark:bg-white/5 text-gray-500 px-2.5 py-1 rounded-lg">
                      درس: {q.lessonTitle}
                    </span>
                  )}
                  <span className={`text-[8px] font-black px-2 py-1 rounded-lg ${
                    q.status === "new" ? "bg-rose-500/10 text-rose-400 animate-pulse" :
                    q.status === "answered" ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
                  }`}>
                    {q.status === "new" && "جدید"}
                    {q.status === "answered" && "پاسخ داده شده"}
                    {q.status === "closed" && "بسته شده"}
                  </span>
                </div>
              </div>

              {/* Title & Core question body */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-right space-y-2">
                <h4 className="text-xs font-black text-gray-900 dark:text-white">{q.title}</h4>
                <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                  {q.text}
                </p>
              </div>

              {/* Thread history */}
              <div className="space-y-4 pr-6 border-r-2 border-primary/20">
                {q.replies.map((rep, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-4 rounded-2xl space-y-1.5",
                      rep.role === "instructor"
                        ? "bg-primary/5 border border-primary/10 rounded-r-none"
                        : "bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-l-none"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {rep.role === "instructor" && (
                        <span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary text-white">مدرس</span>
                      )}
                      <span className="text-[9px] font-black text-gray-900 dark:text-white">{rep.senderName}</span>
                      <span className="text-[8px] text-gray-400 font-bold">{rep.createdAt}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-relaxed text-right">
                      {rep.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action reply triggers */}
              {q.status !== "closed" && (
                <div className="pt-2">
                  {replyingId !== q.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyingId(q.id);
                          setReplyText("");
                        }}
                        className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl cursor-pointer"
                      >
                        پاسخ دادن به سوال
                      </button>
                      <button
                        onClick={() => closeQuestion(q.id)}
                        className="px-3 py-2 border border-gray-200 dark:border-white/10 text-gray-500 text-[10px] font-black rounded-xl cursor-pointer"
                      >
                        بستن گفتگو
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                      <textarea
                        rows={3}
                        placeholder="پاسخ و تحلیل فنی خود را بنویسید..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right leading-relaxed"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleReplySubmit(q.id)}
                          className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl cursor-pointer"
                        >
                          ارسال پاسخ فنی
                        </button>
                        <button
                          onClick={() => setReplyingId("")}
                          className="px-3 py-2 bg-gray-100 dark:bg-white/10 text-gray-500 text-[10px] rounded-xl cursor-pointer"
                        >
                          لغو
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
