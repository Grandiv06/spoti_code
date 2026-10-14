"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import CustomVideoPlayer from "@/components/panel/CustomVideoPlayer";
import { Copy, Download, Loader2, MonitorPlay, Paperclip, ShieldCheck, UploadCloud, X, Send, FileText, MessageSquare, GraduationCap, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  completeCourseLesson,
  fetchCourseLearningPage,
  fetchCourseLessonById,
  findFirstUnlockedLessonId,
  mapStepsToChapters,
  mergeLessonDetail,
  readCourseMeta,
  unwrapApiData,
} from "@/lib/course-learning";
import {
  buildCourseQuestionText,
  createLearningCourseQuestion,
  fetchLearningCourseChatMessages,
  hasInstructorReply,
  mergeLessonChatMessages,
  type LessonChatMessage,
} from "@/lib/course-qa";
import CourseLearningSkeleton from "./CourseLearningSkeleton";
import { formatVideoDuration, readVideoDurationFromUrl } from "@/lib/video-duration";

type LearningAttachment = { name: string; size: string; url?: string };
type LearningLesson = {
  id: string;
  title: string;
  duration: string;
  isWatched: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl?: string;
  description: string;
  attachments: LearningAttachment[];
};
type LearningChapter = {
  id: string;
  title: string;
  lessons: LearningLesson[];
};
type LearningCourseData = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  playerType: "internal" | "spotplayer";
  chapters: LearningChapter[];
  licenseKey?: string;
  downloadLinks?: {
    windows: string;
    android: string;
    mac: string;
  };
};

const createEmptyCourseData = (id: string): LearningCourseData => ({
  id,
  title: "در حال بارگذاری دوره",
  instructor: "",
  progress: 0,
  playerType: "internal",
  chapters: [],
});

type ComposerBlock =
  | {
      id: string;
      type: "text";
      content: string;
    }
  | {
      id: string;
      type: "code";
      language?: string;
      content: string;
    };


const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf", "txt", "log"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_COUNT = 4;

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

const normalizePersianDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));

const formatTimeLabel = (dateIso?: string, fallback?: string) => {
  if (dateIso) {
    const d = new Date(dateIso);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
    }
  }
  const normalizedFallback = fallback ? normalizePersianDigits(fallback.trim()) : "";
  if (/^\d{1,2}:\d{2}$/.test(normalizedFallback)) {
    return fallback?.trim() || normalizedFallback;
  }
  if (fallback && fallback.trim()) return fallback.trim();
  return "";
};

const formatDateTooltip = (dateIso?: string, fallback?: string) => {
  if (dateIso) {
    const d = new Date(dateIso);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("fa-IR");
    }
  }
  return fallback || "";
};

const makeBlockId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const detectCodeFromText = (input: string): { isCode: boolean; code: string; language?: string } => {
  const text = input.trim();
  if (!text) return { isCode: false, code: "" };

  const fenced = text.match(/```([a-zA-Z0-9+#-]*)\n?([\s\S]*?)```/);
  if (fenced) {
    return {
      isCode: true,
      language: fenced[1] || "code",
      code: fenced[2]?.trim() || "",
    };
  }

  const codePatterns = [
    /import\s+.*\s+from\s+['"].*['"]/i,
    /const\s+\w+\s*=\s*/,
    /let\s+\w+\s*=\s*/,
    /var\s+\w+\s*=\s*/,
    /function\s+\w*\s*\(/,
    /class\s+\w+\s*\{/,
    /def\s+\w+\s*\(.*\):/,
    /#include\s+<\w+>/,
    /using\s+namespace\s+\w+/,
    /<\?php/,
    /\w+\s*\(.*\)\s*\{/,
  ];

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return { isCode: false, code: "" };
  const codeLikeLines = lines.filter((line) => codePatterns.some((p) => p.test(line)) || /[;{}()[\]=<>]/.test(line)).length;
  const persianWords = (text.match(/[آ-ی]{3,}/g) || []).length;
  const ratio = codeLikeLines / lines.length;
  return { isCode: ratio >= 0.7 && persianWords <= 2, code: text, language: "code" };
};

export default function CourseLearningClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId =
    searchParams.get("courseId")?.trim() ||
    (typeof params.courseId === "string" ? params.courseId : "") ||
    "react";
  const fallbackCourseData = useMemo(() => createEmptyCourseData(courseId), [courseId]);

  const [courseData, setCourseData] = useState<LearningCourseData>(fallbackCourseData);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseLoadError, setCourseLoadError] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState(fallbackCourseData.chapters[0]?.lessons[0]?.id ?? "");
  const [activeLessonDetail, setActiveLessonDetail] = useState<LearningLesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [completingLesson, setCompletingLesson] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [expandedChapters, setExpandedChapters] = useState<string[]>(
    courseData.chapters[0]?.id ? [courseData.chapters[0].id] : []
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionErrorText, setQuestionErrorText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [lessonChatMessages, setLessonChatMessages] = useState<LessonChatMessage[]>([]);
  const [instructorChatName, setInstructorChatName] = useState("");
  const [resolvedCourseId, setResolvedCourseId] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);
  /** Real durations measured from video metadata (overrides stored placeholders like 10:00). */
  const [resolvedDurations, setResolvedDurations] = useState<Record<string, string>>({});

  const rememberLessonDuration = useCallback((lessonId: string, durationLabel: string) => {
    if (!lessonId || !durationLabel) return;
    setResolvedDurations((prev) =>
      prev[lessonId] === durationLabel ? prev : { ...prev, [lessonId]: durationLabel }
    );
  }, []);

  const qaMessageState = useMemo(() => {
    if (hasInstructorReply(lessonChatMessages)) return "replied" as const;
    return "sent" as const;
  }, [lessonChatMessages]);

  const loadLessonDetail = useCallback(async (lessonId: string, baseLesson?: LearningLesson) => {
    if (!lessonId) return;
    setLessonLoading(true);
    try {
      const response = await fetchCourseLessonById(courseId, lessonId);
      const detail = unwrapApiData(response);
      if (detail && typeof detail === "object") {
        const merged = mergeLessonDetail(
          baseLesson ?? {
            id: lessonId,
            title: "",
            duration: "—",
            isWatched: false,
            isCompleted: false,
            isLocked: false,
            description: "",
            attachments: [],
          },
          detail
        );
        setActiveLessonDetail(merged);
        if (merged.videoUrl && merged.videoUrl !== "#") {
          void readVideoDurationFromUrl(merged.videoUrl)
            .then((seconds) => {
              rememberLessonDuration(lessonId, formatVideoDuration(seconds));
            })
            .catch(() => {
              /* keep stored duration */
            });
        }
      }
    } catch {
      if (baseLesson) setActiveLessonDetail(baseLesson);
    } finally {
      setLessonLoading(false);
    }
  }, [courseId, rememberLessonDuration]);

  useEffect(() => {
    let active = true;

    const loadCourse = async () => {
      setCourseLoading(true);
      setCourseLoadError(null);

      try {
        const response = await fetchCourseLearningPage(courseId);

        if (!active) return;

        const coursePayload = unwrapApiData(response);
        const courseRecord =
          coursePayload && typeof coursePayload === "object"
            ? (coursePayload as Record<string, unknown>)
            : {};

        const chapters = mapStepsToChapters(courseRecord.chapters);
        const meta = readCourseMeta(courseRecord);

        const nextResolvedCourseId = meta.id || courseId;

        const nextCourse: LearningCourseData = {
          id: nextResolvedCourseId,
          title: meta.title || "دوره بدون عنوان",
          instructor: meta.instructor || "نامشخص",
          progress: meta.progress,
          playerType: meta.playerType,
          chapters,
          licenseKey: meta.licenseKey,
          downloadLinks: meta.downloadLinks,
        };

        setCourseData(nextCourse);
        setResolvedDurations({});
        setExpandedChapters(nextCourse.chapters[0]?.id ? [nextCourse.chapters[0].id] : []);
        setResolvedCourseId(nextResolvedCourseId);

        const firstLessonId =
          findFirstUnlockedLessonId(nextCourse.chapters) ??
          nextCourse.chapters[0]?.lessons[0]?.id ??
          "";

        if (firstLessonId) {
          setActiveLessonId(firstLessonId);
          const baseLesson = nextCourse.chapters
            .flatMap((chapter) => chapter.lessons)
            .find((lesson) => lesson.id === firstLessonId);
          await loadLessonDetail(firstLessonId, baseLesson);
        }
      } catch {
        if (!active) return;
        setCourseData(fallbackCourseData);
        setExpandedChapters([]);
        setActiveLessonId("");
        setActiveLessonDetail(null);
        setCourseLoadError("بارگذاری دوره از سرور انجام نشد.");
      } finally {
        if (active) setCourseLoading(false);
      }
    };

    loadCourse();

    return () => {
      active = false;
    };
  }, [courseId, fallbackCourseData, loadLessonDetail]);



  const handleLessonSelect = (lesson: LearningLesson) => {
    if (lesson.isLocked) return;
    setCompleteError(null);
    setActiveLessonId(lesson.id);
    setActiveLessonDetail(lesson);
    const parentChapter = courseData.chapters.find((ch) =>
      ch.lessons.some((l) => l.id === lesson.id)
    );
    if (parentChapter) {
      setExpandedChapters((prev) =>
        prev.includes(parentChapter.id) ? prev : [...prev, parentChapter.id]
      );
    }
    void loadLessonDetail(lesson.id, lesson);
  };

  const markLessonCompletedInState = useCallback((lessonId: string) => {
    setCourseData((prev) => {
      const chapters = prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, isCompleted: true, isWatched: true }
            : lesson
        ),
      }));

      const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
      const completedLessons = chapters.reduce(
        (sum, chapter) => sum + chapter.lessons.filter((lesson) => lesson.isCompleted).length,
        0
      );
      const progress =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : prev.progress;

      return { ...prev, chapters, progress };
    });

    setActiveLessonDetail((prev) =>
      prev?.id === lessonId ? { ...prev, isCompleted: true, isWatched: true } : prev
    );
  }, []);

  const handleCompleteLesson = async () => {
    if (!activeLessonId || completingLesson) return;

    const lessonFromCourse = courseData.chapters
      .flatMap((chapter) => chapter.lessons)
      .find((lesson) => lesson.id === activeLessonId);
    const isAlreadyCompleted =
      activeLessonDetail?.id === activeLessonId
        ? activeLessonDetail.isCompleted
        : lessonFromCourse?.isCompleted;
    if (isAlreadyCompleted) return;

    setCompleteError(null);
    setCompletingLesson(true);
    try {
      const response = await completeCourseLesson(courseData.id || courseId, activeLessonId);
      const payload = unwrapApiData(response);
      if (payload && typeof payload === "object") {
        const nextProgress = Number((payload as Record<string, unknown>).progress);
        if (Number.isFinite(nextProgress)) {
          setCourseData((prev) => ({ ...prev, progress: Math.max(prev.progress, nextProgress) }));
        }
      }
      markLessonCompletedInState(activeLessonId);
    } catch {
      setCompleteError("ثبت تکمیل درس انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setCompletingLesson(false);
    }
  };

  // --- Telegram Q&A Chat States & Helpers ---
  type PendingAttachment = {
    id: string;
    file: File;
    type: "image" | "file";
    previewUrl?: string;
    caption?: string;
  };

  const [composerBlocks, setComposerBlocks] = useState<ComposerBlock[]>([
    { id: makeBlockId(), type: "text", content: "" },
  ]);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [imageLightboxUrl, setImageLightboxUrl] = useState("");
  const blockRefs = React.useRef<Record<string, HTMLTextAreaElement | null>>({});

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    if (activeTab === "qa" && lessonChatMessages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [activeTab, lessonChatMessages]);

  useEffect(() => {
    setLessonChatMessages([]);
  }, [courseData.id]);

  const loadLessonChat = useCallback(async (options?: { silent?: boolean }) => {
    const chatCourseId = resolvedCourseId || courseData.id;
    if (!chatCourseId) return;
    if (!options?.silent) {
      setQaLoading(true);
    }
    setQaError(null);
    try {
      const chat = await fetchLearningCourseChatMessages({
        courseId: chatCourseId,
        studentName: "شما",
      });
      setLessonChatMessages((prev) => mergeLessonChatMessages(prev, chat.messages));
      setInstructorChatName(chat.instructorName);
    } catch {
      if (!options?.silent) {
        setQaError("بارگذاری پرسش و پاسخ انجام نشد.");
      }
    } finally {
      if (!options?.silent) {
        setQaLoading(false);
      }
    }
  }, [courseData.id, resolvedCourseId]);

  const appendMessageToChat = useCallback((message: LessonChatMessage) => {
    setLessonChatMessages((prev) => {
      if (prev.some((item) => item.id === message.id)) {
        return prev.map((item) => (item.id === message.id ? message : item));
      }
      return [...prev, message];
    });
    requestAnimationFrame(() => {
      setTimeout(scrollToBottom, 100);
    });
  }, []);

  useEffect(() => {
    if (activeTab !== "qa" || courseLoading) return;
    void loadLessonChat();
  }, [activeTab, courseLoading, loadLessonChat]);

  useEffect(() => {
    if (activeTab !== "qa" || courseLoading) return;
    const intervalId = window.setInterval(() => {
      void loadLessonChat({ silent: true });
    }, 12000);
    return () => window.clearInterval(intervalId);
  }, [activeTab, courseLoading, loadLessonChat]);

  React.useEffect(() => {
    composerBlocks.forEach((block) => {
      const el = blockRefs.current[block.id];
      if (!el) return;
      el.style.height = "auto";
      const maxHeight = block.type === "code" ? 280 : 220;
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    });
  }, [composerBlocks]);

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

  const focusBlock = (blockId: string) => {
    requestAnimationFrame(() => {
      blockRefs.current[blockId]?.focus();
    });
  };

  const updateBlock = (blockId: string, content: string) => {
    setComposerBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== blockId) return block;
        if (block.type === "text") {
          const detected = detectCodeFromText(content);
          if (detected.isCode) {
            return {
              id: block.id,
              type: "code" as const,
              language: detected.language || "code",
              content: detected.code,
            };
          }
        }
        return { ...block, content };
      })
    );
  };

  const addCodeBlockAfter = (blockId: string) => {
    const newBlock: ComposerBlock = { id: makeBlockId(), type: "code", content: "", language: "ts" };
    setComposerBlocks((prev) => {
      const idx = prev.findIndex((block) => block.id === blockId);
      if (idx === -1) return [...prev, newBlock];
      return [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)];
    });
    focusBlock(newBlock.id);
  };

  const focusTextAfterCode = (blockId: string) => {
    const codeIndex = composerBlocks.findIndex((block) => block.id === blockId);
    const nextBlock = composerBlocks[codeIndex + 1];

    if (nextBlock?.type === "text") {
      focusBlock(nextBlock.id);
      return;
    }

    const newBlock: ComposerBlock = { id: makeBlockId(), type: "text", content: "" };
    setComposerBlocks((prev) => [
      ...prev.slice(0, codeIndex + 1),
      newBlock,
      ...prev.slice(codeIndex + 1),
    ]);
    focusBlock(newBlock.id);
  };

  const handleComposerOuterClick = () => {
    const lastBlock = composerBlocks[composerBlocks.length - 1];
    if (!lastBlock) return;
    if (lastBlock.type === "text") {
      focusBlock(lastBlock.id);
      return;
    }
    const newBlock: ComposerBlock = { id: makeBlockId(), type: "text", content: "" };
    setComposerBlocks((prev) => [...prev, newBlock]);
    focusBlock(newBlock.id);
  };

  const composerPayload = composerBlocks
    .map((block) => {
      if (!block.content.trim()) return "";
      if (block.type === "code") {
        const lang = block.language?.trim() || "code";
        return `\`\`\`${lang}\n${block.content.trimEnd()}\n\`\`\``;
      }
      return block.content.trimEnd();
    })
    .filter(Boolean)
    .join("\n\n");

  const handleSendMessage = async () => {
    if (!composerPayload.trim() && pendingAttachments.length === 0) return;
    if (!activeLessonId) {
      alert("ابتدا یک درس را انتخاب کنید.");
      return;
    }

    setIsSendingMessage(true);
    const messageText = composerPayload.trim();
    const now = new Date();
    try {
      const attachments = pendingAttachments.map((item) => ({
        id: item.id,
        name: item.file.name,
        size: item.file.size,
        type: item.file.type || "application/octet-stream",
        previewUrl: item.previewUrl,
        caption: item.caption,
      }));
      const created = await createLearningCourseQuestion({
        courseId: resolvedCourseId || courseData.id || courseId,
        lessonId: activeLessonId,
        question: buildCourseQuestionText({ description: messageText }),
        attachments,
      });

      if (created.courseId) {
        setResolvedCourseId((prev) => created.courseId || prev);
      }
      appendMessageToChat({
        id: `local-${now.getTime()}`,
        qaId: created.id,
        role: "student",
        senderName: "شما",
        text: messageText,
        createdAt: now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
        createdAtIso: now.toISOString(),
      });
      setComposerBlocks([{ id: makeBlockId(), type: "text", content: "" }]);
      setPendingAttachments([]);
      void loadLessonChat({ silent: true });
    } catch {
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

  // Find active lesson details
  let activeLesson = courseData.chapters[0]?.lessons[0] ?? {
    id: "",
    title: "",
    duration: "—",
    isWatched: false,
    isCompleted: false,
    isLocked: false,
    description: "",
    attachments: [],
  };
  courseData.chapters.forEach((ch: LearningChapter) => {
    const lesson = ch.lessons.find((l: LearningLesson) => l.id === activeLessonId);
    if (lesson) activeLesson = lesson;
  });
  if (activeLessonDetail?.id === activeLessonId) {
    activeLesson = activeLessonDetail;
  }

  const allLessons = useMemo(() => {
    return courseData.chapters.flatMap((chapter) => chapter.lessons);
  }, [courseData.chapters]);

  const currentLessonIndex = useMemo(() => {
    if (!activeLesson?.id) return -1;
    return allLessons.findIndex((l) => l.id === activeLesson.id);
  }, [allLessons, activeLesson?.id]);

  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleCopyLicense = () => {
    if (courseData.licenseKey) {
      navigator.clipboard.writeText(courseData.licenseKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const tabs = [
    { id: "description", label: "توضیحات" },
    { id: "attachments", label: "فایل‌های پیوست" },
  ];

  const validateFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `فرمت فایل «${file.name}» مجاز نیست.`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `حجم فایل «${file.name}» بیشتر از ۵ مگابایت است.`;
    }
    return "";
  };

  const handleFilesAdd = (files: FileList | null) => {
    if (!files) return;
    setFileError("");
    const incoming = Array.from(files);
    if (selectedFiles.length + incoming.length > MAX_FILES_COUNT) {
      setFileError(`حداکثر ${MAX_FILES_COUNT.toLocaleString("fa-IR")} فایل قابل آپلود است.`);
      return;
    }
    for (const file of incoming) {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        return;
      }
    }
    setSelectedFiles((prev) => [...prev, ...incoming]);
  };

  const resetQuestionForm = () => {
    setQuestionTitle("");
    setQuestionDescription("");
    setQuestionErrorText("");
    setSelectedFiles([]);
    setFileError("");
    setFormError("");
  };

  const handleSubmitQuestion = async () => {
    if (!questionTitle.trim()) {
      setFormError("عنوان سؤال الزامی است.");
      return;
    }
    if (!questionDescription.trim()) {
      setFormError("توضیح مشکل الزامی است.");
      return;
    }
    if (!activeLessonId) {
      setFormError("ابتدا یک درس را انتخاب کنید.");
      return;
    }

    setFormError("");
    setIsSubmittingQuestion(true);
    try {
      const questionText = buildCourseQuestionText({
        title: questionTitle.trim(),
        description: questionDescription.trim(),
        errorText: questionErrorText.trim() || undefined,
      });
      const attachments = await Promise.all(
        selectedFiles.map(async (file, index) => ({
          id: `question-file-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          previewUrl: file.type.startsWith("image/") ? await toDataUrl(file) : undefined,
        }))
      );
      const created = await createLearningCourseQuestion({
        courseId: resolvedCourseId || courseData.id || courseId,
        lessonId: activeLessonId,
        question: questionText,
        attachments,
      });

      if (created.courseId) {
        setResolvedCourseId((prev) => created.courseId || prev);
      }

      const now = new Date();
      appendMessageToChat({
        id: `local-${now.getTime()}`,
        qaId: created.id,
        role: "student",
        senderName: "شما",
        text: questionDescription.trim(),
        createdAt: now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
        createdAtIso: now.toISOString(),
      });
      void loadLessonChat({ silent: true });
      setActiveTab("qa");
      setIsQuestionModalOpen(false);
      resetQuestionForm();
    } catch {
      setFormError("ثبت سؤال انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6 pb-6 sm:pb-12">
      {courseLoadError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          {courseLoadError}
        </div>
      )}

      {courseLoading ? (
        <CourseLearningSkeleton />
      ) : (
        <>
      {/* Premium Course Header */}
      <div className="relative overflow-hidden bg-white dark:bg-[#101217] rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-white/[0.07] shadow-sm">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 size-48 bg-primary/10 dark:bg-primary/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-48 bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative flex items-center justify-between gap-3 sm:gap-6">
          
          <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
            <Link 
              href="/panel/courses" 
              className="flex items-center justify-center size-10 sm:size-14 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 hover:bg-white hover:text-primary dark:hover:bg-white/5 dark:hover:text-primary transition-all border border-gray-200/50 dark:border-white/[0.05] shadow-xs shrink-0 cursor-pointer hover:scale-105 active:scale-95"
              title="بازگشت به دوره‌ها"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[26px] rotate-180">arrow_back</span>
            </Link>
            
            <div className="min-w-0 space-y-0.5 sm:space-y-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline-flex size-5 sm:size-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <GraduationCap className="size-3 sm:size-3.5" />
                </span>
                <p className="text-[10px] sm:text-[11px] font-bold tracking-wide text-primary uppercase">
                  میز یادگیری
                </p>
              </div>
              <h1 className="text-sm sm:text-2xl font-black text-gray-900 dark:text-white truncate">
                {courseData.title}
              </h1>
              <p className="hidden md:flex text-xs sm:text-sm text-gray-500 dark:text-slate-400 font-medium items-center gap-1.5">
                <User className="size-3.5" />
                مدرس: {courseData.instructor || "اسپاتی کد"}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-32 sm:w-48 md:w-72 bg-gray-50 dark:bg-black/20 p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/[0.04] shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs font-bold mb-2 sm:mb-3 gap-1 sm:gap-0">
              <div className="hidden sm:flex items-center gap-1.5 text-gray-700 dark:text-slate-300">
                <Sparkles className="size-4 text-primary" />
                <span>پیشرفت کلی دوره</span>
              </div>
              <span className="text-primary font-black text-sm text-center sm:text-left">{normalizePersianDigits(String(courseData.progress))}%</span>
            </div>
            
            <div className="h-2 w-full bg-gray-200/60 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-l from-primary to-emerald-400 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${courseData.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 items-start">
        
        {/* Left Side: Player or SpotPlayer Card */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-3 sm:space-y-6">
          {courseData.playerType === "internal" ? (
            /* Internal Video Player */
            <div className="bg-white dark:bg-[#101217] rounded-2xl sm:rounded-3xl p-2 sm:p-3 border border-gray-100 dark:border-white/[0.07] shadow-xs relative">
              {lessonLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#101217]/70">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <CustomVideoPlayer
                key={activeLesson.id}
                src={activeLesson.videoUrl ?? "#"} 
                title={activeLesson.title}
                onDurationChange={(seconds) => {
                  rememberLessonDuration(activeLesson.id, formatVideoDuration(seconds));
                }}
              />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 mt-2.5 sm:mt-4 px-1 sm:px-2 pb-1 sm:pb-2">
                <div className="flex items-center gap-2">
                  {prevLesson && (
                    <button
                      type="button"
                      onClick={() => handleLessonSelect(prevLesson)}
                      title={`درس قبلی: ${prevLesson.title}`}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_forward</span>
                      درس قبلی
                    </button>
                  )}
                  {nextLesson && (
                    <button
                      type="button"
                      onClick={() => handleLessonSelect(nextLesson)}
                      disabled={nextLesson.isLocked}
                      title={
                        nextLesson.isLocked
                          ? `درس بعدی قفل است: ${nextLesson.title}`
                          : `درس بعدی: ${nextLesson.title}`
                      }
                      className={cn(
                        "flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors",
                        nextLesson.isLocked
                          ? "bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      )}
                    >
                      درس بعدی
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_back</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void handleCompleteLesson()}
                  disabled={activeLesson.isCompleted || completingLesson || !activeLesson.id}
                  className={cn(
                  "flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer w-full sm:w-auto",
                  activeLesson.isCompleted 
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30" 
                    : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                )}>
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                    {completingLesson ? "progress_activity" : activeLesson.isCompleted ? "task_alt" : "check_circle"}
                  </span>
                  {completingLesson ? "در حال ثبت..." : activeLesson.isCompleted ? "تکمیل شده" : "تکمیل این درس"}
                </button>
                {completeError && (
                  <p className="w-full text-xs sm:text-sm font-bold text-red-500 text-left">{completeError}</p>
                )}
              </div>
            </div>
          ) : (
            /* SpotPlayer License Card */
            <div className="bg-white dark:bg-[#101217] rounded-4xl border border-gray-100 dark:border-white/[0.07] shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-8 md:p-12">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-50 dark:bg-green-500/10 text-green-500 mb-2">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">
                      دسترسی به دوره از طریق <span className="text-green-500">اسپات پلیر</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg">
                      این دوره به دلیل رعایت کپی‌رایت و کیفیت بالاتر در بستر اسپات پلیر ارائه می‌شود. 
                      لطفاً برای شروع یادگیری، کد لایسنس زیر را در نرم‌افزار وارد کنید.
                    </p>
                  </div>

                  {/* License Key Display */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-gray-50 dark:bg-[#0a0b0f] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-right">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">License Key</p>
                        <p className="text-xl md:text-2xl font-mono font-black text-gray-900 dark:text-white tracking-wider">
                          {courseData.licenseKey}
                        </p>
                      </div>
                      <button 
                        onClick={handleCopyLicense}
                        className={cn(
                          "w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black transition-all active:scale-95 cursor-pointer shadow-lg",
                          isCopied 
                            ? "bg-green-500 text-white shadow-green-500/30" 
                            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                        )}
                      >
                        {isCopied ? <ShieldCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {isCopied ? "کد کپی شد!" : "کپی کد لایسنس"}
                      </button>
                    </div>
                  </div>

                  {/* Download Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <a href={courseData.downloadLinks?.windows ?? "#"} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-green-500/50 hover:bg-green-50/30 dark:hover:bg-green-500/5 transition-all group">
                      <MonitorPlay className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">ویندوز</span>
                    </a>
                    <a href={courseData.downloadLinks?.android ?? "#"} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-green-500/50 hover:bg-green-50/30 dark:hover:bg-green-500/5 transition-all group">
                      <MonitorPlay className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">اندروید</span>
                    </a>
                    <a href={courseData.downloadLinks?.mac ?? "#"} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-green-500/50 hover:bg-green-50/30 dark:hover:bg-green-500/5 transition-all group">
                      <MonitorPlay className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">مک‌اواس</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Section */}
          <div className="bg-white dark:bg-[#101217] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-gray-100 dark:border-white/[0.07] shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-white/[0.07] pb-2.5 sm:pb-4 mb-3.5 sm:mb-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[200px]">
              {activeTab === "description" && (
                <div className="text-gray-600 dark:text-gray-300 leading-loose text-sm md:text-base">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">درباره این جلسه</h3>
                  {activeLesson.description ? (
                    <p>{activeLesson.description}</p>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500">توضیحی برای این جلسه ثبت نشده است.</p>
                  )}
                </div>
              )}

              {activeTab === "attachments" && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">فایل‌های ضمیمه</h3>
                  {activeLesson.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                      {activeLesson.attachments.map((file: LearningAttachment, idx: number) => {
                        const cardContent = (
                          <>
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <FileText className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1 text-right">
                              <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{file.name}</p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{file.size}</p>
                            </div>
                            {file.url ? (
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors group-hover:text-primary dark:bg-[#101217]">
                                <Download className="size-4" />
                              </span>
                            ) : null}
                          </>
                        );

                        return file.url ? (
                          <a
                            key={idx}
                            href={file.url}
                            download={file.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            dir="rtl"
                            className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-primary/30 dark:border-white/[0.07] dark:bg-[#0a0b0f]"
                          >
                            {cardContent}
                          </a>
                        ) : (
                          <div
                            key={idx}
                            dir="rtl"
                            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.07] dark:bg-[#0a0b0f]"
                          >
                            {cardContent}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">folder_off</span>
                      <p className="text-sm font-medium">فایلی برای این جلسه ضمیمه نشده است.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Curriculum Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#101217] rounded-3xl p-4 sm:p-5 border border-gray-100 dark:border-white/[0.07] shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.05]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/[0.05] text-gray-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900 dark:text-white">سرفصل‌های دوره</h2>
                <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 mt-0.5">مسیر یادگیری شما</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pr-1 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">
              {courseData.chapters.map((chapter: LearningChapter) => {
                const isExpanded = expandedChapters.includes(chapter.id);
                const hasActiveLesson = chapter.lessons.some(l => l.id === activeLessonId);
                
                return (
                  <div key={chapter.id} className={cn(
                    "rounded-2xl overflow-hidden transition-all duration-300 border",
                    isExpanded 
                      ? "bg-gray-50/50 dark:bg-white/[0.02] border-gray-200/60 dark:border-white/[0.07] shadow-xs" 
                      : "bg-transparent border-transparent hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                  )}>
                    <button 
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between p-3.5 sm:p-4 transition-colors cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-2 rounded-full transition-all duration-500", 
                          hasActiveLesson ? "bg-primary shadow-[0_0_10px_rgba(34,197,94,0.8)] scale-110" : 
                          isExpanded ? "bg-gray-400 dark:bg-gray-500" : "bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-400"
                        )} />
                        <h3 className={cn(
                          "font-bold text-sm text-right transition-colors", 
                          hasActiveLesson ? "text-primary" :
                          isExpanded ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-slate-400 group-hover:text-gray-800 dark:group-hover:text-slate-200"
                        )}>
                          {chapter.title}
                        </h3>
                      </div>
                      <span className={cn(
                        "material-symbols-outlined text-[20px] transition-transform duration-300",
                        isExpanded ? "text-gray-700 dark:text-slate-300 rotate-180" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-slate-300"
                      )}>
                        expand_more
                      </span>
                    </button>

                    <div className={cn(
                      "transition-all duration-500 ease-in-out overflow-hidden",
                      isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <div className="px-2 pb-2 space-y-1.5">
                        {chapter.lessons.map((lesson: LearningLesson) => {
                          const isActive = activeLessonId === lesson.id;
                          
                          return (
                            <div 
                              key={lesson.id}
                              onClick={() => handleLessonSelect(lesson)}
                              className={cn(
                                "group relative flex flex-col gap-2 p-3 sm:p-3.5 rounded-2xl transition-all duration-300 overflow-hidden",
                                lesson.isLocked ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer hover:bg-white dark:hover:bg-white/[0.04]",
                                isActive ? "bg-white dark:bg-[#151820] border border-primary/20 shadow-sm" : "border border-transparent"
                              )}
                            >
                              {/* Active Indicator Line */}
                              {isActive && (
                                <div className="absolute top-0 right-0 h-full w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                              )}
                              
                              <div className="flex items-center justify-between w-full gap-2">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className={cn(
                                    "flex-shrink-0 size-8 sm:size-9 flex items-center justify-center rounded-xl transition-all duration-300 shadow-xs",
                                    isActive ? "bg-primary/10 text-primary border border-primary/20" : 
                                    lesson.isCompleted ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                                    "bg-gray-100 text-gray-400 dark:bg-black/40 dark:text-gray-500 dark:border-white/5 border border-gray-200/50 group-hover:text-primary group-hover:border-primary/30"
                                  )}>
                                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                                      {isActive ? "graphic_eq" : 
                                       lesson.isCompleted ? "check" : 
                                       lesson.isLocked ? "lock" : "play_arrow"}
                                    </span>
                                  </div>
                                  
                                  <p className={cn(
                                    "text-[13px] sm:text-sm font-bold truncate transition-colors",
                                    isActive ? "text-primary" : "text-gray-800 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-white"
                                  )}>
                                    {lesson.title}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[11px] sm:text-xs font-bold tracking-widest text-gray-400 dark:text-slate-500 transition-colors group-hover:text-gray-600 dark:group-hover:text-slate-400">
                                    {resolvedDurations[lesson.id] ?? lesson.duration}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Tags Row */}
                              {(lesson.isWatched && !lesson.isCompleted) && (
                                <div className="flex items-center mr-11 sm:mr-12">
                                  <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                    در حال مشاهده
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

        </>
      )}

      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1c1e26]">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">ثبت سؤال فنی</h3>
                <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  عنوان، شرح دقیق، ارور و فایل‌های مرتبط را اضافه کنید.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsQuestionModalOpen(false);
                  resetQuestionForm();
                }}
                className="rounded-lg bg-gray-100 p-2 text-gray-500 dark:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 dark:text-gray-200">عنوان سؤال</label>
                <input
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="مثلاً: خطای Hydration در useState و localStorage"
                  className="h-12 w-full rounded-2xl border border-gray-200/70 bg-gray-50 px-4 text-sm font-semibold text-gray-800 outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 dark:text-gray-200">توضیح مشکل</label>
                <textarea
                  rows={5}
                  value={questionDescription}
                  onChange={(e) => setQuestionDescription(e.target.value)}
                  placeholder="مشکل را کامل توضیح دهید؛ چه کاری انجام دادید، انتظار داشتید چه شود، و دقیقاً چه اتفاقی افتاد؟"
                  className="w-full rounded-2xl border border-gray-200/70 bg-gray-50 px-4 py-3 text-sm font-semibold leading-7 text-gray-800 outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 dark:text-gray-200">متن ارور یا لاگ (اختیاری)</label>
                <textarea
                  rows={4}
                  value={questionErrorText}
                  onChange={(e) => setQuestionErrorText(e.target.value)}
                  placeholder="متن ارور، لاگ کنسول، stack trace یا پیام خطا را اینجا قرار دهید..."
                  className="w-full rounded-2xl border border-gray-200/70 bg-[#f7f8fb] px-4 py-3 font-mono text-xs leading-6 text-gray-800 outline-none transition focus:border-primary dark:border-white/10 dark:bg-[#14161c] dark:text-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 dark:text-gray-200">ضمیمه خطا (اختیاری)</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFilesAdd(e.dataTransfer.files);
                  }}
                  className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center dark:border-white/20 dark:bg-white/5"
                >
                  <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">فایل را بکشید و رها کنید یا انتخاب کنید</p>
                  <p className="mt-1 text-[11px] text-gray-400">فرمت مجاز: jpg, jpeg, png, webp, pdf, txt, log • حداکثر ۵MB برای هر فایل</p>
                  <label className="mt-3 inline-flex cursor-pointer rounded-xl bg-white px-3 py-2 text-xs font-black text-gray-700 shadow-sm dark:bg-[#14161c] dark:text-gray-200">
                    انتخاب فایل
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.log"
                      onChange={(e) => handleFilesAdd(e.target.files)}
                    />
                  </label>
                </div>
                {fileError && <p className="text-xs font-black text-rose-500">{fileError}</p>}
                {!!selectedFiles.length && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedFiles.map((file, index) => {
                      const isImage = file.type.startsWith("image/");
                      return (
                        <div key={`${file.name}-${index}`} className="rounded-xl border border-gray-200/70 bg-white p-2.5 dark:border-white/10 dark:bg-[#14161c]">
                          {isImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={URL.createObjectURL(file)} alt={file.name} className="mb-2 h-24 w-full rounded-lg object-cover" />
                          )}
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-black text-gray-700 dark:text-gray-200">{file.name}</p>
                              <p className="text-[11px] font-semibold text-gray-400">{formatBytes(file.size)}</p>
                            </div>
                            <button
                              onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                              className="rounded-lg bg-gray-100 p-1 text-gray-500 dark:bg-white/10"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {formError && <p className="text-xs font-black text-rose-500">{formError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsQuestionModalOpen(false);
                    resetQuestionForm();
                  }}
                  className="h-11 rounded-xl border border-gray-200 px-4 text-xs font-black text-gray-500 dark:border-white/10"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmitQuestion}
                  disabled={isSubmittingQuestion}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-black text-white disabled:opacity-70"
                >
                  {isSubmittingQuestion && <Loader2 className="h-4 w-4 animate-spin" />}
                  ارسال سؤال
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
