"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  UploadCloud,
  FileImage,
  Video,
  Pencil,
  Plus,
  Trash2,
  X,
  AlertCircle,
  HelpCircle,
  FileText,
  DollarSign,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";
import CourseCard from "@/app/components/CourseCard";
import CourseHero from "@/app/components/CourseHero";
import CourseFAQ from "@/app/components/CourseFAQ";
import CustomSelect from "@/components/ui/CustomSelect";

export default function CreateCourseWizardPage() {
  const router = useRouter();
  const { addCourse, profile } = useInstructorData();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: (() => void) | null;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

  // Unified Wizard State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Frontend",
    level: "intermediate",
    language: "فارسی",
    duration: "18",
    studentsCount: 0,
    price: 1450000,
    isPaid: "paid", // free or paid
    cover: "",
    introVideo: "",
    shortDescription: "مسیر صفر تا صد ورود به بازار کار جهانی، یادگیری عمیق هوک‌ها، SSR و معماری مدرن وب.",
    
    // Step 2: Hero Titles & Highlights
    heroTitle: "",
    specialWords: {
      highlighted: ["React"] as string[],
      underlined: ["Next.js"] as string[],
      color: "green"
    },

    // Step 3: Details & Accordions
    aboutTitle: "درباره این دوره",
    aboutDescription: "این دوره حاصل تجربه‌ی سال‌ها کار بر روی پروژه‌های بزرگ مقیاس است. هدف ما صرفاً آموزش سینتکس نیست، بلکه انتقال طرز تفکر مهندسی است. در طول این مسیر، شما با چالش‌های واقعی روبرو می‌شوید. از بهینه‌سازی پرفورمنس گرفته تا مدیریت وضعیت‌های پیچیده و پیاده‌سازی سکیوریتی.",
    aboutHighlights: ["طرز تفکر مهندسی", "پروژه‌های بزرگ مقیاس"] as string[],
    
    features: [
      { id: "feat-1", title: "دسترسی همیشگی به دوره و آپدیت‌ها", icon: "all_inclusive", color: "primary" },
      { id: "feat-2", title: "مدرک معتبر و قابل ترجمه", icon: "workspace_premium", color: "blue-500" },
      { id: "feat-3", title: "پشتیبانی اختصاصی در تلگرام", icon: "forum", color: "purple-500" }
    ],
    
    chapters: [
      {
        id: "chap-1",
        title: "مبانی و مفاهیم پایه‌ای",
        subtitle: "شروع قدرتمند با جاوااسکریپت مدرن",
        number: "۰۱",
        lessons: [
          { id: "les-1-1", title: "آشنایی با اکوسیستم React", duration: "۱۲:۲۰", type: "video", access: "free" },
          { id: "les-1-2", title: "نصب و راه‌اندازی پروژه", duration: "۱۸:۴۵", type: "video", access: "locked" }
        ]
      }
    ],
    
    faqs: [
      { id: "faq-1", question: "آیا پیش‌نیازی برای این دوره لازم است؟", answer: "بله، آشنایی با HTML، CSS و جاوااسکریپت پایه ضروری است." }
    ]
  });

  // Default values sync
  useEffect(() => {
    if (!formData.heroTitle && formData.title) {
      setFormData(prev => ({ ...prev, heroTitle: prev.title }));
    }
  }, [formData.title]);

  // Upload Progress Simulators
  const [coverProgress, setCoverProgress] = useState(0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Dynamic Item Inputs
  const [newObj, setNewObj] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  
  // Custom Feature Editor Input
  const [featTitle, setFeatTitle] = useState("");
  const [featIcon, setFeatIcon] = useState("all_inclusive");
  const [featColor, setFeatColor] = useState("primary");
  const [editingFeatId, setEditingFeatId] = useState<string | null>(null);

  // Custom Chapter Editor Input
  const [chapTitle, setChapTitle] = useState("");
  const [chapSubtitle, setChapSubtitle] = useState("");
  const [editingChapId, setEditingChapId] = useState<string | null>(null);

  // Custom Lesson Editor Input
  const [selectedChapIdForLesson, setSelectedChapIdForLesson] = useState("");
  const [lesTitle, setLesTitle] = useState("");
  const [lesDuration, setLesDuration] = useState("15:00");
  const [lesType, setLesType] = useState("video");
  const [lesAccess, setLesAccess] = useState("locked");
  const [editingLesId, setEditingLesId] = useState<string | null>(null);

  // Custom FAQ Editor Input
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [isFaqEditorOpen, setIsFaqEditorOpen] = useState(true);
  const [openFaqItemId, setOpenFaqItemId] = useState<string | null>(null);
  const [editingLessonTitleId, setEditingLessonTitleId] = useState<string | null>(null);
  const [editingLessonDurationId, setEditingLessonDurationId] = useState<string | null>(null);
  const [editingChapterTitleId, setEditingChapterTitleId] = useState<string | null>(null);
  const [lessonUploadProgress, setLessonUploadProgress] = useState<Record<string, number>>({});
  const [lessonVideoMap, setLessonVideoMap] = useState<Record<string, { name: string; url: string }>>({});
  const [lessonFileMap, setLessonFileMap] = useState<Record<string, { id: string; name: string; url: string }[]>>({});
  const [lessonDescriptionMap, setLessonDescriptionMap] = useState<Record<string, string>>({});
  const [lessonDescriptionEditor, setLessonDescriptionEditor] = useState<{
    open: boolean;
    lessonId: string;
    value: string;
  }>({ open: false, lessonId: "", value: "" });
  const [lessonFilesModal, setLessonFilesModal] = useState<{ open: boolean; lessonId: string }>({
    open: false,
    lessonId: "",
  });
  const MAX_LESSON_FILES = 3;
  const [draggedChapterId, setDraggedChapterId] = useState<string | null>(null);
  const [dragOverChapterId, setDragOverChapterId] = useState<string | null>(null);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  // Custom Highlight words lists (Step 2)
  const [newHighlightWord, setNewHighlightWord] = useState("");
  const [newUnderlineWord, setNewUnderlineWord] = useState("");

  // Auto generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: val
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9آ-ی\s]/g, "")
        .replace(/\s+/g, "-"),
    }));
  };

  const normalizeDigitsToEnglish = (value: string) => {
    return value
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const englishDigits = normalizeDigitsToEnglish(e.target.value);
    const digitsOnly = englishDigits.replace(/\D/g, "");
    const withoutLeadingZeros = digitsOnly.replace(/^0+/, "");
    setFormData((p) => ({ ...p, duration: withoutLeadingZeros }));
  };

  const handleStudentsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const englishDigits = normalizeDigitsToEnglish(e.target.value);
    const digitsOnly = englishDigits.replace(/\D/g, "");
    const withoutLeadingZeros = digitsOnly.replace(/^0+/, "");
    setFormData((p) => ({
      ...p,
      studentsCount: withoutLeadingZeros ? Number(withoutLeadingZeros) : 0,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const englishDigits = normalizeDigitsToEnglish(e.target.value);
    const digitsOnly = englishDigits.replace(/\D/g, "");
    const withoutLeadingZeros = digitsOnly.replace(/^0+/, "");
    setFormData((p) => ({
      ...p,
      price: withoutLeadingZeros ? Number(withoutLeadingZeros) : 0,
    }));
  };

  const normalizeLessonsForPricing = (isPaid: string) => {
    if (isPaid !== "free") return;
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) => ({ ...lesson, access: "free" })),
      })),
    }));
  };

  // Mock uploads
  const handleCoverUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverProgress(10);
      const interval = setInterval(() => {
        setCoverProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // mock cover image conversion
            setFormData((prevData) => ({
              ...prevData,
              cover: "https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=600&auto=format&fit=crop",
            }));
            return 100;
          }
          return prev + 15;
        });
      }, 80);
    }
  };

  const handleVideoUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoProgress(10);
      const interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setFormData((prevData) => ({
              ...prevData,
              introVideo: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
            }));
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  // Feature actions
  const addOrUpdateFeature = () => {
    if (!featTitle.trim()) return;

    if (editingFeatId) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.map(f => f.id === editingFeatId ? { ...f, title: featTitle, icon: featIcon, color: featColor } : f)
      }));
      setEditingFeatId(null);
    } else {
      const newFeat = {
        id: `feat-${Math.random().toString(36).substr(2, 9)}`,
        title: featTitle,
        icon: featIcon,
        color: featColor
      };
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeat] }));
    }
    setFeatTitle("");
  };

  const deleteFeature = (id: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }));
  };

  const editFeature = (feat: any) => {
    setFeatTitle(feat.title);
    setFeatIcon(feat.icon);
    setFeatColor(feat.color);
    setEditingFeatId(feat.id);
  };

  // Chapter actions
  const addOrUpdateChapter = () => {
    if (!chapTitle.trim()) return;

    if (editingChapId) {
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.map(c => c.id === editingChapId ? { ...c, title: chapTitle, subtitle: chapSubtitle } : c)
      }));
      setEditingChapId(null);
    } else {
      const chapNumber = String(formData.chapters.length + 1).padStart(2, '0');
      const newChap = {
        id: `chap-${Math.random().toString(36).substr(2, 9)}`,
        title: chapTitle,
        subtitle: chapSubtitle,
        number: chapNumber,
        lessons: []
      };
      setFormData(prev => ({ ...prev, chapters: [...prev.chapters, newChap] }));
    }
    setChapTitle("");
    setChapSubtitle("");
  };

  const deleteChapter = (id: string) => {
    setFormData(prev => ({ ...prev, chapters: prev.chapters.filter(c => c.id !== id) }));
  };

  const editChapter = (chap: any) => {
    setChapTitle(chap.title);
    setChapSubtitle(chap.subtitle);
    setEditingChapId(chap.id);
  };

  const addChapterInline = () => {
    const chapNumber = String(formData.chapters.length + 1).padStart(2, "0");
    const newChap = {
      id: `chap-${Math.random().toString(36).substr(2, 9)}`,
      title: "سرفصل جدید",
      subtitle: "",
      number: chapNumber,
      lessons: [],
    };
    setFormData((prev) => ({ ...prev, chapters: [...prev.chapters, newChap] }));
    setEditingChapterTitleId(newChap.id);
  };

  const addLessonInline = (chapId: string) => {
    const newLes = {
      id: `les-${Math.random().toString(36).substr(2, 9)}`,
      title: "جلسه جدید",
      duration: "15:00",
      type: "video",
      access: formData.isPaid === "free" ? "free" : "locked",
    };
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId ? { ...c, lessons: [...c.lessons, newLes] } : c
      ),
    }));
    setEditingLessonTitleId(newLes.id);
  };

  const updateChapterTitleInline = (chapId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId ? { ...c, title: value } : c
      ),
    }));
  };

  const moveChapter = (index: number, direction: "up" | "down") => {
    const updated = [...formData.chapters];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Recalculate Persian numbers
    const finalChaps = updated.map((ch, idx) => ({
      ...ch,
      number: String(idx + 1).padStart(2, '0')
    }));

    setFormData(prev => ({ ...prev, chapters: finalChaps }));
  };

  const reorderChapters = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setFormData((prev) => {
      const sourceIndex = prev.chapters.findIndex((c) => c.id === sourceId);
      const targetIndex = prev.chapters.findIndex((c) => c.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;

      const updated = [...prev.chapters];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);

      const finalChaps = updated.map((ch, idx) => ({
        ...ch,
        number: String(idx + 1).padStart(2, "0"),
      }));

      return { ...prev, chapters: finalChaps };
    });
  };

  // Lesson actions
  const addOrUpdateLesson = () => {
    if (!lesTitle.trim() || !selectedChapIdForLesson) return;

    if (editingLesId) {
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.map(c => ({
          ...c,
          lessons: c.lessons.map(l =>
            l.id === editingLesId
              ? { ...l, title: lesTitle, duration: lesDuration, type: lesType, access: formData.isPaid === "free" ? "free" : lesAccess }
              : l
          )
        }))
      }));
      setEditingLesId(null);
    } else {
      const newLes = {
        id: `les-${Math.random().toString(36).substr(2, 9)}`,
        title: lesTitle,
        duration: lesDuration,
        type: lesType,
        access: formData.isPaid === "free" ? "free" : lesAccess
      };
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.map(c => c.id === selectedChapIdForLesson ? { ...c, lessons: [...c.lessons, newLes] } : c)
      }));
    }
    setLesTitle("");
    setLesDuration("15:00");
  };

  const deleteLesson = (chapId: string, lesId: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map(c => c.id === chapId ? { ...c, lessons: c.lessons.filter(l => l.id !== lesId) } : c)
    }));
  };

  const editLesson = (chapId: string, les: any) => {
    setSelectedChapIdForLesson(chapId);
    setLesTitle(les.title);
    setLesDuration(les.duration);
    setLesType(les.type);
    setLesAccess(les.access);
    setEditingLesId(les.id);
  };

  const updateLessonTitleInline = (chapId: string, lesId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId
          ? { ...c, lessons: c.lessons.map((l) => (l.id === lesId ? { ...l, title: value } : l)) }
          : c
      ),
    }));
  };

  const updateLessonDurationInline = (chapId: string, lesId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapId
          ? { ...c, lessons: c.lessons.map((l) => (l.id === lesId ? { ...l, duration: value } : l)) }
          : c
      ),
    }));
  };

  const toggleLessonAccess = (chapId: string, lesId: string) => {
    if (formData.isPaid === "free") return;
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter) =>
        chapter.id === chapId
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson) =>
                lesson.id === lesId
                  ? { ...lesson, access: lesson.access === "free" ? "locked" : "free" }
                  : lesson
              ),
            }
          : chapter
      ),
    }));
  };

  const handleLessonVideoUpload = (lessonId: string, file?: File) => {
    if (!file) return;
    const videoUrl = URL.createObjectURL(file);
    setLessonUploadProgress((prev) => ({ ...prev, [lessonId]: 0 }));

    const interval = setInterval(() => {
      setLessonUploadProgress((prev) => {
        const current = prev[lessonId] ?? 0;
        const next = Math.min(current + 10, 100);
        if (next >= 100) {
          clearInterval(interval);
          setLessonVideoMap((v) => ({ ...v, [lessonId]: { name: file.name, url: videoUrl } }));
          setTimeout(() => {
            setLessonUploadProgress((after) => {
              const copy = { ...after };
              delete copy[lessonId];
              return copy;
            });
          }, 800);
        }
        return { ...prev, [lessonId]: next };
      });
    }, 120);
  };

  const removeLessonVideo = (lessonId: string) => {
    setLessonVideoMap((prev) => {
      const target = prev[lessonId];
      if (target?.url) URL.revokeObjectURL(target.url);
      const copy = { ...prev };
      delete copy[lessonId];
      return copy;
    });
  };

  const handleLessonFileUpload = (lessonId: string, files?: FileList | null) => {
    if (!files || files.length === 0) return;
    setLessonFileMap((prev) => {
      const current = prev[lessonId] || [];
      const remaining = Math.max(0, MAX_LESSON_FILES - current.length);
      if (remaining === 0) return prev;

      const selected = Array.from(files).slice(0, remaining);
      const newFiles = selected.map((file) => ({
        id: `file-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      return { ...prev, [lessonId]: [...current, ...newFiles] };
    });
  };

  const removeLessonFile = (lessonId: string, fileId: string) => {
    setLessonFileMap((prev) => {
      const list = prev[lessonId] || [];
      const target = list.find((f) => f.id === fileId);
      if (target?.url) URL.revokeObjectURL(target.url);
      const nextList = list.filter((f) => f.id !== fileId);
      const copy = { ...prev };
      if (nextList.length) copy[lessonId] = nextList;
      else delete copy[lessonId];
      return copy;
    });
  };

  // FAQ actions
  const addOrUpdateFAQ = () => {
    if (!faqQ.trim() || !faqA.trim()) return;

    if (editingFaqId) {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.map(f => f.id === editingFaqId ? { ...f, question: faqQ, answer: faqA } : f)
      }));
      setEditingFaqId(null);
    } else {
      const newFaq = {
        id: `faq-${Math.random().toString(36).substr(2, 9)}`,
        question: faqQ,
        answer: faqA
      };
      setFormData(prev => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
    }
    setFaqQ("");
    setFaqA("");
  };

  const deleteFAQ = (id: string) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter(f => f.id !== id) }));
  };

  const editFAQ = (faq: any) => {
    setFaqQ(faq.question);
    setFaqA(faq.answer);
    setEditingFaqId(faq.id);
  };

  // List updates
  const addHighlightItem = () => {
    if (newHighlight.trim() && !formData.aboutHighlights.includes(newHighlight.trim())) {
      setFormData(p => ({ ...p, aboutHighlights: [...p.aboutHighlights, newHighlight.trim()] }));
      setNewHighlight("");
    }
  };

  const removeHighlightItem = (item: string) => {
    setFormData(p => ({ ...p, aboutHighlights: p.aboutHighlights.filter(h => h !== item) }));
  };

  // Step 2 word helper additions
  const addHighlightWord = () => {
    if (newHighlightWord.trim() && !formData.specialWords.highlighted.includes(newHighlightWord.trim())) {
      setFormData(p => ({
        ...p,
        specialWords: {
          ...p.specialWords,
          highlighted: [...p.specialWords.highlighted, newHighlightWord.trim()]
        }
      }));
      setNewHighlightWord("");
    }
  };

  const addUnderlineWord = () => {
    if (newUnderlineWord.trim() && !formData.specialWords.underlined.includes(newUnderlineWord.trim())) {
      setFormData(p => ({
        ...p,
        specialWords: {
          ...p.specialWords,
          underlined: [...p.specialWords.underlined, newUnderlineWord.trim()]
        }
      }));
      setNewUnderlineWord("");
    }
  };

  const openDeleteConfirm = (title: string, description: string, onConfirm: () => void) => {
    setDeleteConfirm({
      open: true,
      title,
      description,
      onConfirm,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      open: false,
      title: "",
      description: "",
      onConfirm: null,
    });
  };

  // Form validations
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    const newWarnings: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "نام دوره الزامی است.";
      if (formData.isPaid === "paid" && (!formData.price || formData.price <= 0)) {
        newErrors.price = "قیمت دوره نقدی باید بیشتر از صفر باشد.";
      }
      if (!formData.duration.trim()) newErrors.duration = "مدت زمان دوره الزامی است.";
      if (!formData.level) newErrors.level = "سطح آموزشی دوره الزامی است.";
    }

    if (currentStep === 2) {
      if (!formData.heroTitle.trim()) newErrors.heroTitle = "عنوان معرفی هیرو الزامی است.";
      if (!formData.shortDescription.trim()) newErrors.shortDescription = "توضیح کوتاه هیرو الزامی است.";
    }

    if (currentStep === 3) {
      if (!formData.aboutDescription.trim()) newErrors.aboutDescription = "توضیحات درباره این دوره الزامی است.";
      if (formData.features.length === 0) newErrors.features = "حداقل وارد کردن یک ویژگی متمایز الزامی است.";
      if (formData.faqs.length === 0) {
        newWarnings.faqs = "توصیه می‌شود حداقل یک سوال متداول جهت راهنمایی دانشجویان اضافه کنید.";
      }
    }

    if (currentStep === 4) {
      if (formData.chapters.length === 0) newErrors.chapters = "حداقل وارد کردن یک فصل آموزشی الزامی است.";
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
      // scroll to top on step transition
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitWizard = (status: "published" | "draft" | "pending") => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setStep(1);
      return;
    }

    // Map wizard chapters to DB schema chapter/lessons
    const formattedChapters = formData.chapters.map((chap, idx) => ({
      id: chap.id,
      title: chap.title,
      duration: `${chap.lessons.length} جلسه`,
      lessons: chap.lessons.map(les => ({
        id: les.id,
        title: les.title,
        type: les.type as any,
        duration: les.duration,
        isFree: les.access === "free",
        status: "published" as const
      }))
    }));

    // Construct partial course object
    const finalCoursePayload = {
      title: formData.title,
      slug: formData.slug,
      cover: formData.cover || "https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=600&auto=format&fit=crop",
      introVideo: formData.introVideo || undefined,
      status: status,
      category: formData.category as any,
      level: formData.level as any,
      language: formData.language,
      shortDescription: formData.shortDescription,
      description: formData.aboutDescription,
      price: formData.isPaid === "free" ? 0 : formData.price,
      studentsCount: Number(formData.studentsCount) || 0,
      introText: formData.shortDescription,
      objectives: formData.aboutHighlights,
      prerequisites: ["تسلط بر مبانی مرتبط با دوره"],
      targetAudience: ["علاقه‌مندان به یادگیری عمیق توسعه وب"],
      chapters: formattedChapters,
      // Custom additions that will serialize in localStorage JSON
      features: formData.features,
      faqs: formData.faqs,
      specialWords: formData.specialWords
    };

    addCourse(finalCoursePayload as any);
    router.push("/instructor/courses");
  };

  // Total lessons count
  const totalLessonsCount = formData.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 text-right min-h-screen" dir="rtl">
      
      {/* 1. Page Header */}
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-10 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">استودیوی پیشرفته ایجاد دوره جدید</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
              ساده، گام‌به‌گام و مجهز به پیش‌نمایش زنده و کاملاً هماهنگ با صفحه نهایی و واقعی دوره.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Stepper Area */}
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-lg rounded-[2rem] p-6 mb-10">
        <div className="relative flex items-start justify-between overflow-x-auto sm:overflow-visible pt-2 pb-4 sm:pb-0 scrollbar-none gap-6">
          {/* Connector Line behind steps */}
          <div className="absolute left-6 right-6 top-8 -translate-y-1/2 h-[3px] bg-gray-100 dark:bg-white/10 z-0">
            {/* Active Connector Progress */}
            <div 
              className="absolute right-0 top-0 h-full bg-primary transition-all duration-500"
              style={{ 
                width: step === 1 ? "0%" : step === 2 ? "25%" : step === 3 ? "50%" : step === 4 ? "75%" : "100%"
              }} 
            />
          </div>

          {[
            { stepNum: 1, label: "اطلاعات کارت دوره", desc: "تصویر، قیمت و مشخصات" },
            { stepNum: 2, label: "معرفی و هیرو دوره", desc: "ویدیو، شعار و کلمات ویژه" },
            { stepNum: 3, label: "جزئیات و محتوای دوره", desc: "ویژگی‌ها، توضیحات و سوالات" },
            { stepNum: 4, label: "ویدیوها و جلسات", desc: "مدیریت سرفصل و فایل‌ها" },
            { stepNum: 5, label: "بررسی نهایی", desc: "پیش‌نمایش کلی و انتشار" },
          ].map((item) => (
            <button
              key={item.stepNum}
              onClick={() => validateStep(step) && step > item.stepNum && setStep(item.stepNum)}
              disabled={step < item.stepNum}
              className="relative z-10 flex flex-col items-center gap-2.5 cursor-pointer focus:outline-none disabled:cursor-not-allowed group shrink-0"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  step === item.stepNum
                    ? "bg-primary text-background-dark shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-110 z-20"
                    : step > item.stepNum
                    ? "bg-[#e6fbf0] dark:bg-[#132d21] text-primary border border-primary/20 z-10"
                    : "bg-gray-100 dark:bg-[#252833] text-gray-400 dark:text-gray-600 border border-transparent z-10"
                }`}
              >
                {step > item.stepNum ? <Check className="w-5 h-5" /> : item.stepNum}
              </div>
              <div className="text-center max-w-[120px]">
                <span
                  className={`text-xs block transition-all duration-300 ${
                    step === item.stepNum
                      ? "text-primary font-black scale-105 origin-top"
                      : step > item.stepNum
                      ? "text-gray-800 dark:text-gray-200 font-bold"
                      : "text-gray-400 dark:text-gray-600 font-medium"
                  }`}
                >
                  {item.label}
                </span>
                <span 
                  className={`text-[9px] font-bold block mt-1 transition-all duration-300 ${
                    step === item.stepNum
                      ? "text-primary/70 dark:text-primary/60 font-black"
                      : step > item.stepNum
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-400/60 dark:text-gray-600"
                  }`}
                >
                  {item.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main layout: Step 1 = two columns, other steps = stacked */}
      <div
        className={
          step === 1
            ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10"
            : "flex flex-col gap-8 items-stretch mb-10"
        }
      >
        
        {/* --- RIGHT SIDE: FORM COMPONENT (7 cols on large screens) --- */}
        <div
          className={`w-full bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl rounded-[2.5rem] p-5 md:p-6 lg:p-7 min-h-[520px] flex flex-col justify-between ${
            step === 1 ? "lg:col-span-6 lg:order-1" : ""
          }`}
        >
          
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* STEP 1: INITIAL CARD DETAILS */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله اول: اطلاعات اولیه کارت دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    این اطلاعات در لیست دوره‌ها و کارت کوچک دوره نمایش داده می‌شود.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نام دوره <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="مثال: استایل‌دهی با CSS"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className={`px-4 py-2.5 bg-gray-50 dark:bg-white/5 border ${errors.title ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right`}
                    />
                    {errors.title && <span className="text-[10px] text-red-500 font-bold">{errors.title}</span>}
                  </div>

                  {/* Slug */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">شناسه (Slug) دوره</label>
                    <input
                      type="text"
                      placeholder="css-styling"
                      value={formData.slug}
                      onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                      className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">دسته‌بندی اصلی</label>
                    <CustomSelect
                      value={formData.category}
                      onChange={(value) => setFormData((p) => ({ ...p, category: value }))}
                      options={[
                        { value: "Frontend", label: "Frontend (فرانت‌اند)" },
                        { value: "Backend", label: "Backend (بک‌اند)" },
                        { value: "DevOps", label: "DevOps (دواپس)" },
                        { value: "Mobile", label: "Mobile (موبایل)" },
                        { value: "UI/UX", label: "UI/UX (رابط کاربری)" },
                      ]}
                      size="sm"
                    />
                  </div>

                  {/* Level */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">سطح آموزشی دوره</label>
                    <CustomSelect
                      value={formData.level}
                      onChange={(value) => setFormData((p) => ({ ...p, level: value }))}
                      options={[
                        { value: "elementary", label: "مقدماتی" },
                        { value: "intermediate", label: "متوسط" },
                        { value: "advanced", label: "پیشرفته" },
                      ]}
                      size="sm"
                    />
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">مدت زمان دوره <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="18"
                        value={formData.duration}
                        onChange={handleDurationChange}
                        className="w-full px-4 py-2.5 pl-14 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                        dir="ltr"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                        ساعت
                      </span>
                    </div>
                  </div>

                  {/* Students count */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">تعداد دانشجو اولیه (Mock)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      value={formData.studentsCount === 0 ? "" : String(formData.studentsCount)}
                      onChange={handleStudentsCountChange}
                      className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                      dir="ltr"
                    />
                  </div>

                </div>

                {/* Free / Paid Toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">وضعیت قیمت دوره</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, isPaid: "free" }));
                        normalizeLessonsForPricing("free");
                      }}
                      className={`p-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        formData.isPaid === "free"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200/60 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-primary/20"
                      }`}
                    >
                      رایگان
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, isPaid: "paid" }))}
                      className={`p-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        formData.isPaid === "paid"
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200/60 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-primary/20"
                      }`}
                    >
                      نقدی (پولی)
                    </button>
                  </div>
                </div>

                {/* Price input */}
                {formData.isPaid === "paid" && (
                  <div className="flex flex-col gap-2 animate-in slide-in-from-top-4 duration-300">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">قیمت دوره (به تومان) <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="1450000"
                        value={formData.price === 0 ? "" : String(formData.price)}
                        onChange={handlePriceChange}
                        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border ${errors.price ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-xl text-xs font-black focus:border-primary focus:outline-none transition-all text-left`}
                        dir="ltr"
                      />
                      <span className="absolute right-4 text-xs font-bold text-gray-400">تومان</span>
                    </div>
                    {errors.price && <span className="text-[10px] text-red-500 font-bold">{errors.price}</span>}
                  </div>
                )}

                {/* Cover Image Upload (Mock) */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">تصویر کاور دوره</label>
                  <div className="relative border-2 border-dashed border-gray-200/60 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 min-h-[130px] text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUploadSimulate}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {coverProgress === 0 ? (
                      <>
                        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-[11px] font-black text-gray-700 dark:text-gray-300 mb-1">
                          انتخاب یا رها کردن تصویر کاور
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold">PNG, JPG حداکثر ۵ مگابایت (اندازه 16:9)</p>
                      </>
                    ) : coverProgress < 100 ? (
                      <div className="w-full space-y-2 px-4 z-20">
                        <FileImage className="w-8 h-8 text-primary mx-auto" />
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                          <span>درحال آپلود...</span>
                          <span>{coverProgress}٪</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${coverProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-2 z-20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.cover}
                          alt="کاور دوره"
                          className="w-full max-h-[100px] object-cover rounded-xl mb-2"
                        />
                        <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>{coverFile?.name} ({Math.round((coverFile?.size || 0)/1024)} KB)</span>
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverProgress(0);
                            setCoverFile(null);
                            setFormData((p) => ({ ...p, cover: "" }));
                          }}
                          className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors z-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: HERO & INTRODUCTION BANNER */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله دوم: هیرو و معرفی دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    این جزئیات در ابتدای صفحه اختصاصی دوره قرار دارند و نرخ تبدیل دانشجو را می‌سازند.
                  </p>
                </div>

                {/* Hero title */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان اصلی هیرو <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="مثال: متخصص React و Next.js"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData(p => ({ ...p, heroTitle: e.target.value }))}
                    className={`px-4 py-2.5 bg-gray-50 dark:bg-white/5 border ${errors.heroTitle ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right`}
                  />
                  {errors.heroTitle && <span className="text-[10px] text-red-500 font-bold">{errors.heroTitle}</span>}
                </div>

                {/* Title highlights (Special Words) */}
                <div className="p-3 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                  <span className="text-xs font-black text-gray-900 dark:text-white block">کلمات ویژه عنوان (Special Words)</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Highlighted text list */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">کلمات سبز (Highlight)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="کلمه"
                          value={newHighlightWord}
                          onChange={(e) => setNewHighlightWord(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                        />
                        <button
                          type="button"
                          onClick={addHighlightWord}
                          className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.specialWords.highlighted.map((word, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-lg border border-emerald-500/20">
                            {word}
                            <button type="button" onClick={() => setFormData(p => ({ ...p, specialWords: { ...p.specialWords, highlighted: p.specialWords.highlighted.filter(w => w !== word) } }))}>
                              <X className="w-3 h-3 text-red-500 hover:scale-110 transition-transform" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Underlined text list */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">کلمات دارای خط زیرین (Underline)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="کلمه"
                          value={newUnderlineWord}
                          onChange={(e) => setNewUnderlineWord(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                        />
                        <button
                          type="button"
                          onClick={addUnderlineWord}
                          className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.specialWords.underlined.map((word, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-500 text-[9px] font-black rounded-lg border border-blue-500/20">
                            {word}
                            <button type="button" onClick={() => setFormData(p => ({ ...p, specialWords: { ...p.specialWords, underlined: p.specialWords.underlined.filter(w => w !== word) } }))}>
                              <X className="w-3 h-3 text-red-500 hover:scale-110 transition-transform" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Highlight Color Pick */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">انتخاب رنگ هایلایت کلمات</label>
                    <div className="flex gap-3">
                      {[
                        { name: "سبز برند", val: "green", class: "bg-primary" },
                        { name: "سفید", val: "white", class: "bg-white border border-gray-200" },
                        { name: "زرد طلایی", val: "yellow", class: "bg-amber-500" },
                        { name: "آبی ملایم", val: "blue", class: "bg-blue-500" }
                      ].map((col) => (
                        <button
                          type="button"
                          key={col.val}
                          onClick={() => setFormData(p => ({ ...p, specialWords: { ...p.specialWords, color: col.val } }))}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            formData.specialWords.color === col.val
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-transparent bg-white dark:bg-white/5 text-gray-500 hover:border-gray-200"
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${col.class}`} />
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیح کوتاه هیرو <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    placeholder="توضیح کوتاهی که در هیرو بالای صفحه قرار می‌گیرد..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                    className={`px-4 py-2.5 bg-gray-50 dark:bg-white/5 border ${errors.shortDescription ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right leading-relaxed`}
                  />
                  {errors.shortDescription && <span className="text-[10px] text-red-500 font-bold">{errors.shortDescription}</span>}
                </div>

                {/* Intro Video Upload (Mock) */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">ویدیوی معرفی دوره</label>
                  <div className="relative border-2 border-dashed border-gray-200/60 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 min-h-[130px] text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUploadSimulate}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {videoProgress === 0 ? (
                      <>
                        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-[11px] font-black text-gray-700 dark:text-gray-300 mb-1">
                          انتخاب یا رها کردن ویدیوی پیش‌نمایش
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold">MP4, MKV حداکثر ۵۰ مگابایت</p>
                      </>
                    ) : videoProgress < 100 ? (
                      <div className="w-full space-y-2 px-4 z-20">
                        <Video className="w-8 h-8 text-primary mx-auto animate-pulse" />
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                          <span>درحال آپلود...</span>
                          <span>{videoProgress}٪</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${videoProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-2 z-20">
                        <Video className="w-10 h-10 text-emerald-500 mb-2" />
                        <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>{videoFile?.name} ({Math.round((videoFile?.size || 0)/1024/1024)} MB)</span>
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideoProgress(0);
                            setVideoFile(null);
                            setFormData((p) => ({ ...p, introVideo: "" }));
                          }}
                          className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors z-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: COURSE DETAILS, FAQ & FEATURES */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله سوم: محتوای عمیق صفحه دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    در این مرحله ویژگی‌های متمایز، توضیحات درباره دوره و سوالات متداول را تعریف کنید.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                {/* --- 3A. ABOUT SECTION --- */}
                <div className="xl:col-span-7 p-4 md:p-5 bg-gradient-to-b from-gray-50/50 to-gray-50/20 dark:from-white/[0.07] dark:to-white/[0.03] rounded-2xl border border-gray-200/70 dark:border-white/10 space-y-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]">
                  <span className="text-sm font-black text-gray-900 dark:text-white block border-b border-gray-200/70 dark:border-white/10 pb-3">۱. بخش درباره این دوره</span>
                  
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300">توضیحات درباره دوره (پاراگراف‌ها) <span className="text-red-500">*</span></label>
                    <textarea
                      rows={5}
                      placeholder="متن کامل درباره دوره، اهداف و شبیه‌سازی بازار کار..."
                      value={formData.aboutDescription}
                      onChange={(e) => setFormData(p => ({ ...p, aboutDescription: e.target.value }))}
                      className={`px-4 py-3.5 bg-white dark:bg-[#1a1c23] border ${errors.aboutDescription ? "border-red-500" : "border-gray-200/70 dark:border-white/10"} rounded-2xl text-xs font-medium focus:border-primary focus:outline-none transition-all text-right leading-7`}
                    />
                    {errors.aboutDescription && <span className="text-[10px] text-red-500 font-bold">{errors.aboutDescription}</span>}
                  </div>

                  {/* Highlights (badges inside text) */}
                  <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/80 dark:bg-[#171a22] border border-gray-200/70 dark:border-white/10">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300">عبارت‌های هایلایت شده داخل متن (Badge)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-center">
                      <input
                        type="text"
                        placeholder="مثال: طرز تفکر مهندسی"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1c23] border border-gray-200/70 dark:border-white/5 rounded-xl text-[11px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                      />
                      <button
                        type="button"
                        onClick={addHighlightItem}
                        className="h-10 px-4 sm:px-3 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-[10px] font-black sm:hidden">افزودن</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.aboutHighlights.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-xl border border-emerald-500/20">
                          {item}
                          <button type="button" onClick={() => openDeleteConfirm("حذف عبارت هایلایت", "آیا مطمئن هستید که می‌خواهید این عبارت حذف شود؟", () => removeHighlightItem(item))} className="cursor-pointer">
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- 3B. DISTINCTIVE FEATURES SECTION --- */}
                <div className="xl:col-span-5 p-4 md:p-5 bg-gradient-to-b from-gray-50/50 to-gray-50/20 dark:from-white/[0.07] dark:to-white/[0.03] rounded-2xl border border-gray-200/70 dark:border-white/10 space-y-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]">
                  <span className="text-sm font-black text-gray-900 dark:text-white block border-b border-gray-200/70 dark:border-white/10 pb-3">۲. ویژگی‌های متمایز دوره</span>
                  
                  {errors.features && <span className="text-[10px] text-red-500 font-bold block">{errors.features}</span>}
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="عنوان ویژگی (مثال: پشتیبانی اختصاصی تلگرام)"
                        value={featTitle}
                        onChange={(e) => setFeatTitle(e.target.value)}
                        className="px-4 py-2.5 bg-white dark:bg-[#1a1c23] border border-gray-200/70 dark:border-white/10 rounded-xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Icon options */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">انتخاب آیکون</label>
                        <select
                          value={featIcon}
                          onChange={(e) => setFeatIcon(e.target.value)}
                          className="px-3 py-2.5 bg-white dark:bg-[#1a1c23] border border-gray-200/70 dark:border-white/10 rounded-xl text-[10px] font-bold text-right cursor-pointer"
                        >
                          <option value="all_inclusive">بینهایت (مادام‌العمر)</option>
                          <option value="workspace_premium">مدرک تحصیلی</option>
                          <option value="forum">پشتیبانی / تالار</option>
                          <option value="video_library">ویدیو کلاسی</option>
                          <option value="architecture">پروژه‌محور</option>
                        </select>
                      </div>

                      {/* Color options */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">رنگ آیکون</label>
                        <select
                          value={featColor}
                          onChange={(e) => setFeatColor(e.target.value)}
                          className="px-3 py-2.5 bg-white dark:bg-[#1a1c23] border border-gray-200/70 dark:border-white/10 rounded-xl text-[10px] font-bold text-right cursor-pointer"
                        >
                          <option value="primary">سبز برند</option>
                          <option value="blue-500">آبی اقیانوسی</option>
                          <option value="purple-500">بنفش رویال</option>
                          <option value="amber-500">طلایی امتیاز</option>
                          <option value="red-500">قرمز هشدار</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addOrUpdateFeature}
                      className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingFeatId ? "ویرایش و ذخیره ویژگی" : "افزودن ویژگی جدید"}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[240px] overflow-y-auto mt-2 pr-1">
                    {formData.features.map((feat) => (
                      <div key={feat.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-white/5 text-[10px] font-bold">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-base flex-shrink-0 text-${feat.color === 'primary' ? 'primary' : feat.color}`}>
                            {feat.icon}
                          </span>
                          <span>{feat.title}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button type="button" onClick={() => editFeature(feat)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-blue-500">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button type="button" onClick={() => openDeleteConfirm("حذف ویژگی", "آیا مطمئن هستید که می‌خواهید این ویژگی حذف شود؟", () => deleteFeature(feat.id))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>

                {/* --- 3D. FAQ SECTION --- */}
                {!isFaqEditorOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsFaqEditorOpen(true)}
                    className="w-full rounded-2xl p-5 border border-gray-200/70 dark:border-white/10 bg-white dark:bg-[#1c1e26]/80 flex items-center justify-between text-right"
                  >
                    <span className="text-base font-black text-gray-900 dark:text-white">۳. سوالات متداول</span>
                    <span className="material-symbols-outlined text-primary">expand_more</span>
                  </button>
                ) : (
                  <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1c1e26]/80 border border-gray-200/70 dark:border-white/10">
                    <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200/70 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="size-8 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center">
                          <HelpCircle className="w-4 h-4" />
                        </span>
                        <span className="text-base font-black text-gray-900 dark:text-white">۳. سوالات متداول</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFaqEditorOpen(false)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold"
                      >
                        بستن
                      </button>
                    </div>

                    {warnings.faqs && (
                      <div className="mx-5 mt-4 p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 rounded-xl text-[9px] font-bold flex items-center gap-1.5 leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{warnings.faqs}</span>
                      </div>
                    )}

                    <div className="p-5 space-y-4">
                      <div className="space-y-3 p-4 rounded-xl border border-gray-200/70 dark:border-white/10">
                        <input
                          type="text"
                          placeholder="پرسش سوال (مثال: پشتیبانی دوره چگونه است؟)"
                          value={faqQ}
                          onChange={(e) => setFaqQ(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-[#1a1c23] border border-gray-200/70 dark:border-white/10 rounded-xl text-xs font-bold focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all text-right"
                        />
                        <textarea
                          rows={3}
                          placeholder="پاسخ سوال به طور دقیق..."
                          value={faqA}
                          onChange={(e) => setFaqA(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-[#1a1c23] border border-gray-200/70 dark:border-white/10 rounded-xl text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all text-right leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={addOrUpdateFAQ}
                          className="w-full py-3 bg-primary/15 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{editingFaqId ? "ویرایش و ذخیره سوال" : "افزودن سوال جدید"}</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {formData.faqs.map((faq) => {
                          const isOpen = openFaqItemId === faq.id;
                          return (
                            <div
                              key={faq.id}
                              className={`rounded-[2.25rem] border transition-all ${
                                isOpen
                                  ? "bg-gray-50/90 dark:bg-white/[0.06] border-gray-200 dark:border-white/15"
                                  : "bg-gray-50/70 dark:bg-white/[0.03] border-gray-200/90 dark:border-white/12"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => setOpenFaqItemId((prev) => (prev === faq.id ? null : faq.id))}
                                className="w-full px-6 py-5 flex items-center justify-between gap-3 text-right cursor-pointer"
                              >
                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[78%]">
                                  {faq.question}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      editFAQ(faq);
                                    }}
                                    className="size-9 inline-flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full text-blue-500 transition-colors"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeleteConfirm("حذف سوال متداول", "آیا مطمئن هستید که می‌خواهید این سوال حذف شود؟", () => deleteFAQ(faq.id));
                                    }}
                                    className="size-9 inline-flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="size-9 inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-500">
                                    <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                  </span>
                                </div>
                              </button>
                              {isOpen && (
                                <div className="px-6 pb-5 pt-0 border-t border-gray-200/70 dark:border-white/10">
                                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-4">{faq.answer}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* STEP 4: LESSONS & CHAPTER CURRICULUM EDITOR */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله چهارم: مدیریت ویدیوها و جلسات
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    در این مرحله سرفصل‌ها، ویدیوهای هر جلسه، فایل‌های ضمیمه و دسترسی باز/قفل را مدیریت کنید.
                  </p>
                </div>

                <div className="p-5 md:p-6 bg-gradient-to-b from-gray-50/50 to-gray-50/20 dark:from-white/[0.07] dark:to-white/[0.03] rounded-3xl border border-gray-200/70 dark:border-white/10 space-y-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]">
                  <span className="text-sm font-black text-gray-900 dark:text-white block border-b border-gray-200/70 dark:border-white/10 pb-3">سرفصل‌ها و جلسات درسی</span>
                  {errors.chapters && <span className="text-[10px] text-red-500 font-bold block">{errors.chapters}</span>}
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addChapterInline}
                      className="h-11 px-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن سرفصل جدید
                    </button>
                  </div>

                  <div className="rounded-2xl bg-white/80 dark:bg-[#171a22] border border-gray-200/70 dark:border-white/10 p-3 md:p-4">
                    <div className="flex items-center justify-between border-b border-gray-200/70 dark:border-white/10 pb-2.5 mb-3">
                      <span className="text-xs font-black text-gray-900 dark:text-white">لیست فصل‌ها و جلسات</span>
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{formData.chapters.length} فصل</span>
                    </div>
                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                      {formData.chapters.map((chap, chapIdx) => (
                        <div
                          key={chap.id}
                          className={`p-3.5 bg-white dark:bg-[#1a1c23] rounded-2xl border space-y-3 transition-all ${
                            dragOverChapterId === chap.id
                              ? "border-primary/60 ring-2 ring-primary/20"
                              : "border-gray-200/70 dark:border-white/10"
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (dragOverChapterId !== chap.id) setDragOverChapterId(chap.id);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedChapterId) reorderChapters(draggedChapterId, chap.id);
                            setDraggedChapterId(null);
                            setDragOverChapterId(null);
                          }}
                          onDragLeave={(e) => {
                            const next = e.relatedTarget as Node | null;
                            if (!next || !e.currentTarget.contains(next)) setDragOverChapterId(null);
                          }}
                        >
                          <div
                            className="flex items-center justify-between border-b dark:border-white/5 pb-2 cursor-grab active:cursor-grabbing"
                            draggable
                            onDragStart={() => {
                              setDraggedChapterId(chap.id);
                              setDragOverChapterId(chap.id);
                            }}
                            onDragEnd={() => {
                              setDraggedChapterId(null);
                              setDragOverChapterId(null);
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black mr-1">{chap.number}</span>
                              {editingChapterTitleId === chap.id ? (
                                <input
                                  autoFocus
                                  value={chap.title}
                                  onChange={(e) => updateChapterTitleInline(chap.id, e.target.value)}
                                  onBlur={() => setEditingChapterTitleId(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") setEditingChapterTitleId(null);
                                  }}
                                  className="h-8 px-2 rounded-lg border border-blue-500/40 bg-white dark:bg-white/5 text-[10px] font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setEditingChapterTitleId(chap.id)}
                                  className="text-[10px] font-black text-gray-900 dark:text-white hover:text-primary transition-colors cursor-text"
                                >
                                  {chap.title}
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setCollapsedChapters((prev) => ({
                                    ...prev,
                                    [chap.id]: !prev[chap.id],
                                  }))
                                }
                                className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                                title={collapsedChapters[chap.id] ? "باز کردن فصل" : "بستن فصل"}
                              >
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collapsedChapters[chap.id] ? "-rotate-90" : ""}`} />
                              </button>
                              <span className="material-symbols-outlined text-[14px] text-gray-400 dark:text-gray-500">drag_indicator</span>
                              <button type="button" onClick={() => moveChapter(chapIdx, "up")} disabled={chapIdx === 0} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 disabled:opacity-30">
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button type="button" onClick={() => moveChapter(chapIdx, "down")} disabled={chapIdx === formData.chapters.length - 1} className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 disabled:opacity-30">
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button type="button" onClick={() => openDeleteConfirm("حذف فصل", "با حذف فصل، تمام جلسات داخل آن هم حذف می‌شوند. ادامه می‌دهید؟", () => deleteChapter(chap.id))} className="size-7 inline-flex items-center justify-center rounded-lg border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button type="button" onClick={() => addLessonInline(chap.id)} className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary text-[10px] font-black">
                                <Plus className="w-3 h-3 ml-0.5" />
                                ویدیو
                              </button>
                            </div>
                          </div>

                          {!collapsedChapters[chap.id] && (
                          <div className="space-y-1.5 pr-4 border-r border-gray-200/80 dark:border-white/10">
                            {chap.lessons.length === 0 ? (
                              <span className="text-[8px] text-gray-400 block font-bold">هیچ درسی به این فصل اضافه نشده است.</span>
                            ) : (
                              chap.lessons.map((les) => (
                                <div key={les.id} className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-[9px] font-bold">
                                  <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-xs text-primary">
                                      {formData.isPaid === "free" || les.access === "free" ? "play_circle" : "lock"}
                                    </span>
                                    {editingLessonTitleId === les.id ? (
                                      <input
                                        autoFocus
                                        value={les.title}
                                        onChange={(e) => updateLessonTitleInline(chap.id, les.id, e.target.value)}
                                        onBlur={() => setEditingLessonTitleId(null)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") setEditingLessonTitleId(null);
                                        }}
                                        className="h-7 px-2 rounded-md border border-blue-500/40 bg-white dark:bg-white/5 text-[9px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setEditingLessonTitleId(les.id)}
                                        className="text-[9px] font-bold hover:text-primary transition-colors cursor-text"
                                      >
                                        {les.title}
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {formData.isPaid === "paid" && (
                                      <button type="button" onClick={() => toggleLessonAccess(chap.id, les.id)} className={`h-6 px-2 inline-flex items-center justify-center rounded-md border text-[8px] font-black ${les.access === "free" ? "border-emerald-200/80 bg-emerald-50 text-emerald-600" : "border-gray-200/80 bg-gray-50 text-gray-600"}`}>
                                        {les.access === "free" ? "باز" : "قفل"}
                                      </button>
                                    )}
                                    {editingLessonDurationId === les.id ? (
                                      <input
                                        autoFocus
                                        dir="ltr"
                                        value={les.duration}
                                        onChange={(e) => updateLessonDurationInline(chap.id, les.id, e.target.value)}
                                        onBlur={() => setEditingLessonDurationId(null)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") setEditingLessonDurationId(null);
                                        }}
                                        className="h-6 w-16 px-1.5 rounded-md border border-blue-500/40 bg-white dark:bg-white/5 text-[8px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setEditingLessonDurationId(les.id)}
                                        className="text-[8px] opacity-75 font-mono hover:text-primary transition-colors cursor-text"
                                      >
                                        {les.duration}
                                      </button>
                                    )}
                                    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-emerald-200/70 dark:border-emerald-400/20 bg-emerald-50/50 dark:bg-emerald-500/10">
                                      {!lessonVideoMap[les.id] && (
                                        <label className="size-6 inline-flex items-center justify-center rounded-md border border-blue-200/80 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all cursor-pointer overflow-hidden">
                                          <input
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              handleLessonVideoUpload(les.id, e.target.files?.[0]);
                                              e.currentTarget.value = "";
                                            }}
                                          />
                                          {typeof lessonUploadProgress[les.id] === "number" ? (
                                            <span className="text-[8px] font-black leading-none">{lessonUploadProgress[les.id]}%</span>
                                          ) : (
                                            <Video className="w-3.5 h-3.5" />
                                          )}
                                        </label>
                                      )}
                                      {lessonVideoMap[les.id] && typeof lessonUploadProgress[les.id] !== "number" && (
                                        <>
                                          <button type="button" onClick={() => window.open(lessonVideoMap[les.id].url, "_blank", "noopener,noreferrer")} className="h-6 px-2 inline-flex items-center justify-center rounded-md border border-emerald-200/80 dark:border-emerald-400/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all text-[8px] font-black cursor-pointer">
                                            ویدیو
                                          </button>
                                          <button type="button" onClick={() => openDeleteConfirm("حذف ویدیوی آپلود شده", "آیا از حذف این فایل ویدیو مطمئن هستید؟", () => removeLessonVideo(les.id))} className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer">
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-amber-200/70 dark:border-amber-400/20 bg-amber-50/40 dark:bg-amber-500/10">
                                      <button
                                        type="button"
                                        onClick={() => setLessonFilesModal({ open: true, lessonId: les.id })}
                                        className="h-6 px-2 inline-flex items-center justify-center rounded-md border border-amber-200/80 dark:border-amber-400/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all text-[8px] font-black cursor-pointer"
                                      >
                                        فایل ({lessonFileMap[les.id]?.length || 0})
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setLessonDescriptionEditor({
                                            open: true,
                                            lessonId: les.id,
                                            value: lessonDescriptionMap[les.id] || "",
                                          })
                                        }
                                        className={`h-6 px-2 inline-flex items-center justify-center rounded-md border transition-all text-[8px] font-black cursor-pointer ${
                                          lessonDescriptionMap[les.id]
                                            ? "border-indigo-200/80 dark:border-indigo-400/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                                            : "border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                                        }`}
                                      >
                                        توضیح
                                      </button>
                                    </div>
                                    <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-red-200/70 dark:border-red-400/20 bg-red-50/40 dark:bg-red-500/10">
                                      <button type="button" onClick={() => openDeleteConfirm("حذف جلسه", "آیا مطمئن هستید که می‌خواهید این جلسه حذف شود؟", () => deleteLesson(chap.id, les.id))} className="size-6 inline-flex items-center justify-center rounded-md border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: FINAL SUBMISSION REVIEW */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full animate-pulse" />
                    مرحله آخر: بازبینی و نهایی‌سازی دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    داده‌های وارد شده را از کادر سمت چپ به صورت کاملاً زنده در قالب صفحه واقعی وب بررسی کرده و وضعیت انتشار را تعیین کنید.
                  </p>
                </div>

                {/* Final Checklist Card */}
                <div className="p-5 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-xs font-black text-gray-900 dark:text-white block border-b dark:border-white/5 pb-2">لیست نهایی بررسی کیفیت دوره:</span>
                  
                  <div className="space-y-2.5 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>نام دوره: <strong className="text-gray-900 dark:text-white">{formData.title}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>قیمت دوره: <strong className="text-primary font-black">{formData.isPaid === 'free' ? 'رایگان' : `${formData.price.toLocaleString("fa-IR")} تومان`}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>مشخصات پایه: <strong>سطح {formData.level === 'elementary' ? 'مقدماتی' : formData.level === 'intermediate' ? 'متوسط' : 'پیشرفته'} • {formData.duration} تدریس</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>محتوای تدریس: <strong>{formData.chapters.length} فصل درسی • {totalLessonsCount} جلسه فعال</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-700 dark:text-amber-300">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black">قوانین و حریم خصوصی انتشار دوره</p>
                    <p className="text-[10px] font-semibold leading-relaxed">
                      با کلیک بر روی «ارسال برای بررسی»، دوره جهت بازبینی تایید کیفیت توسط تیم محتوای اسپاتی‌کد لود شده و طی ۲۴ ساعت تایید می‌گردد. همچنین برای تکمیل سرفصل‌ها بعداً می‌توانید آن را به صورت «پیش‌نویس» در پنل خود ذخیره کنید.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 3. Bottom controls */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-100/50 dark:border-white/5 mt-8">
            {/* Back Button */}
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all cursor-pointer select-none"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مرحله قبلی</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/instructor/courses")}
                className="flex items-center gap-1.5 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all cursor-pointer select-none"
              >
                <ArrowRight className="w-4 h-4" />
                <span>انصراف و بازگشت</span>
              </button>
            )}

            {/* Next / Submit buttons */}
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer select-none"
              >
                <span>مرحله بعدی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmitWizard("draft")}
                  className="px-5 py-3.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  ذخیره به عنوان پیش‌نویس
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitWizard("pending")}
                  className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer"
                >
                  ارسال برای بررسی و انتشار
                </button>
              </div>
            )}
          </div>

        </div>

        {/* --- LEFT SIDE: LIVE PREVIEW PANEL (6 cols on large screens, sticky scroll) --- */}
        <div
          className={`w-full rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-4 bg-gray-50/50 dark:bg-white/[0.02] backdrop-blur-md shadow-inner scrollbar-thin space-y-6 ${
            step === 1 ? "lg:col-span-6 lg:order-2 lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto" : ""
          }`}
        >
          <div className="flex items-center justify-between border-b dark:border-white/5 pb-3">
            <span className="text-xs font-black text-gray-500 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              پیش‌نمایش زنده و واقعی (Live Preview)
            </span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2 py-1 rounded-full font-black">
              مطابق با فرانت اند اصلی
            </span>
          </div>

          <div className="w-full relative transition-all duration-500">
            
            {/* PREVIEW: STEP 1 (Focus on course card only) */}
            {step === 1 && (
              <div className="py-12 animate-in fade-in duration-500 flex flex-col items-center">
                <div className="text-center mb-6">
                  <span className="text-[10px] text-gray-400 font-bold block">موقعیت: نمایش در صفحه اصلی یا آرشیو دوره‌ها</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">کارت دوره شما (CourseCard)</span>
                </div>
                <CourseCard
                  title={formData.title}
                  instructor={profile?.name || "اصغر رضایی"}
                  instructorImg={profile?.avatar || "/images/inst1.jpg"}
                  image={formData.cover}
                  difficulty={formData.level === "elementary" ? "مقدماتی" : formData.level === "intermediate" ? "متوسط" : "پیشرفته"}
                  hours={formData.duration}
                  students={formData.studentsCount}
                  price={formData.isPaid === "free" ? "رایگان" : formData.price}
                />
              </div>
            )}

            {/* PREVIEW: STEP 2 (Focus on hero only) */}
            {step === 2 && (
              <div className="py-6 animate-in fade-in duration-500">
                <div className="text-center mb-4">
                  <span className="text-[10px] text-gray-400 font-bold block">موقعیت: هیرو بالای صفحه جزئیات دوره</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">هیرو سکشن اصلی (CourseHero)</span>
                </div>
                <CourseHero
                  title={formData.heroTitle}
                  category={formData.category}
                  level={formData.level}
                  duration={formData.duration}
                  rating={4.9}
                  shortDescription={formData.shortDescription}
                  coverImage={formData.cover}
                  introVideo={formData.introVideo}
                  specialWords={formData.specialWords}
                />
              </div>
            )}

            {/* PREVIEW: STEP 3 (Focus on details page layout) */}
            {step === 3 && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 font-bold block">موقعیت: بدنه اصلی صفحه جزئیات دوره (سازگار با موبایل/دسکتاپ)</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">سکشن‌های درونی و جزئیات</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Col (Sidebar equivalent) */}
                  <div className="lg:col-span-5 space-y-6 lg:order-2">
                    
                    {/* Price Card Sidebar */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/80 dark:border-gray-700 shadow-md relative overflow-hidden text-center">
                      <div className="absolute -top-10 -right-10 size-24 bg-primary/10 rounded-full blur-2xl" />
                      <div className="relative z-10 space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block">مبلغ نهایی ثبت نام</span>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-3xl font-black text-gray-900 dark:text-white">
                            {formData.isPaid === "free" ? "رایگان" : formData.price.toLocaleString("fa-IR")}
                          </span>
                          {formData.isPaid !== "free" && (
                            <span className="text-xs font-bold text-primary">تومان</span>
                          )}
                        </div>
                        <button className="w-full bg-primary text-background-dark py-3.5 rounded-2xl text-xs font-black transition-all hover:scale-[1.02] shadow-md shadow-primary/20 cursor-default select-none" onClick={e => e.preventDefault()}>
                          ثبت‌نام در دوره
                        </button>
                        <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified_user</span>
                          ضمانت طلایی بازگشت وجه تا ۳۰ روز
                        </p>
                      </div>
                    </div>

                    {/* Features Sidebar */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/60 dark:border-gray-700">
                      <h4 className="font-black text-gray-900 dark:text-white text-xs mb-4 px-2 border-r-4 border-primary rounded-r">
                        ویژگی‌های متمایز
                      </h4>
                      <ul className="space-y-3">
                        {formData.features.map((feat) => (
                          <li key={feat.id} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold text-[10px]">
                            <span className={`size-7 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-${feat.color === 'primary' ? 'primary' : feat.color} flex items-center justify-center shrink-0 border border-primary/20`}>
                              <span className="material-symbols-outlined text-sm">{feat.icon}</span>
                            </span>
                            {feat.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Right Col (Main Content equivalent) */}
                  <div className="lg:col-span-7 space-y-6 lg:order-1">
                    
                    {/* About Section */}
                    <section className="glass-panel rounded-[2rem] p-6 glass-card-hover">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900/30 to-white dark:to-gray-800 flex items-center justify-center text-primary shadow-sm border border-white/50 shrink-0">
                          <span className="material-symbols-outlined text-lg">description</span>
                        </div>
                        <h2 className="text-base font-black text-gray-900 dark:text-white">{formData.aboutTitle}</h2>
                      </div>
                      
                      <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                        <p className="mb-3 text-justify">{formData.aboutDescription}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {formData.aboutHighlights.map((item, idx) => (
                            <span key={idx} className="text-primary font-bold bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded text-[9px] inline-block">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* FAQ Section */}
                    <CourseFAQ
                      items={formData.faqs}
                    />

                  </div>

                </div>
              </div>
            )}

            {/* PREVIEW: STEP 4 (Complete page layout) */}
            {step === 4 && (
              <div className="py-6 animate-in fade-in duration-500">
                <div className="text-center mb-4">
                  <span className="text-[10px] text-gray-400 font-bold block">موقعیت: مدیریت جلسات و فایل‌های هر ویدیو</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">پنل سرفصل‌ها و ویدیوها</span>
                </div>
                <div className="rounded-2xl border border-dashed border-gray-200/80 dark:border-white/10 py-8 text-center text-[11px] font-bold text-gray-400 dark:text-gray-500">
                  مدیریت سرفصل‌ها در مرحله ۴ انجام می‌شود.
                </div>
              </div>
            )}

            {/* PREVIEW: STEP 5 (Complete page layout) */}
            {step === 5 && (
              <div className="animate-in fade-in duration-500 space-y-8 pb-10">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 font-bold block">بازبینی نهایی: نمایش صفحه کامل جزئیات دوره</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 block mt-1">کل صفحه واقعی دوره (Full Detail Page Preview)</span>
                </div>

                {/* 1. Hero */}
                <CourseHero
                  title={formData.heroTitle}
                  category={formData.category}
                  level={formData.level}
                  duration={formData.duration}
                  rating={4.9}
                  shortDescription={formData.shortDescription}
                  coverImage={formData.cover}
                  introVideo={formData.introVideo}
                  specialWords={formData.specialWords}
                />

                {/* 2. Grid body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (Sidebar) */}
                  <div className="lg:col-span-5 space-y-6 lg:order-2">
                    
                    {/* Sidebar price */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/80 dark:border-gray-700 shadow-md text-center">
                      <div className="relative z-10 space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block">مبلغ نهایی ثبت نام</span>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-3xl font-black text-gray-900 dark:text-white">
                            {formData.isPaid === "free" ? "رایگان" : formData.price.toLocaleString("fa-IR")}
                          </span>
                          {formData.isPaid !== "free" && (
                            <span className="text-xs font-bold text-primary">تومان</span>
                          )}
                        </div>
                        <button className="w-full bg-primary text-background-dark py-3.5 rounded-2xl text-xs font-black transition-all hover:scale-[1.02] shadow-md shadow-primary/20 cursor-default select-none" onClick={e => e.preventDefault()}>
                          ثبت‌نام در دوره
                        </button>
                        <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified_user</span>
                          ضمانت طلایی بازگشت وجه تا ۳۰ روز
                        </p>
                      </div>
                    </div>

                    {/* Sidebar Features */}
                    <div className="glass-panel rounded-[2rem] p-6 border border-white/60 dark:border-gray-700">
                      <h4 className="font-black text-gray-900 dark:text-white text-xs mb-4 px-2 border-r-4 border-primary rounded-r">
                        ویژگی‌های متمایز
                      </h4>
                      <ul className="space-y-3">
                        {formData.features.map((feat) => (
                          <li key={feat.id} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold text-[10px]">
                            <span className={`size-7 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-${feat.color === 'primary' ? 'primary' : feat.color} flex items-center justify-center shrink-0 border border-primary/20`}>
                              <span className="material-symbols-outlined text-sm">{feat.icon}</span>
                            </span>
                            {feat.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Right Column (Body content) */}
                  <div className="lg:col-span-7 space-y-6 lg:order-1">
                    
                    {/* About Section */}
                    <section className="glass-panel rounded-[2rem] p-6 glass-card-hover">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-100 dark:from-emerald-900/30 to-white dark:to-gray-800 flex items-center justify-center text-primary shadow-sm border border-white/50 shrink-0">
                          <span className="material-symbols-outlined text-lg">description</span>
                        </div>
                        <h2 className="text-base font-black text-gray-900 dark:text-white">{formData.aboutTitle}</h2>
                      </div>
                      
                      <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                        <p className="mb-3 text-justify">{formData.aboutDescription}</p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {formData.aboutHighlights.map((item, idx) => (
                            <span key={idx} className="text-primary font-bold bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded text-[9px] inline-block">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* FAQ accordion */}
                    <CourseFAQ
                      items={formData.faqs}
                    />

                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {deleteConfirm.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={closeDeleteConfirm} />
          <div className="relative w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6">
            <h3 className="text-base font-black text-gray-900 dark:text-white">{deleteConfirm.title}</h3>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
              {deleteConfirm.description}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConfirm.onConfirm?.();
                  closeDeleteConfirm();
                }}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}

      {lessonDescriptionEditor.open && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setLessonDescriptionEditor({ open: false, lessonId: "", value: "" })}
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6">
            <h3 className="text-base font-black text-gray-900 dark:text-white">توضیحات جلسه</h3>
            <textarea
              rows={5}
              value={lessonDescriptionEditor.value}
              onChange={(e) => setLessonDescriptionEditor((p) => ({ ...p, value: e.target.value }))}
              placeholder="توضیحاتی درباره این جلسه برای دانشجو بنویسید..."
              className="mt-4 w-full px-4 py-3 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-medium text-right focus:outline-none focus:border-primary"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLessonDescriptionEditor({ open: false, lessonId: "", value: "" })}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  setLessonDescriptionMap((prev) => ({
                    ...prev,
                    [lessonDescriptionEditor.lessonId]: lessonDescriptionEditor.value.trim(),
                  }));
                  setLessonDescriptionEditor({ open: false, lessonId: "", value: "" });
                }}
                className="px-4 py-2.5 rounded-xl bg-primary text-background-dark font-black text-sm"
              >
                ذخیره توضیحات
              </button>
            </div>
          </div>
        </div>
      )}

      {lessonFilesModal.open && (
        <div className="fixed inset-0 z-[126] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setLessonFilesModal({ open: false, lessonId: "" })}
          />
          <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1e26] shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 dark:text-white">مدیریت فایل‌های جلسه</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  تعداد فایل‌ها: {lessonFileMap[lessonFilesModal.lessonId]?.length || 0}
                </span>
                <button
                  type="button"
                  onClick={() => setLessonFilesModal({ open: false, lessonId: "" })}
                  className="size-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-gray-200 transition-all cursor-pointer"
                  aria-label="بستن پنجره مدیریت فایل‌ها"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <label className={`h-10 px-3 inline-flex items-center justify-center rounded-xl border text-sm font-black transition-all ${
                (lessonFileMap[lessonFilesModal.lessonId]?.length || 0) >= MAX_LESSON_FILES
                  ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed pointer-events-none"
                  : "border-amber-300/80 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/20"
              }`}>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleLessonFileUpload(lessonFilesModal.lessonId, e.target.files);
                    e.currentTarget.value = "";
                  }}
                />
                افزودن فایل
              </label>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                حداکثر {MAX_LESSON_FILES} فایل
              </span>
            </div>

            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {(lessonFileMap[lessonFilesModal.lessonId] || []).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">هنوز فایلی برای این جلسه آپلود نشده است.</p>
              ) : (
                (lessonFileMap[lessonFilesModal.lessonId] || []).map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-[60%]">{f.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(f.url, "_blank", "noopener,noreferrer")}
                        className="h-8 px-3 rounded-lg border border-emerald-300/70 dark:border-emerald-400/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-black cursor-pointer"
                      >
                        باز کردن
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openDeleteConfirm("حذف فایل جلسه", "آیا از حذف این فایل مطمئن هستید؟", () =>
                            removeLessonFile(lessonFilesModal.lessonId, f.id)
                          )
                        }
                        className="size-8 inline-flex items-center justify-center rounded-lg border border-red-200/80 dark:border-red-400/20 bg-red-50 dark:bg-red-500/10 text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
