"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CustomVideoPlayer from "@/components/panel/CustomVideoPlayer";
import { Clock3, Copy, Download, Loader2, MonitorPlay, Paperclip, SearchCheck, ShieldCheck, UploadCloud, X, Send, FileText, Image as ImageIcon, ArrowRight, MessageSquare, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type LearningAttachment = { name: string; size: string };
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

// Mock Data with different course types
const getCourseData = (id: string) => {
  const courses: Record<string, LearningCourseData> = {
    "1": {
      id: "1",
      title: "مسترکلاس ری‌اکت و نکست جی‌اس",
      instructor: "سروش مشایخی",
      progress: 45,
      playerType: "internal", // Internal video player
      chapters: [
        {
          id: "ch1",
          title: "فصل اول: مقدمه و مفاهیم پایه",
          lessons: [
            {
              id: "l1",
              title: "معرفی دوره و پیش‌نیازها",
              duration: "12:30",
              isWatched: true,
              isCompleted: true,
              isLocked: false,
              videoUrl: "#",
              description: "در این جلسه به معرفی کامل دوره، پیش‌نیازهای لازم برای شروع، و ابزارهایی که در طول دوره نیاز داریم می‌پردازیم.",
              attachments: [{ name: "اسلایدهای معرفی دوره.pdf", size: "2.4 MB" }],
            },
          ],
        },
      ],
    },
    "2": {
      id: "2",
      title: "آموزش جامع جاوا اسکریپت",
      instructor: "سروش مشایخی",
      progress: 80,
      playerType: "spotplayer", // SpotPlayer (Token based)
      licenseKey: "SP-7294-X821-M932-K105",
      downloadLinks: {
        windows: "https://spotplayer.ir/download/windows",
        android: "https://spotplayer.ir/download/android",
        mac: "https://spotplayer.ir/download/mac",
      },
      chapters: [
        {
          id: "ch1",
          title: "دسترسی به محتوای دوره",
          lessons: [
            {
              id: "l_spot",
              title: "دریافت لایسنس و مشاهده در اسپات پلیر",
              duration: "نامحدود",
              isWatched: false,
              isCompleted: false,
              isLocked: false,
              description: "این دوره با استفاده از قفل نرم‌افزاری اسپات پلیر محافظت شده است. برای مشاهده ویدیوها، ابتدا نرم‌افزار متناسب با سیستم‌عامل خود را دانلود کرده و سپس از کلید لایسنس زیر برای فعال‌سازی دوره استفاده کنید.",
              attachments: [],
            },
          ],
        },
      ],
    },
    "3": {
      id: "3",
      title: "طراحی رابط کاربری مدرن",
      instructor: "نازنین",
      progress: 10,
      playerType: "internal",
      chapters: [
        {
          id: "ch1",
          title: "مبانی طراحی UI",
          lessons: [
            {
              id: "l_ui_1",
              title: "رنگ‌شناسی و تایپوگرافی",
              duration: "20:00",
              isWatched: false,
              isCompleted: false,
              isLocked: false,
              videoUrl: "#",
              description: "بررسی اصول انتخاب پالت رنگی و فونت مناسب برای پروژه‌های وب.",
              attachments: [],
            },
          ],
        },
      ],
    },
  };
  return courses[id] || courses["1"];
};

type QuestionAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  caption?: string;
};
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

type LearningQuestion = {
  id: string;
  studentName: string;
  avatar?: string;
  title: string;
  text: string;
  description: string;
  errorText?: string;
  attachments?: QuestionAttachment[];
  courseId: string;
  courseTitle: string;
  lessonTitle?: string;
  createdAt: string;
  createdAtIso?: string;
  status: "new" | "answered";
  replies: {
    senderName: string;
    role: "instructor" | "student";
    text: string;
    createdAt: string;
    createdAtIso?: string;
    attachments?: QuestionAttachment[];
  }[];
};

const STORAGE_KEY = "spoticode_inst_questions";
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf", "txt", "log"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_COUNT = 4;

const courseMap: Record<string, string> = {
  "1": "CRS-410",
  "2": "CRS-398",
  "3": "CRS-407",
};

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

const formatTimeLabel = (dateIso?: string, fallback?: string) => {
  if (dateIso) {
    const d = new Date(dateIso);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
    }
  }
  if (fallback && /^\d{1,2}:\d{2}$/.test(fallback)) return fallback;
  const seed = (fallback || "spoticode")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const hour = seed % 24;
  const minute = (seed * 7) % 60;
  const pseudoDate = new Date(2000, 0, 1, hour, minute);
  return pseudoDate.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
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
  const courseId = params.courseId as string;
  const courseData = getCourseData(courseId);
  
  const [activeLessonId, setActiveLessonId] = useState(courseData.chapters[0].lessons[0].id);
  const [activeTab, setActiveTab] = useState("description");
  const [expandedChapters, setExpandedChapters] = useState<string[]>([courseData.chapters[0].id]);
  const [isCopied, setIsCopied] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionErrorText, setQuestionErrorText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [qaQuestions, setQaQuestions] = useState<LearningQuestion[]>([]);

  // --- Telegram Q&A Chat States & Helpers ---
  type PendingAttachment = {
    id: string;
    file: File;
    type: "image" | "file";
    previewUrl?: string;
    caption?: string;
  };

  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [composerBlocks, setComposerBlocks] = useState<ComposerBlock[]>([
    { id: makeBlockId(), type: "text", content: "" },
  ]);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [imageLightboxUrl, setImageLightboxUrl] = useState("");
  const blockRefs = React.useRef<Record<string, HTMLTextAreaElement | null>>({});

  React.useEffect(() => {
    if (qaQuestions.length > 0 && !selectedThreadId) {
      setSelectedThreadId(qaQuestions[0].id);
    }
  }, [qaQuestions, selectedThreadId]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    if (selectedThreadId) {
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedThreadId, qaQuestions]);

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

  const addTextBlockAfter = (blockId: string) => {
    const newBlock: ComposerBlock = { id: makeBlockId(), type: "text", content: "" };
    setComposerBlocks((prev) => {
      const idx = prev.findIndex((block) => block.id === blockId);
      if (idx === -1) return [...prev, newBlock];
      return [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)];
    });
    focusBlock(newBlock.id);
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

      const newReply = {
        senderName: "کاربر تست",
        role: "student" as const,
        text: composerPayload.trim(),
        createdAt: new Date().toLocaleDateString("fa-IR"),
        createdAtIso: new Date().toISOString(),
        attachments: attachments.length ? attachments : undefined,
      };

      const raw = localStorage.getItem(STORAGE_KEY);
      const allQuestions: LearningQuestion[] = raw ? JSON.parse(raw) : [];
      const updated = allQuestions.map((q) => {
        if (q.id === selectedThreadId) {
          return {
            ...q,
            status: "new" as const,
            replies: [...q.replies, newReply],
          };
        }
        return q;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setQaQuestions((prev) =>
        prev.map((q) => {
          if (q.id === selectedThreadId) {
            return {
              ...q,
              status: "new" as const,
              replies: [...q.replies, newReply],
            };
          }
          return q;
        })
      );

      setComposerBlocks([{ id: makeBlockId(), type: "text", content: "" }]);
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

  // Find active lesson details
  let activeLesson = courseData.chapters[0].lessons[0];
  courseData.chapters.forEach((ch: LearningChapter) => {
    const lesson = ch.lessons.find((l: LearningLesson) => l.id === activeLessonId);
    if (lesson) activeLesson = lesson;
  });

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
    { id: "comments", label: "نظرات" },
    { id: "qa", label: "پرسش و پاسخ" },
  ];

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const allQuestions: LearningQuestion[] = raw ? JSON.parse(raw) : [];
      let changed = false;
      const nowMs = Date.now();
      const normalizedQuestions = allQuestions.map((q, qIndex) => {
        const questionIso = q.createdAtIso || new Date(nowMs - qIndex * 120000).toISOString();
        if (!q.createdAtIso) changed = true;
        const replies = (q.replies || []).map((rep, repIndex) => {
          if (rep.createdAtIso) return rep;
          changed = true;
          return {
            ...rep,
            createdAtIso: new Date(nowMs - (qIndex * 120000 + repIndex * 45000 + 15000)).toISOString(),
          };
        });
        return {
          ...q,
          createdAtIso: questionIso,
          replies,
        };
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedQuestions));
      }
      const resolvedCourseId = courseMap[courseId] || "CRS-410";
      const own = normalizedQuestions.filter((q) => q.courseId === resolvedCourseId);
      setQaQuestions(own.sort((a, b) => b.id.localeCompare(a.id)));
    } catch {
      setQaQuestions([]);
    }
  }, [courseId]);

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
    setFormError("");
    setIsSubmittingQuestion(true);
    try {
      const attachments: QuestionAttachment[] = await Promise.all(
        selectedFiles.map(async (file) => {
          const isImage = file.type.startsWith("image/");
          const previewUrl = isImage ? await toDataUrl(file) : undefined;
          return {
            id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            previewUrl,
          };
        })
      );

      const newQuestion: LearningQuestion = {
        id: `QST-${Date.now()}`,
        studentName: "کاربر تست",
        title: questionTitle.trim(),
        text: questionDescription.trim(),
        description: questionDescription.trim(),
        errorText: questionErrorText.trim() || undefined,
        attachments: attachments.length ? attachments : undefined,
        courseId: courseMap[courseId] || "CRS-410",
        courseTitle: courseData.title,
        lessonTitle: activeLesson.title,
        createdAt: new Date().toLocaleDateString("fa-IR"),
        createdAtIso: new Date().toISOString(),
        status: "new",
        replies: [],
      };

      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: LearningQuestion[] = raw ? JSON.parse(raw) : [];
      const updated = [newQuestion, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setQaQuestions((prev) => [newQuestion, ...prev]);
      setIsQuestionModalOpen(false);
      resetQuestionForm();
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Course Header */}
      <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/panel/courses" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl rotate-180">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {courseData.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              مدرس: {courseData.instructor}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>پیشرفت کلی دوره</span>
            <span className="text-primary">{courseData.progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${courseData.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Player or SpotPlayer Card */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {courseData.playerType === "internal" ? (
            /* Internal Video Player */
            <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
              <CustomVideoPlayer 
                key={activeLesson.id}
                src={activeLesson.videoUrl ?? "#"} 
                title={activeLesson.title}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 mt-5 px-2 pb-2">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    درس قبلی
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm transition-colors cursor-pointer">
                    درس بعدی
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  </button>
                </div>

                <button className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer",
                  activeLesson.isCompleted 
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30" 
                    : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                )}>
                  <span className="material-symbols-outlined text-[20px]">
                    {activeLesson.isCompleted ? "task_alt" : "check_circle"}
                  </span>
                  {activeLesson.isCompleted ? "تکمیل شده" : "تکمیل این درس"}
                </button>
              </div>
            </div>
          ) : (
            /* SpotPlayer License Card */
            <div className="bg-white dark:bg-[#1c1e26] rounded-4xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
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
                    <div className="relative bg-gray-50 dark:bg-[#14161c] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
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
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
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
                  <p>{activeLesson.description}</p>
                </div>
              )}

              {activeTab === "attachments" && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">فایل‌های ضمیمه</h3>
                  {activeLesson.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeLesson.attachments.map((file: LearningAttachment, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#14161c] hover:border-primary/30 transition-colors group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1c1e26] flex items-center justify-center text-primary shadow-sm">
                              <Download className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{file.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{file.size}</p>
                            </div>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-white dark:bg-[#1c1e26] flex items-center justify-center text-gray-400 hover:text-primary shadow-sm transition-colors cursor-pointer">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">folder_off</span>
                      <p className="text-sm font-medium">فایلی برای این جلسه ضمیمه نشده است.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
                  <p className="text-sm font-medium">بخش نظرات در حال به‌روزرسانی است.</p>
                </div>
              )}

              {activeTab === "qa" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {(() => {
                    const activeThread = qaQuestions.find((q) => q.id === selectedThreadId) || qaQuestions[0];
                    const hasInstructorReply = activeThread?.replies?.some((rep) => rep.role === "instructor");
                    const messageState: "sent" | "seen" | "replied" = hasInstructorReply
                      ? "replied"
                      : (activeThread?.replies?.length || 0) > 0
                      ? "seen"
                      : "sent";
                    if (!activeThread) {
                      return (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-12 text-gray-400 dark:border-gray-700">
                          <Loader2 className="mb-2 h-10 w-10 animate-spin text-primary" />
                          <p className="text-sm font-medium">در حال بارگذاری گفتگو...</p>
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-col rounded-3xl border border-gray-100 bg-white/60 dark:border-white/5 dark:bg-white/5 shadow-sm overflow-hidden min-h-[500px]">
                        {/* Thread Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 p-4 bg-white/85 dark:bg-[#1a1c24]/85 backdrop-blur-sm shrink-0 text-right">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 overflow-hidden rounded-full border border-primary/20 bg-primary/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src="/images/inst1.jpg" alt={courseData.instructor} className="h-full w-full object-cover" />
                            </div>
                            <div className="text-right leading-6">
                              <h4 className="text-sm font-black text-gray-900 dark:text-white">
                                {courseData.instructor}
                              </h4>
                              <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                استاد دوره
                              </p>
                            </div>
                          </div>

                          <span
                            className={cn(
                              "rounded-lg px-3 py-1 text-[11px] font-black",
                              messageState === "sent" && "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300",
                              messageState === "seen" && "bg-sky-500/10 text-sky-600 dark:text-sky-300",
                              messageState === "replied" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                            )}
                          >
                            {messageState === "sent" && "ارسال شده"}
                            {messageState === "seen" && "استاد پیامت رو دید"}
                            {messageState === "replied" && "استاد پاسخ داد"}
                          </span>
                        </div>

                        {/* Messages List Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px] min-h-[280px] bg-slate-50/30 dark:bg-black/10" dir="rtl">
                          
                          {/* Student Initial Post */}
                          <div className="flex justify-start text-right">
                            <div className="max-w-[78%] rounded-2xl rounded-tr-sm p-4 bg-[#e6f7ed] dark:bg-[#143c24]/30 border border-[#d1e7dd]/60 dark:border-[#1e5c37]/30 text-[#0f5132] dark:text-[#a3cfbb] shadow-sm animate-in fade-in duration-300">
                              <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 mb-1.5">{activeThread.title}</h4>
                              
                              <p className="text-sm font-semibold leading-7 whitespace-pre-wrap text-emerald-950 dark:text-[#a3cfbb]/90">
                                {activeThread.description || activeThread.text}
                              </p>

                              {activeThread.errorText && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200/60 dark:border-white/10 bg-[#f7f8fb] dark:bg-[#14161c]" dir="ltr">
                                  <div className="bg-black/5 dark:bg-black/30 px-3 py-1 text-[10px] font-mono text-gray-500 dark:text-gray-400 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                                    <span>Error / Log</span>
                                  </div>
                                  <pre className="font-mono text-xs p-3 overflow-x-auto text-left leading-relaxed text-gray-700 dark:text-gray-300">
                                    {activeThread.errorText}
                                  </pre>
                                </div>
                              )}

                              {!!activeThread.attachments?.length && (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                  {activeThread.attachments.map((file) => (
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
                                            <p className="text-xs leading-6 p-1 bg-black/5 dark:bg-white/5 rounded font-medium text-emerald-800 dark:text-emerald-200">
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

                              <div className="mt-2 text-left text-[10px] text-emerald-600/75 dark:text-emerald-400/65 font-bold">
                                <span className="group relative inline-flex items-center gap-1 cursor-default">
                                  <Clock3 className="h-3 w-3" />
                                  <span>{formatTimeLabel(activeThread.createdAtIso, activeThread.createdAt)}</span>
                                  <span className="pointer-events-none absolute -top-7 left-0 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-black">
                                    {formatDateTooltip(activeThread.createdAtIso, activeThread.createdAt)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Replies */}
                          {activeThread.replies.map((rep, idx) => {
                            const isInstructor = rep.role === "instructor";
                            return (
                              <div
                                key={idx}
                                className={cn("flex animate-in fade-in duration-300", isInstructor ? "justify-end text-right" : "justify-start text-right")}
                              >
                                <div className={cn(
                                  "max-w-[78%] rounded-2xl p-4 shadow-sm",
                                  isInstructor 
                                    ? "bg-[#f8f9fa] dark:bg-[#252833] text-gray-800 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-white/5"
                                    : "bg-[#e6f7ed] dark:bg-[#143c24]/40 text-[#0f5132] dark:text-[#a3cfbb] border border-[#d1e7dd]/60 dark:border-[#1e5c37]/40 rounded-tr-sm"
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
                                              ? "border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-white/5 text-gray-800 dark:text-white"
                                              : "border-[#d1e7dd]/50 bg-white/70 dark:border-white/10 dark:bg-white/5 text-emerald-900 dark:text-emerald-100"
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
                                                <p className={cn("text-xs leading-6 p-1 rounded font-medium", isInstructor ? "text-gray-600 dark:text-gray-300 bg-black/5 dark:bg-white/5" : "text-emerald-800 dark:text-[#a3cfbb] bg-black/5")}>
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

                                  <div className={cn("mt-2 text-left text-[10px]", isInstructor ? "text-gray-400" : "text-emerald-600/75 dark:text-emerald-400/65 font-semibold")}>
                                    <span className="group relative inline-flex items-center gap-1 cursor-default">
                                      <Clock3 className="h-3 w-3" />
                                      <span>{formatTimeLabel(rep.createdAtIso, rep.createdAt)}</span>
                                      <span className="pointer-events-none absolute -top-7 left-0 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-black">
                                        {formatDateTooltip(rep.createdAtIso, rep.createdAt)}
                                      </span>
                                    </span>
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
                              <div className="relative flex items-center gap-3 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-[#14161c]/40 px-3 py-2 pr-4 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-white dark:focus-within:bg-[#14161c] transition-all duration-300 shadow-inner">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const el = document.getElementById("student-attachment-picker");
                                    el?.click();
                                  }}
                                  className="w-10 h-10 rounded-full bg-gray-200/60 dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/20 text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
                                  title="افزودن فایل ضمیمه"
                                >
                                  <Paperclip className="w-5 h-5" />
                                </button>

                                <input
                                  id="student-attachment-picker"
                                  type="file"
                                  multiple
                                  className="hidden"
                                  accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.log,.zip"
                                  onChange={(e) => handlePendingFileAdd(e.target.files)}
                                />

                                <div
                                  className="max-h-[340px] min-h-[34px] flex-1 overflow-y-auto rounded-xl px-1 py-0.5"
                                  onClick={handleComposerOuterClick}
                                >
                                  <div className="space-y-2">
                                    {composerBlocks.map((block, index) => {
                                      if (block.type === "text") {
                                        return (
                                          <div key={block.id} onClick={(e) => e.stopPropagation()}>
                                            <textarea
                                              ref={(el) => {
                                                blockRefs.current[block.id] = el;
                                              }}
                                              value={block.content}
                                              onChange={(e) => updateBlock(block.id, e.target.value)}
                                              placeholder={index === 0 ? "سؤال یا پاسخ خود را بنویسید..." : "ادامه متن..."}
                                              rows={1}
                                              className="w-full min-h-[36px] max-h-[220px] resize-none overflow-y-auto bg-transparent px-2 pt-2.5 pb-0.5 text-right text-sm font-medium leading-5 text-gray-800 outline-none placeholder-gray-400 dark:text-white dark:placeholder-gray-500"
                                              dir="rtl"
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                  e.preventDefault();
                                                  handleSendMessage();
                                                }
                                              }}
                                            />
                                          </div>
                                        );
                                      }

                                      return (
                                        <div key={block.id} className="rounded-2xl border border-black/10 bg-black/[0.04] p-3 dark:border-white/10 dark:bg-black/35" onClick={(e) => e.stopPropagation()}>
                                          <div className="mb-2 flex items-center justify-between gap-2">
                                            <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-white">
                                              کد شناسایی شد / CODE MODE
                                            </span>
                                          </div>
                                          <textarea
                                            ref={(el) => {
                                              blockRefs.current[block.id] = el;
                                            }}
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, e.target.value)}
                                            placeholder="کد خود را اینجا بنویسید..."
                                            rows={3}
                                            className="w-full min-h-[120px] max-h-[280px] resize-none overflow-y-auto rounded-xl border border-black/5 bg-transparent p-3 font-mono text-xs leading-6 text-gray-800 outline-none dark:border-white/10 dark:text-gray-200"
                                            dir="ltr"
                                            onKeyDown={(e) => {
                                              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                                                e.preventDefault();
                                                focusTextAfterCode(block.id);
                                              }
                                            }}
                                          />
                                          <div className="mt-2 flex justify-start">
                                            <button
                                              type="button"
                                              onClick={() => focusTextAfterCode(block.id)}
                                              className="rounded-lg bg-green-50 px-2.5 py-1.5 text-[10px] font-black text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
                                            >
                                              خروج از کد و ادامه متن
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const lastId = composerBlocks[composerBlocks.length - 1]?.id || "";
                                    if (lastId) addCodeBlockAfter(lastId);
                                  }}
                                  className="h-10 rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 text-[10px] font-black text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 cursor-pointer"
                                  title="افزودن بلاک کد"
                                >
                                  + Code
                                </button>

                                <button
                                  type="button"
                                  disabled={(!composerPayload.trim() && pendingAttachments.length === 0) || isSendingMessage}
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
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Curriculum Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1c1e26] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">سرفصل‌های دوره</h2>
            </div>

            <div className="space-y-3 pr-1">
              {courseData.chapters.map((chapter: LearningChapter) => {
                const isExpanded = expandedChapters.includes(chapter.id);
                
                return (
                  <div key={chapter.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-[#14161c]/50">
                    <button 
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white text-right">{chapter.title}</h3>
                      <span className={cn(
                        "material-symbols-outlined text-gray-400 transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )}>
                        keyboard_arrow_down
                      </span>
                    </button>

                    <div className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden",
                      isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <div className="p-2 pt-0 space-y-1">
                        {chapter.lessons.map((lesson: LearningLesson) => {
                          const isActive = activeLessonId === lesson.id;
                          
                          return (
                            <div 
                              key={lesson.id}
                              onClick={() => !lesson.isLocked && setActiveLessonId(lesson.id)}
                              className={cn(
                                "flex items-start gap-3 p-3 rounded-xl transition-all",
                                lesson.isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-white dark:hover:bg-[#1c1e26]",
                                isActive ? "bg-white dark:bg-[#1c1e26] border border-primary/20 shadow-sm" : "border border-transparent"
                              )}
                            >
                              <div className={cn(
                                "mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full",
                                isActive ? "text-primary" : 
                                lesson.isCompleted ? "text-green-500 bg-green-50 dark:bg-green-500/10" : "text-gray-400"
                              )}>
                                <span className="material-symbols-outlined text-[18px]">
                                  {isActive ? "play_circle" : 
                                   lesson.isCompleted ? "check_circle" : 
                                   lesson.isLocked ? "lock" : "play_circle"}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-sm font-bold truncate",
                                  isActive ? "text-primary" : "text-gray-700 dark:text-gray-300"
                                )}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    {lesson.duration}
                                  </span>
                                  {lesson.isWatched && !lesson.isCompleted && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                      دیده شده
                                    </span>
                                  )}
                                </div>
                              </div>
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
