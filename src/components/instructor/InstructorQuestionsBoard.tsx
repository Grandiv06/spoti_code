"use client";

import React, { useMemo, useState } from "react";
import { FileText, HelpCircle, Paperclip, Search, User, Send, Loader2, Download, ArrowRight, X, ChevronLeft, MessageSquare } from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";
import { cn } from "@/lib/utils";

type Props = {
  showHero?: boolean;
  filterCourseId?: string;
  className?: string;
};

export default function InstructorQuestionsBoard({ showHero = true, filterCourseId, className }: Props) {
  const { questions, replyToQuestion } = useInstructorData();
  const sourceQuestions = useMemo(
    () => (filterCourseId ? questions.filter((q) => q.courseId === filterCourseId) : questions),
    [questions, filterCourseId]
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- Telegram Q&A Chat States & Helpers ---
  type PendingAttachment = {
    id: string;
    file: File;
    type: "image" | "file";
    previewUrl?: string;
    caption?: string;
  };

  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [composerText, setComposerText] = useState("");
  const isInputCode = (() => {
    if (!composerText) return false;
    if (composerText.includes("```")) return true;
    const codePatterns = [
      /import\s+.*\s+from\s+['"].*['"]/i,
      /const\s+\w+\s*=\s*/,
      /let\s+\w+\s*=\s*/,
      /var\s+\w+\s*=\s*/,
      /function\s+\w*\s*\(/,
      /class\s+\w+\s*\{/,
      /public\s+class\s+\w+/,
      /def\s+\w+\s*\(.*\):/,
      /print\(.*\)/,
      /#include\s+<\w+>/,
      /using\s+namespace\s+\w+/,
      /<\?php/,
      /\{\s*[\s\S]*\}/, 
      /\w+\s*\(.*\)\s*\{/
    ];
    const lines = composerText.split("\n");
    const hasCodePattern = codePatterns.some(p => p.test(composerText));
    const punctuationCount = (composerText.match(/[;{}()=<>]/g) || []).length;
    return hasCodePattern || (lines.length >= 2 && punctuationCount > lines.length * 0.8);
  })();
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [imageLightboxUrl, setImageLightboxUrl] = useState("");

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    if (selectedQuestionId) {
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedQuestionId, sourceQuestions]);

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const formatBytes = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  const handlePendingFileAdd = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    
    if (pendingAttachments.length + incoming.length > 5) {
      alert("حداکثر ۵ فایل در هر پیام مجاز است.");
      return;
    }
    
    incoming.forEach(async (file) => {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`فایل «${file.name}» بیشتر از ۱۰ مگابایت است.`);
        return;
      }
      
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const allowed = ["jpg", "jpeg", "png", "webp", "pdf", "txt", "log", "zip"];
      if (!allowed.includes(ext)) {
        alert(`فرمت فایل «${file.name}» مجاز نیست.`);
        return;
      }
      
      const isImage = file.type.startsWith("image/");
      const previewUrl = isImage ? await toDataUrl(file) : undefined;
      
      setPendingAttachments((prev) => [
        ...prev,
        {
          id: `patt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          type: isImage ? "image" : "file",
          previewUrl,
        },
      ]);
    });
  };

  const handleRemovePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdatePendingCaption = (id: string, caption: string) => {
    setPendingAttachments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption } : item))
    );
  };

  const handleSendMessage = async () => {
    if (!composerText.trim() && pendingAttachments.length === 0) return;
    setIsSendingMessage(true);
    try {
      const attachments = await Promise.all(
        pendingAttachments.map(async (item) => {
          const isImage = item.file.type.startsWith("image/");
          const previewUrl = item.previewUrl || (isImage ? await toDataUrl(item.file) : undefined);
          return {
            id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: item.file.name,
            size: item.file.size,
            type: item.file.type || "application/octet-stream",
            previewUrl,
            caption: item.caption || undefined,
          };
        })
      );

      replyToQuestion(selectedQuestionId, composerText.trim(), attachments.length ? attachments : undefined);
      setComposerText("");
      setPendingAttachments([]);
    } catch (err) {
      console.error(err);
      alert("خطا در ارسال پیام. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const renderMessageText = (text: string) => {
    if (!text) return null;
    
    // Auto-detect code block even if user forgot to wrap in backticks
    const hasBackticks = text.includes("```");
    let processedText = text;
    
    if (!hasBackticks) {
      const codePatterns = [
        /import\s+.*\s+from\s+['"].*['"]/i,
        /const\s+\w+\s*=\s*/,
        /let\s+\w+\s*=\s*/,
        /var\s+\w+\s*=\s*/,
        /function\s+\w*\s*\(/,
        /class\s+\w+\s*\{/,
        /public\s+class\s+\w+/,
        /def\s+\w+\s*\(.*\):/,
        /print\(.*\)/,
        /#include\s+<\w+>/,
        /using\s+namespace\s+\w+/,
        /<\?php/,
        /\{\s*[\s\S]*\}/, 
        /\w+\s*\(.*\)\s*\{/
      ];
      const lines = text.split("\n");
      const hasCodePattern = codePatterns.some(p => p.test(text));
      const punctuationCount = (text.match(/[;{}()=<>]/g) || []).length;
      
      if (hasCodePattern || (lines.length >= 2 && punctuationCount > lines.length * 0.8)) {
        processedText = "```code\n" + text + "\n```";
      }
    }

    const parts = processedText.split("```");
    if (parts.length < 3) {
      return <p className="whitespace-pre-wrap text-sm leading-7 font-medium">{processedText}</p>;
    }
    
    return (
      <div className="space-y-2 text-sm leading-7">
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            const lines = part.split("\n");
            let code = part;
            let lang = "";
            if (lines.length > 0 && lines[0].trim().length < 10 && !lines[0].includes(" ") && lines[0].match(/^[a-zA-Z0-9+#-]+$/)) {
              lang = lines[0].trim();
              code = lines.slice(1).join("\n");
            }
            return (
              <div key={index} className="my-2 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-sm" dir="ltr">
                <div className="bg-black/5 dark:bg-black/30 px-4 py-2 text-[10px] font-mono text-gray-500 dark:text-gray-400 border-b border-black/5 dark:border-white/5 flex justify-between items-center select-none">
                  <span>{lang || "code"}</span>
                  <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">CODE</span>
                </div>
                <pre className="font-mono text-xs p-4 bg-gray-50/50 dark:bg-black/20 overflow-x-auto text-left leading-relaxed text-gray-800 dark:text-gray-200 select-all">
                  {code.trim()}
                </pre>
              </div>
            );
          }
          return part ? <span key={index} className="whitespace-pre-wrap font-medium">{part}</span> : null;
        })}
      </div>
    );
  };

  const stats = useMemo(() => {
    const total = sourceQuestions.length;
    const pending = sourceQuestions.filter((q) => q.status === "new").length;
    const answered = sourceQuestions.filter((q) => q.status === "answered").length;
    return { total, pending, answered };
  }, [sourceQuestions]);

  const filteredQuestions = useMemo(() => {
    let result = [...sourceQuestions];

    if (statusFilter !== "all") {
      result = result.filter((q) => q.status === statusFilter);
    }

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

    return result.sort((a, b) => b.id.localeCompare(a.id));
  }, [sourceQuestions, search, statusFilter]);

  return (
    <div className={cn("mx-auto max-w-[1320px] pb-20 text-right animate-in fade-in duration-500", className)} dir="rtl">
      {showHero && <section className="mb-6 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1c1e26] md:p-8">
        <div className="grid items-center gap-5 md:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-2xl font-black leading-tight text-gray-900 dark:text-white md:text-3xl">سوالات دانشجویان</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-gray-500 dark:text-gray-400">
              پاسخگویی به سوالات فنی و رفع اشکال کدهای ارسالی دانشجویان در جلسات مختلف دوره‌ها
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <HelpCircle className="h-8 w-8" />
          </div>
        </div>
      </section>}

      <section className="mb-7 rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#1c1e26] md:p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="relative w-full xl:max-w-md">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در سوالات، دانشجویان یا عنوان دوره‌ها..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200/70 bg-gray-50 pr-12 pl-4 text-sm font-semibold text-gray-800 outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {[
              { id: "all", label: "همه سوالات", count: stats.total },
              { id: "new", label: "جدید", count: stats.pending, color: "text-rose-500" },
              { id: "answered", label: "پاسخ داده شده", count: stats.answered, color: "text-emerald-500" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-xs font-black transition",
                  statusFilter === tab.id
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn("rounded-md bg-gray-200/60 px-1.5 py-0.5 text-[10px] font-black dark:bg-white/10", tab.color)}>
                  {tab.count.toLocaleString("fa-IR")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.6fr_1fr] items-start">
        {/* Left pane: Active Chat Detail */}
        <div className={cn("lg:block", selectedQuestionId ? "block" : "hidden lg:block")}>
          {selectedQuestionId ? (
            (() => {
              const activeQ = sourceQuestions.find((q) => q.id === selectedQuestionId);
              if (!activeQ) return null;

              return (
                <div className="flex flex-col rounded-[2rem] border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1c1e26] overflow-hidden min-h-[550px] animate-in fade-in duration-300">
                  {/* Chat Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedQuestionId("")}
                        className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
                        {activeQ.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={activeQ.avatar} alt={activeQ.studentName} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="text-right">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white">
                          {activeQ.studentName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn(
                            "rounded px-1.5 py-0.5 text-[9px] font-black leading-none",
                            activeQ.status === "new" && "bg-rose-500/10 text-rose-400",
                            activeQ.status === "answered" && "bg-emerald-500/10 text-emerald-400"
                          )}>
                            {activeQ.status === "new" && "جدید"}
                            {activeQ.status === "answered" && "پاسخ داده شده"}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-400">
                            {activeQ.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>


                  </div>

                  {/* Course & Lesson context banner */}
                  <div className="bg-primary/5 dark:bg-primary/5 border-b border-gray-100 dark:border-gray-800/50 px-4 py-2 flex flex-wrap gap-2 text-right">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">دوره: {activeQ.courseTitle}</span>
                    {activeQ.lessonTitle && (
                      <>
                        <span className="text-[10px] text-gray-300 dark:text-gray-700">•</span>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">جلسه: {activeQ.lessonTitle}</span>
                      </>
                    )}
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[480px] min-h-[380px] bg-slate-50/30 dark:bg-black/10">
                    
                    {/* Message 1: Initial Student Post */}
                    <div className="flex justify-end text-right">
                      <div className="max-w-[78%] rounded-2xl rounded-tl-sm p-4 bg-[#e6f7ed] dark:bg-[#143c24]/30 border border-[#d1e7dd]/60 dark:border-[#1e5c37]/30 text-[#0f5132] dark:text-[#a3cfbb] shadow-sm animate-in fade-in duration-300">
                        <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 mb-1.5">{activeQ.title}</h4>
                        
                        <p className="text-sm font-semibold leading-7 whitespace-pre-wrap text-emerald-950 dark:text-[#a3cfbb]/90">
                          {activeQ.description || activeQ.text}
                        </p>

                        {activeQ.errorText && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-gray-200/60 dark:border-white/10 bg-[#f7f8fb] dark:bg-[#14161c]" dir="ltr">
                            <div className="bg-black/5 dark:bg-black/30 px-3 py-1 text-[10px] font-mono text-gray-500 dark:text-gray-400 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                              <span>Error / Log</span>
                            </div>
                            <pre className="font-mono text-xs p-3 overflow-x-auto text-left leading-relaxed text-gray-700 dark:text-gray-300">
                              {activeQ.errorText}
                            </pre>
                          </div>
                        )}

                        {!!activeQ.attachments?.length && (
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {activeQ.attachments.map((file) => (
                              <div key={file.id} className="rounded-xl border border-[#d1e7dd]/50 bg-white/70 dark:border-white/10 dark:bg-white/5 p-2 text-emerald-900 dark:text-emerald-100">
                                {file.type.startsWith("image/") && file.previewUrl ? (
                                  <div className="space-y-2">
                                    <button 
                                      type="button" 
                                      onClick={() => setImageLightboxUrl(file.previewUrl || "")}
                                      className="w-full relative group overflow-hidden rounded-lg cursor-pointer"
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={file.previewUrl} alt={file.name} className="h-32 w-full object-cover transition duration-300 group-hover:scale-105" />
                                    </button>
                                    {file.caption && (
                                      <p className="text-xs leading-6 p-1 bg-black/5 dark:bg-white/5 rounded font-medium text-emerald-800 dark:text-emerald-250">
                                        {file.caption}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <a
                                    href={file.previewUrl || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                  >
                                    <FileText className="h-5 w-5 shrink-0 text-emerald-600/70" />
                                    <div className="min-w-0 flex-1 text-right">
                                      <p className="truncate text-xs font-black">{file.name}</p>
                                      <p className="text-[10px] opacity-70">{formatBytes(file.size)}</p>
                                    </div>
                                    <Download className="w-4 h-4 shrink-0 text-emerald-600/70" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-2 text-left text-[9px] text-emerald-600/75 dark:text-emerald-400/65 font-bold">
                          {activeQ.createdAt}
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {activeQ.replies.map((rep, idx) => {
                      const isInstructor = rep.role === "instructor";
                      return (
                        <div
                          key={idx}
                          className={cn("flex animate-in fade-in duration-300", isInstructor ? "justify-start text-right" : "justify-end text-right")}
                        >
                          <div className={cn(
                            "max-w-[78%] rounded-2xl p-4 shadow-sm",
                            isInstructor 
                              ? "bg-[#f8f9fa] dark:bg-[#252833] text-gray-800 dark:text-gray-100 rounded-tr-sm border border-gray-200 dark:border-white/5"
                              : "bg-[#e6f7ed] dark:bg-[#143c24]/40 text-[#0f5132] dark:text-[#a3cfbb] border border-[#d1e7dd]/60 dark:border-[#1e5c37]/40 rounded-tl-sm"
                          )}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              {isInstructor && (
                                <span className="rounded bg-indigo-600 dark:bg-indigo-500 px-1.5 py-0.5 text-[9px] font-black text-white leading-none">
                                  مدرس
                                </span>
                              )}
                              <p className={cn("text-[10px] font-black", isInstructor ? "text-indigo-600 dark:text-indigo-400" : "text-emerald-700 dark:text-emerald-300")}>
                                {rep.senderName}
                              </p>
                            </div>

                            {renderMessageText(rep.text)}

                            {!!rep.attachments?.length && (
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {rep.attachments.map((file) => (
                                  <div
                                    key={file.id}
                                    className={cn(
                                      "rounded-xl border p-2",
                                      isInstructor 
                                        ? "border-white/10 bg-black/10 text-white"
                                        : "border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-white/5 text-gray-800 dark:text-white"
                                    )}
                                  >
                                    {file.type.startsWith("image/") && file.previewUrl ? (
                                      <div className="space-y-2">
                                        <button
                                          type="button"
                                          onClick={() => setImageLightboxUrl(file.previewUrl || "")}
                                          className="w-full relative group overflow-hidden rounded-lg cursor-pointer"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={file.previewUrl} alt={file.name} className="h-32 w-full object-cover transition duration-300 group-hover:scale-105" />
                                        </button>
                                        {file.caption && (
                                          <p className={cn("text-xs leading-6 p-1 rounded font-medium", isInstructor ? "text-white opacity-90 bg-black/5" : "text-gray-600 dark:text-gray-300 bg-black/5 dark:bg-white/5")}>
                                            {file.caption}
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <a
                                        href={file.previewUrl || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                      >
                                        <FileText className="h-5 w-5 shrink-0" />
                                        <div className="min-w-0 flex-1 text-right">
                                          <p className="truncate text-xs font-black">{file.name}</p>
                                          <p className="text-[10px] opacity-70">{formatBytes(file.size)}</p>
                                        </div>
                                        <Download className="w-4 h-4 shrink-0" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className={cn("mt-2 text-left text-[9px]", isInstructor ? "opacity-75" : "text-gray-400")}>
                              {rep.createdAt}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Composer */}
                  <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-[#1c1e26] shrink-0">
                    <div className="space-y-3 text-right">
                        {/* Media Previews */}
                        {pendingAttachments.length > 0 && (
                          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-[#14161c]/50 p-3 max-h-[220px] overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {pendingAttachments.map((item) => (
                                <div key={item.id} className="relative rounded-xl border border-gray-100 bg-white p-3 dark:border-white/5 dark:bg-gray-800 animate-in zoom-in-95 duration-200">
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePendingAttachment(item.id)}
                                    className="absolute left-2 top-2 rounded-full bg-black/60 hover:bg-black/80 p-1 text-white transition-colors cursor-pointer z-10"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>

                                  {item.type === "image" ? (
                                    <div className="space-y-3">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={item.previewUrl}
                                        alt={item.file.name}
                                        className="h-28 w-full rounded-lg object-cover"
                                      />
                                      <input
                                        value={item.caption || ""}
                                        onChange={(e) => handleUpdatePendingCaption(item.id, e.target.value)}
                                        placeholder="کپشن عکس را بنویسید..."
                                        className="w-full rounded-xl border border-gray-200/70 bg-gray-50 px-3 py-2 text-xs outline-none transition focus:border-primary focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-white/5">
                                      <FileText className="h-6 w-6 text-gray-400" />
                                      <div className="min-w-0 flex-1 text-right">
                                        <p className="truncate text-xs font-bold text-gray-700 dark:text-gray-200">{item.file.name}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{formatBytes(item.file.size)}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Inputs Row */}
                        <div className="relative flex items-end gap-3 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-[#14161c]/40 p-2.5 pr-4 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-white dark:focus-within:bg-[#14161c] transition-all duration-300 shadow-inner">
                          {isInputCode && (
                            <span className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black tracking-wider shadow-sm select-none animate-in fade-in zoom-in duration-200">
                              کد شناسایی شد / CODE MODE
                            </span>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById("instructor-attachment-picker");
                              el?.click();
                            }}
                            className="w-10 h-10 rounded-full bg-gray-200/60 dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/20 text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
                            title="افزودن فایل ضمیمه"
                          >
                            <Paperclip className="w-5 h-5" />
                          </button>
                          
                          <input
                            id="instructor-attachment-picker"
                            type="file"
                            multiple
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.log,.zip"
                            onChange={(e) => handlePendingFileAdd(e.target.files)}
                          />

                          <textarea
                            value={composerText}
                            onChange={(e) => setComposerText(e.target.value)}
                            placeholder="پاسخ فنی خود را بنویسید..."
                            rows={1}
                            className={cn(
                              "flex-1 max-h-32 min-h-10 outline-none resize-none bg-transparent py-2 text-sm leading-6 transition-all duration-300 font-medium placeholder-gray-400 dark:placeholder-gray-500",
                              isInputCode
                                ? "text-left font-mono text-xs text-gray-800 dark:text-gray-200 bg-black/[0.04] dark:bg-black/35 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner"
                                : "text-right text-gray-800 dark:text-white"
                            )}
                            dir={isInputCode ? "ltr" : "rtl"}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                              }
                            }}
                          />

                          <button
                            type="button"
                            disabled={(!composerText.trim() && pendingAttachments.length === 0) || isSendingMessage}
                            onClick={handleSendMessage}
                            className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary via-indigo-600 to-indigo-500 text-white hover:opacity-95 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all duration-300 shrink-0 cursor-pointer"
                          >
                            {isSendingMessage ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Send className="w-5 h-5 rotate-180" />
                            )}
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            /* Glassmorphism empty state placeholder */
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-150 bg-white/40 dark:border-white/5 dark:bg-white/5 p-12 text-center shadow-sm min-h-[550px] backdrop-blur-sm">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary animate-pulse">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-black text-gray-900 dark:text-white">انتخاب گفتگو</h3>
              <p className="max-w-sm text-sm font-semibold leading-7 text-gray-400">
                یک گفتگو را از لیست برای شروع پاسخگویی و رفع اشکال انتخاب کنید.
              </p>
            </div>
          )}
        </div>

        {/* Right pane: Thread List */}
        <div className={cn("lg:block", selectedQuestionId ? "hidden lg:block" : "block")}>
          {filteredQuestions.length === 0 ? (
            <section className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-white/5 dark:bg-[#1c1e26]">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-black text-gray-900 dark:text-white">هیچ سوالی یافت نشد</h3>
              <p className="max-w-sm text-sm font-semibold leading-7 text-gray-400">
                سوالی مطابق فیلترها یا عبارت جستجوی فعلی پیدا نشد.
              </p>
            </section>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q) => {
                const isActive = q.id === selectedQuestionId;
                const lastRep = q.replies[q.replies.length - 1];
                const snippet = lastRep ? lastRep.text : (q.description || q.text);

                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestionId(q.id);
                      setComposerText("");
                      setPendingAttachments([]);
                    }}
                    className={cn(
                      "group relative rounded-[1.75rem] border p-5 shadow-sm transition duration-300 cursor-pointer flex flex-col gap-3",
                      isActive
                        ? "border-primary/20 bg-primary/5 dark:bg-primary/5"
                        : "border-gray-100 bg-white hover:border-primary/20 hover:bg-primary/5 dark:border-white/5 dark:bg-[#1c1e26]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
                          {q.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={q.avatar} alt={q.studentName} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="text-right">
                          <h4 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {q.studentName}
                          </h4>
                          <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                            {q.createdAt}
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-[10px] font-black",
                          q.status === "new" && "bg-rose-500/10 text-rose-400",
                          q.status === "answered" && "bg-emerald-500/10 text-emerald-400"
                        )}
                      >
                        {q.status === "new" && "جدید"}
                        {q.status === "answered" && "پاسخ داده شده"}
                      </span>
                    </div>

                    <div className="text-right">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                        {q.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {snippet}
                      </p>
                    </div>

                    <div className="mt-1 pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[9px] font-bold text-gray-400">
                        {q.courseTitle}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800/80 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors shadow-sm">
                        <ChevronLeft className="w-4 h-4 text-right" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {imageLightboxUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 animate-in fade-in duration-200">
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setImageLightboxUrl("")}
              className="absolute -top-12 left-0 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageLightboxUrl} alt="Preview" className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
