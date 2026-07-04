"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FileText, HelpCircle, Paperclip, Search, User, Send, Loader2, Download, ArrowRight, X, ChevronLeft, MessageSquare } from "lucide-react";
import { useInstructorData, type StudentQuestion } from "@/context/InstructorDataContext";
import { cn } from "@/lib/utils";

type QuestionChatMessage = {
  id: string;
  role: "instructor" | "student";
  senderName: string;
  text: string;
  courseTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  errorText?: string;
  attachments?: StudentQuestion["attachments"];
  createdAt: string;
  createdAtIso?: string;
  sortMs: number;
  sequence: number;
};

type QuestionThread = {
  id: string;
  studentName: string;
  avatar?: string;
  courseId: string;
  courseTitle: string;
  lessonTitles: string[];
  status: "new" | "answered";
  createdAt: string;
  updatedAt: string;
  updatedAtMs: number;
  latestStudentMessageMs: number;
  title: string;
  questions: StudentQuestion[];
  primaryQuestionId: string;
};

function parseActivityTimestamp(label?: string, iso?: string): number {
  if (iso) {
    const parsedIso = Date.parse(iso);
    if (!Number.isNaN(parsedIso)) return parsedIso;
  }
  if (label) {
    const parsedLabel = Date.parse(label);
    if (!Number.isNaN(parsedLabel)) return parsedLabel;
  }
  return 0;
}

function getQuestionActivityMs(question: StudentQuestion): number {
  let latest = parseActivityTimestamp(question.createdAt, question.createdAtIso);
  for (const reply of question.replies) {
    latest = Math.max(latest, parseActivityTimestamp(reply.createdAt, reply.createdAtIso));
  }
  return latest;
}

function getQuestionLatestStudentMessageMs(question: StudentQuestion): number {
  let latest = parseActivityTimestamp(question.createdAt, question.createdAtIso);
  for (const reply of question.replies) {
    if (reply.role !== "student") continue;
    latest = Math.max(latest, parseActivityTimestamp(reply.createdAt, reply.createdAtIso));
  }
  return latest;
}

function formatActivityLabel(ms: number, fallback: string): string {
  if (ms > 0) return new Date(ms).toLocaleDateString("fa-IR");
  return fallback;
}

function parseQuestionTimestamp(value: string, iso?: string): number {
  return parseActivityTimestamp(value, iso);
}

function compareQuestionsByCreatedAt(a: StudentQuestion, b: StudentQuestion): number {
  const aMs = parseQuestionTimestamp(a.createdAt, a.createdAtIso);
  const bMs = parseQuestionTimestamp(b.createdAt, b.createdAtIso);
  if (aMs > 0 && bMs > 0 && aMs !== bMs) return aMs - bMs;
  if (aMs > 0 && bMs === 0) return -1;
  if (aMs === 0 && bMs > 0) return 1;
  return 0;
}

function getQuestionThreadKey(question: StudentQuestion): string {
  const studentKey = question.studentId || question.studentName;
  return `${question.courseId}::${studentKey}`;
}

function resolveAnswerTargetQuestion(questions: StudentQuestion[]): StudentQuestion {
  const sortedAsc = [...questions].sort(
    (a, b) => getQuestionActivityMs(a) - getQuestionActivityMs(b)
  );
  let target = sortedAsc[sortedAsc.length - 1];

  for (const question of sortedAsc) {
    const instructorReplies = question.replies.filter((reply) => reply.role === "instructor");
    if (!instructorReplies.length) continue;

    const lastInstructorMs = Math.max(
      ...instructorReplies.map((reply) => parseActivityTimestamp(reply.createdAt, reply.createdAtIso))
    );
    const laterStudentExists = sortedAsc.some((candidate) => {
      if (candidate.id === question.id) return false;
      const candidateMs = parseActivityTimestamp(candidate.createdAt, candidate.createdAtIso);
      return candidateMs > lastInstructorMs;
    });

    if (!laterStudentExists) {
      target = question;
    }
  }

  return target;
}

function groupQuestionsIntoThreads(questions: StudentQuestion[]): QuestionThread[] {
  const grouped = new Map<string, StudentQuestion[]>();

  for (const question of questions) {
    const key = getQuestionThreadKey(question);
    const current = grouped.get(key) ?? [];
    current.push(question);
    grouped.set(key, current);
  }

  return Array.from(grouped.entries())
    .map(([id, threadQuestions]) => {
      const sorted = [...threadQuestions].sort(compareQuestionsByCreatedAt);
      const first = sorted[0];
      const answerTarget = resolveAnswerTargetQuestion(sorted);
      const latestActivityMs = sorted.reduce(
        (max, question) => Math.max(max, getQuestionActivityMs(question)),
        0
      );
      const latestStudentMessageMs = sorted.reduce(
        (max, question) => Math.max(max, getQuestionLatestStudentMessageMs(question)),
        0
      );
      const lessonTitles = Array.from(
        new Set(sorted.map((question) => question.lessonTitle).filter(Boolean) as string[])
      );

      return {
        id,
        studentName: first.studentName,
        avatar: first.avatar,
        courseId: first.courseId,
        courseTitle: first.courseTitle,
        lessonTitles,
        status: sorted.some((item) => item.status === "new") ? "new" : "answered",
        createdAt: first.createdAt,
        updatedAt: formatActivityLabel(latestStudentMessageMs || latestActivityMs, answerTarget.createdAt),
        updatedAtMs: latestActivityMs,
        latestStudentMessageMs,
        title: first.title,
        questions: sorted,
        primaryQuestionId: answerTarget.id,
      } satisfies QuestionThread;
    })
    .sort((a, b) => b.latestStudentMessageMs - a.latestStudentMessageMs || b.updatedAtMs - a.updatedAtMs);
}

function dedupeChatMessages(messages: QuestionChatMessage[]): QuestionChatMessage[] {
  const ordered: QuestionChatMessage[] = [];
  for (const message of messages) {
    if (ordered.some((existing) => existing.id === message.id)) continue;
    ordered.push(message);
  }
  return ordered;
}

function compareChatMessages(a: QuestionChatMessage, b: QuestionChatMessage): number {
  const aSort = a.sortMs > 0 ? a.sortMs : Number.MAX_SAFE_INTEGER;
  const bSort = b.sortMs > 0 ? b.sortMs : Number.MAX_SAFE_INTEGER;
  if (aSort !== bSort) return aSort - bSort;
  return a.sequence - b.sequence;
}

function buildThreadChatMessages(thread: QuestionThread): QuestionChatMessage[] {
  const messages: QuestionChatMessage[] = [];
  let sequence = 0;

  thread.questions.forEach((question) => {
    messages.push({
      id: `${question.id}-initial`,
      role: "student",
      senderName: question.studentName,
      text: question.description || question.text,
      courseTitle: question.courseTitle,
      lessonId: question.lessonId,
      lessonTitle: question.lessonTitle,
      errorText: question.errorText,
      attachments: question.attachments,
      createdAt: question.createdAt,
      createdAtIso: question.createdAtIso,
      sortMs: parseActivityTimestamp(question.createdAt, question.createdAtIso),
      sequence: sequence++,
    });

    question.replies.forEach((reply, replyIndex) => {
      messages.push({
        id: `${question.id}-reply-${reply.id ?? replyIndex}`,
        role: reply.role,
        senderName: reply.senderName,
        text: reply.text,
        courseTitle: question.courseTitle,
        lessonId: question.lessonId,
        lessonTitle: question.lessonTitle,
        attachments: reply.attachments,
        createdAt: reply.createdAt,
        createdAtIso: reply.createdAtIso,
        sortMs: parseActivityTimestamp(reply.createdAt, reply.createdAtIso),
        sequence: sequence++,
      });
    });
  });

  return dedupeChatMessages(messages).sort(compareChatMessages);
}

function getThreadSnippet(thread: QuestionThread): string {
  const messages = buildThreadChatMessages(thread);
  const studentMessages = messages.filter((message) => message.role === "student");
  const lastMessage = studentMessages[studentMessages.length - 1] ?? messages[messages.length - 1];
  return lastMessage?.text || thread.title;
}

function isGroupedWithPrevious(messages: QuestionChatMessage[], index: number): boolean {
  if (index === 0) return false;
  const prev = messages[index - 1];
  const curr = messages[index];
  return prev.role === curr.role && prev.senderName === curr.senderName;
}

type Props = {
  showHero?: boolean;
  filterCourseId?: string;
  className?: string;
};

const THREADS_PAGE_SIZE = 6;

function ThreadPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const showAllPages = totalPages <= 7;
  const pages = showAllPages ? Array.from({ length: totalPages }, (_, index) => index + 1) : [];

  return (
    <div className="shrink-0 border-t border-gray-100 px-1 pt-3 dark:border-gray-800">
      <p className="mb-2 text-center text-[10px] font-semibold text-gray-400">
        نمایش {((currentPage - 1) * THREADS_PAGE_SIZE + 1).toLocaleString("fa-IR")} تا{" "}
        {Math.min(currentPage * THREADS_PAGE_SIZE, totalItems).toLocaleString("fa-IR")} از{" "}
        {totalItems.toLocaleString("fa-IR")} گفتگو
      </p>
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 rounded-2xl border border-gray-100 bg-white p-1.5 dark:border-white/5 dark:bg-[#1c1e26]">
          <button
            type="button"
            aria-label="صفحه قبل"
            disabled={!canGoPrev}
            onClick={() => onPageChange(currentPage - 1)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
              canGoPrev
                ? "cursor-pointer bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
                : "cursor-not-allowed bg-gray-50 text-gray-300 dark:bg-white/5 dark:text-gray-600"
            )}
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>

          {showAllPages ? (
            pages.map((page) => (
              <button
                key={page}
                type="button"
                aria-label={`صفحه ${page.toLocaleString("fa-IR")}`}
                aria-current={currentPage === page ? "page" : undefined}
                onClick={() => onPageChange(page)}
                className={cn(
                  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-xs font-black transition-all",
                  currentPage === page
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
                )}
              >
                {page.toLocaleString("fa-IR")}
              </button>
            ))
          ) : (
            <span className="min-w-[4.5rem] px-2 text-center text-xs font-black text-gray-600 dark:text-gray-300">
              {currentPage.toLocaleString("fa-IR")} / {totalPages.toLocaleString("fa-IR")}
            </span>
          )}

          <button
            type="button"
            aria-label="صفحه بعد"
            disabled={!canGoNext}
            onClick={() => onPageChange(currentPage + 1)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
              canGoNext
                ? "cursor-pointer bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10"
                : "cursor-not-allowed bg-gray-50 text-gray-300 dark:bg-white/5 dark:text-gray-600"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InstructorQuestionsBoard({ showHero = true, filterCourseId, className }: Props) {
  const { questions, replyToQuestion } = useInstructorData();
  const sourceQuestions = useMemo(
    () => (filterCourseId ? questions.filter((q) => q.courseId === filterCourseId) : questions),
    [questions, filterCourseId]
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [threadPage, setThreadPage] = useState(1);

  // --- Telegram Q&A Chat States & Helpers ---
  type PendingAttachment = {
    id: string;
    file: File;
    type: "image" | "file";
    previewUrl?: string;
    caption?: string;
  };

  const [selectedThreadId, setSelectedThreadId] = useState("");
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
  const [threadChatMessages, setThreadChatMessages] = useState<QuestionChatMessage[]>([]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const questionThreads = useMemo(
    () => groupQuestionsIntoThreads(sourceQuestions),
    [sourceQuestions]
  );

  const activeThread = useMemo(
    () => questionThreads.find((thread) => thread.id === selectedThreadId) ?? null,
    [questionThreads, selectedThreadId]
  );

  const loadThreadChat = React.useCallback(
    (thread: QuestionThread) => {
      setThreadChatMessages(buildThreadChatMessages(thread));
    },
    []
  );

  React.useEffect(() => {
    if (!activeThread) {
      setThreadChatMessages([]);
      return;
    }
    loadThreadChat(activeThread);
  }, [activeThread, loadThreadChat]);

  const activeChatMessages = threadChatMessages.length
    ? threadChatMessages
    : activeThread
      ? buildThreadChatMessages(activeThread)
      : [];
  const lastActiveMessageId = activeChatMessages[activeChatMessages.length - 1]?.id;

  React.useEffect(() => {
    if (selectedThreadId) {
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedThreadId, activeChatMessages.length, lastActiveMessageId]);

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
    if (!activeThread || (!composerText.trim() && pendingAttachments.length === 0) || isSendingMessage) return;

    const textToSend = composerText.trim();
    const attachmentsToSend = pendingAttachments;

    setComposerText("");
    setPendingAttachments([]);
    setIsSendingMessage(true);

    try {
      const attachments = await Promise.all(
        attachmentsToSend.map(async (item) => {
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

      await replyToQuestion(
        activeThread.primaryQuestionId,
        textToSend,
        attachments.length ? attachments : undefined
      );
      loadThreadChat(activeThread);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error(err);
      setComposerText(textToSend);
      setPendingAttachments(attachmentsToSend);
      alert("خطا در ارسال پیام. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const renderMessageAttachments = (
    files: NonNullable<StudentQuestion["attachments"]>,
    isInstructor: boolean
  ) => (
    <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            "overflow-hidden rounded-xl border",
            isInstructor
              ? "border-emerald-200/60 bg-white/80 text-emerald-900 dark:border-emerald-700/30 dark:bg-black/15 dark:text-emerald-100"
              : "border-white/15 bg-white/10 text-gray-100 dark:border-white/10 dark:bg-black/30"
          )}
        >
          {file.type.startsWith("image/") && file.previewUrl ? (
            <div className="p-1.5">
              <button
                type="button"
                onClick={() => setImageLightboxUrl(file.previewUrl || "")}
                className="group relative w-full cursor-pointer overflow-hidden rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="h-32 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </button>
              {file.caption ? (
                <p
                  className={cn(
                    "mt-1.5 rounded-lg px-2 py-1 text-xs font-medium leading-6",
                    isInstructor
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "bg-white/10 text-gray-200"
                  )}
                >
                  {file.caption}
                </p>
              ) : null}
            </div>
          ) : (
            <a
              href={file.previewUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex cursor-pointer items-center gap-2 p-2.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5"
            >
              <FileText className="h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1 text-right">
                <p className="truncate text-xs font-black">{file.name}</p>
                <p className="text-[10px] opacity-70">{formatBytes(file.size)}</p>
              </div>
              <Download className="h-4 w-4 shrink-0" />
            </a>
          )}
        </div>
      ))}
    </div>
  );

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
      return <p className="whitespace-pre-wrap font-medium">{processedText}</p>;
    }
    
    return (
      <div className="space-y-2">
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
    const total = questionThreads.length;
    const pending = questionThreads.filter((thread) => thread.status === "new").length;
    const answered = questionThreads.filter((thread) => thread.status === "answered").length;
    return { total, pending, answered };
  }, [questionThreads]);

  const filteredThreads = useMemo(() => {
    let result = [...questionThreads];

    if (statusFilter !== "all") {
      result = result.filter((thread) => thread.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (thread) =>
          thread.title.toLowerCase().includes(q) ||
          thread.studentName.toLowerCase().includes(q) ||
          thread.courseTitle.toLowerCase().includes(q) ||
          thread.lessonTitles.some((lessonTitle) => lessonTitle.toLowerCase().includes(q)) ||
          thread.questions.some(
            (question) =>
              question.title.toLowerCase().includes(q) ||
              question.text.toLowerCase().includes(q) ||
              (question.description || "").toLowerCase().includes(q)
          )
      );
    }

    return result.sort(
      (a, b) => b.latestStudentMessageMs - a.latestStudentMessageMs || b.updatedAtMs - a.updatedAtMs
    );
  }, [questionThreads, search, statusFilter]);

  const totalThreadPages = Math.max(1, Math.ceil(filteredThreads.length / THREADS_PAGE_SIZE));
  const safeThreadPage = Math.min(threadPage, totalThreadPages);

  const paginatedThreads = useMemo(() => {
    const start = (safeThreadPage - 1) * THREADS_PAGE_SIZE;
    return filteredThreads.slice(start, start + THREADS_PAGE_SIZE);
  }, [filteredThreads, safeThreadPage]);

  useEffect(() => {
    setThreadPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (threadPage > totalThreadPages) {
      setThreadPage(totalThreadPages);
    }
  }, [threadPage, totalThreadPages]);

  return (
    <div className={cn("mx-auto max-w-[1320px] pb-8 text-right animate-in fade-in duration-500", className)} dir="rtl">
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
                  "inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 text-xs font-black transition",
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

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.6fr_1fr] items-stretch lg:max-h-[calc(100vh-220px)]">
        {/* Left pane: Active Chat Detail */}
        <div className={cn("lg:block lg:min-h-0", selectedThreadId ? "block" : "hidden lg:block")}>
          {activeThread ? (
                <div className="flex h-full max-h-[calc(100vh-220px)] flex-col rounded-[2rem] border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1c1e26] overflow-hidden min-h-[550px] animate-in fade-in duration-300">
                  {/* Chat Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedThreadId("")}
                        className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
                        {activeThread.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={activeThread.avatar} alt={activeThread.studentName} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="text-right">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white">
                          {activeThread.studentName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn(
                            "rounded px-1.5 py-0.5 text-[9px] font-black leading-none",
                            activeThread.status === "new" && "bg-rose-500/10 text-rose-400",
                            activeThread.status === "answered" && "bg-emerald-500/10 text-emerald-400"
                          )}>
                            {activeThread.status === "new" && "جدید"}
                            {activeThread.status === "answered" && "پاسخ داده شده"}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-400">
                            {activeThread.updatedAt}
                          </span>
                          {activeThread.questions.length > 1 ? (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-black text-gray-500 dark:bg-white/10 dark:text-gray-300">
                              {activeThread.questions.length.toLocaleString("fa-IR")} پیام
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course & Lesson context banner */}
                  <div className="bg-primary/5 dark:bg-primary/5 border-b border-gray-100 dark:border-gray-800/50 px-4 py-2 flex flex-wrap gap-2 text-right">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">دوره: {activeThread.courseTitle}</span>
                    {activeThread.lessonTitles.length > 0 && (
                      <>
                        <span className="text-[10px] text-gray-300 dark:text-gray-700">•</span>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                          {activeThread.lessonTitles.length.toLocaleString("fa-IR")} باکس درس
                        </span>
                      </>
                    )}
                  </div>

                  {/* Messages Area */}
                  <div
                    className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 max-h-[480px] min-h-[380px] bg-[#f4f6f9] dark:bg-[#12141a] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.035)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:20px_20px]"
                    dir="rtl"
                  >
                    <div className="flex flex-col gap-1">
                      {activeChatMessages.map((message, messageIndex) => {
                        const isInstructor = message.role === "instructor";
                        const isGrouped = isGroupedWithPrevious(activeChatMessages, messageIndex);

                        return (
                          <div
                            key={message.id}
                            className={cn(
                              "flex w-full animate-in fade-in duration-300",
                              isGrouped ? "mt-0.5" : "mt-3 first:mt-0",
                              isInstructor ? "justify-start" : "justify-end"
                            )}
                          >
                            <div className="max-w-[min(88%,520px)]">
                              <div className="min-w-0 text-right">
                                <div
                                  className={cn(
                                    "group/message relative px-3.5 py-2.5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg",
                                    isGrouped
                                      ? "rounded-2xl"
                                      : isInstructor
                                        ? "rounded-2xl rounded-bl-md"
                                        : "rounded-2xl rounded-br-md",
                                    isInstructor
                                      ? "bg-gradient-to-br from-emerald-50 via-white to-teal-50/90 text-emerald-950 shadow-emerald-900/[0.04] ring-1 ring-emerald-200/70 dark:from-emerald-950/50 dark:via-[#1a2420] dark:to-teal-950/40 dark:text-emerald-50 dark:ring-emerald-700/25"
                                      : "bg-gray-900 text-white shadow-black/20 ring-1 ring-gray-800 dark:bg-[#0f1115] dark:ring-white/10"
                                  )}
                                >
                                  {message.lessonTitle ? (
                                    <div
                                      className={cn(
                                        "mb-0 flex max-h-0 max-w-full translate-y-1 items-center overflow-hidden rounded-full px-2.5 py-0 text-[10px] font-black opacity-0 blur-[1px] transition-all duration-300 ease-out group-hover/message:mb-2 group-hover/message:max-h-8 group-hover/message:translate-y-0 group-hover/message:py-1 group-hover/message:opacity-100 group-hover/message:blur-0",
                                        isInstructor
                                          ? "bg-emerald-100/90 text-emerald-700 shadow-sm shadow-emerald-900/5 dark:bg-emerald-500/10 dark:text-emerald-200"
                                          : "bg-white/10 text-gray-200 shadow-sm shadow-black/10"
                                      )}
                                      title={message.lessonId ? `شناسه درس: ${message.lessonId}` : undefined}
                                    >
                                      <span className="truncate">بخش دوره: {message.lessonTitle}</span>
                                    </div>
                                  ) : null}
                                  <div
                                    className={cn(
                                      "text-[13px] leading-[1.75]",
                                      isInstructor
                                        ? "text-emerald-950 dark:text-emerald-50"
                                        : "text-gray-100"
                                    )}
                                  >
                                    {renderMessageText(message.text)}
                                  </div>

                                  {message.errorText ? (
                                    <div
                                      className="mt-2.5 overflow-hidden rounded-xl border border-rose-200/60 bg-rose-50/50 dark:border-rose-500/20 dark:bg-rose-950/30"
                                      dir="ltr"
                                    >
                                      <div className="flex items-center justify-between border-b border-rose-200/50 bg-rose-100/50 px-3 py-1.5 text-[10px] font-mono text-rose-600 dark:border-rose-500/15 dark:bg-rose-950/50 dark:text-rose-300">
                                        <span>Error / Log</span>
                                      </div>
                                      <pre className="overflow-x-auto p-3 text-left font-mono text-xs leading-relaxed text-rose-900 dark:text-rose-100">
                                        {message.errorText}
                                      </pre>
                                    </div>
                                  ) : null}

                                  {message.attachments?.length
                                    ? renderMessageAttachments(message.attachments, isInstructor)
                                    : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

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
                            disabled={isSendingMessage}
                            className={cn(
                              "flex-1 max-h-32 min-h-10 outline-none resize-none bg-transparent py-2 text-sm leading-6 transition-all duration-300 font-medium placeholder-gray-400 dark:placeholder-gray-500 disabled:cursor-not-allowed disabled:opacity-60",
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
                            disabled={isSendingMessage || (!composerText.trim() && pendingAttachments.length === 0)}
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
          ) : (
            /* Glassmorphism empty state placeholder */
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-150 bg-white/40 dark:border-white/5 dark:bg-white/5 p-12 text-center shadow-sm min-h-[550px] max-h-[calc(100vh-220px)] backdrop-blur-sm">
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
        <div className={cn("lg:block lg:min-h-0", selectedThreadId ? "hidden lg:block" : "block")}>
          {filteredThreads.length === 0 ? (
            <section className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-white/5 dark:bg-[#1c1e26] max-h-[calc(100vh-220px)]">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-black text-gray-900 dark:text-white">هیچ سوالی یافت نشد</h3>
              <p className="max-w-sm text-sm font-semibold leading-7 text-gray-400">
                سوالی مطابق فیلترها یا عبارت جستجوی فعلی پیدا نشد.
              </p>
            </section>
          ) : (
            <div className="flex max-h-[calc(100vh-220px)] flex-col rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#1c1e26] sm:p-5">
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              {paginatedThreads.map((thread) => {
                const isActive = thread.id === selectedThreadId;
                const snippet = getThreadSnippet(thread);

                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setSelectedThreadId(thread.id);
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
                          {thread.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thread.avatar} alt={thread.studentName} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="text-right">
                          <h4 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {thread.studentName}
                          </h4>
                          <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                            {thread.updatedAt}
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-[10px] font-black",
                          thread.status === "new" && "bg-rose-500/10 text-rose-400",
                          thread.status === "answered" && "bg-emerald-500/10 text-emerald-400"
                        )}
                      >
                        {thread.status === "new" && "جدید"}
                        {thread.status === "answered" && "پاسخ داده شده"}
                      </span>
                    </div>

                    <div className="text-right">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                        {thread.courseTitle}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {snippet}
                      </p>
                    </div>

                    <div className="mt-1 pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800/80 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors shadow-sm">
                        <ChevronLeft className="w-4 h-4 text-right" />
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              <ThreadPagination
                currentPage={safeThreadPage}
                totalPages={totalThreadPages}
                totalItems={filteredThreads.length}
                onPageChange={setThreadPage}
              />
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
