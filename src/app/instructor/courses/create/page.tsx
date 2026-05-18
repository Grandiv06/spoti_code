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
import CourseCurriculum from "@/app/components/CourseCurriculum";
import CourseFAQ from "@/app/components/CourseFAQ";
import CustomSelect from "@/components/ui/CustomSelect";

export default function CreateCourseWizardPage() {
  const router = useRouter();
  const { addCourse, profile } = useInstructorData();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});

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

  // Lesson actions
  const addOrUpdateLesson = () => {
    if (!lesTitle.trim() || !selectedChapIdForLesson) return;

    if (editingLesId) {
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.map(c => ({
          ...c,
          lessons: c.lessons.map(l => l.id === editingLesId ? { ...l, title: lesTitle, duration: lesDuration, type: lesType, access: lesAccess } : l)
        }))
      }));
      setEditingLesId(null);
    } else {
      const newLes = {
        id: `les-${Math.random().toString(36).substr(2, 9)}`,
        title: lesTitle,
        duration: lesDuration,
        type: lesType,
        access: lesAccess
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
      if (formData.chapters.length === 0) newErrors.chapters = "حداقل وارد کردن یک فصل آموزشی الزامی است.";
      
      if (formData.faqs.length === 0) {
        newWarnings.faqs = "توصیه می‌شود حداقل یک سوال متداول جهت راهنمایی دانشجویان اضافه کنید.";
      }
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
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

  // Convert chapters to CourseCurriculum chapters format
  const mappedChapters = formData.chapters.map(ch => ({
    id: ch.id,
    number: ch.number,
    title: ch.title,
    subtitle: ch.subtitle || "سرفصل درسی",
    lessons: ch.lessons.map(l => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      isLocked: l.access === "locked"
    }))
  }));

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
                width: step === 1 ? "0%" : step === 2 ? "33.33%" : step === 3 ? "66.67%" : "100%"
              }} 
            />
          </div>

          {[
            { stepNum: 1, label: "اطلاعات کارت دوره", desc: "تصویر، قیمت و مشخصات" },
            { stepNum: 2, label: "معرفی و هیرو دوره", desc: "ویدیو، شعار و کلمات ویژه" },
            { stepNum: 3, label: "جزئیات و محتوای دوره", desc: "سرفصل‌ها، سئو و سوالات" },
            { stepNum: 4, label: "بررسی نهایی", desc: "پیش‌نمایش کلی و انتشار" },
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

      {/* 3. Main Grid layout: Form (Right) / Preview (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        
        {/* --- RIGHT SIDE: FORM COMPONENT (7 cols on large screens) --- */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl rounded-[2.5rem] p-6 md:p-8 lg:p-10 min-h-[600px] flex flex-col justify-between">
          
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* STEP 1: INITIAL CARD DETAILS */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله اول: اطلاعات اولیه کارت دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    این اطلاعات در لیست دوره‌ها و کارت کوچک دوره نمایش داده می‌شود.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نام دوره <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="مثال: استایل‌دهی با CSS"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className={`px-4 py-3 bg-gray-50 dark:bg-white/5 border ${errors.title ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right`}
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
                      className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
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
                        className="w-full px-4 py-3 pl-14 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
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
                      type="number"
                      placeholder="۰"
                      value={formData.studentsCount || 0}
                      onChange={(e) => setFormData((p) => ({ ...p, studentsCount: Number(e.target.value) }))}
                      className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
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
                      onClick={() => setFormData((p) => ({ ...p, isPaid: "free" }))}
                      className={`p-4 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
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
                      className={`p-4 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
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
                        type="number"
                        placeholder="۱۴۵۰۰۰۰"
                        value={formData.price || ""}
                        onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                        className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border ${errors.price ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-2xl text-xs font-black focus:border-primary focus:outline-none transition-all text-left`}
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
                  <div className="relative border-2 border-dashed border-gray-200/60 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 min-h-[160px] text-center hover:border-primary/50 transition-colors">
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
              <div className="space-y-6">
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
                    className={`px-4 py-3 bg-gray-50 dark:bg-white/5 border ${errors.heroTitle ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right`}
                  />
                  {errors.heroTitle && <span className="text-[10px] text-red-500 font-bold">{errors.heroTitle}</span>}
                </div>

                {/* Title highlights (Special Words) */}
                <div className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-xs font-black text-gray-900 dark:text-white block">کلمات ویژه عنوان (Special Words)</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className={`px-4 py-3 bg-gray-50 dark:bg-white/5 border ${errors.shortDescription ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right leading-relaxed`}
                  />
                  {errors.shortDescription && <span className="text-[10px] text-red-500 font-bold">{errors.shortDescription}</span>}
                </div>

                {/* Intro Video Upload (Mock) */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">ویدیوی معرفی دوره</label>
                  <div className="relative border-2 border-dashed border-gray-200/60 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 min-h-[160px] text-center hover:border-primary/50 transition-colors">
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

            {/* STEP 3: COURSE DETAILS, CURRICULUM, FAQ & FEATURES */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    مرحله سوم: محتوای عمیق صفحه دوره
                  </h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-1">
                    در این مرحله سرفصل‌های آموزشی، ویژگی‌های متمایز، توضیحات درباره دوره و سوالات متداول را تعریف کنید.
                  </p>
                </div>

                {/* --- 3A. ABOUT SECTION --- */}
                <div className="p-4 bg-gray-50/30 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-xs font-black text-gray-900 dark:text-white block border-b dark:border-white/5 pb-2">۱. بخش درباره این دوره</span>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">توضیحات درباره دوره (پاراگراف‌ها) <span className="text-red-500">*</span></label>
                    <textarea
                      rows={5}
                      placeholder="متن کامل درباره دوره، اهداف و شبیه‌سازی بازار کار..."
                      value={formData.aboutDescription}
                      onChange={(e) => setFormData(p => ({ ...p, aboutDescription: e.target.value }))}
                      className={`px-4 py-3 bg-white dark:bg-[#1a1c23] border ${errors.aboutDescription ? "border-red-500" : "border-gray-200/60 dark:border-white/5"} rounded-2xl text-xs font-medium focus:border-primary focus:outline-none transition-all text-right leading-relaxed`}
                    />
                    {errors.aboutDescription && <span className="text-[10px] text-red-500 font-bold">{errors.aboutDescription}</span>}
                  </div>

                  {/* Highlights (badges inside text) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">عبارت‌های هایلایت شده داخل متن (Badge)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="مثال: طرز تفکر مهندسی"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-[#1a1c23] border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                      />
                      <button
                        type="button"
                        onClick={addHighlightItem}
                        className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formData.aboutHighlights.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg border border-emerald-500/20">
                          {item}
                          <button type="button" onClick={() => removeHighlightItem(item)}>
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- 3B. DISTINCTIVE FEATURES SECTION --- */}
                <div className="p-4 bg-gray-50/30 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-xs font-black text-gray-900 dark:text-white block border-b dark:border-white/5 pb-2">۲. ویژگی‌های متمایز دوره</span>
                  
                  {errors.features && <span className="text-[10px] text-red-500 font-bold block">{errors.features}</span>}
                  
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="عنوان ویژگی (مثال: پشتیبانی اختصاصی تلگرام)"
                        value={featTitle}
                        onChange={(e) => setFeatTitle(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-[#1a1c23] border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Icon options */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-gray-400">انتخاب آیکون</label>
                        <select
                          value={featIcon}
                          onChange={(e) => setFeatIcon(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-[#1a1c23] border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold text-right"
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
                        <label className="text-[9px] font-bold text-gray-400">رنگ آیکون</label>
                        <select
                          value={featColor}
                          onChange={(e) => setFeatColor(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-[#1a1c23] border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold text-right"
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

                  <div className="space-y-2 max-h-[200px] overflow-y-auto mt-3">
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
                          <button type="button" onClick={() => deleteFeature(feat.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- 3C. LESSONS & CHAPTER CURRICULUM EDITOR --- */}
                <div className="p-4 bg-gray-50/30 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-xs font-black text-gray-900 dark:text-white block border-b dark:border-white/5 pb-2">۳. سرفصل‌ها و جلسات درسی</span>
                  
                  {errors.chapters && <span className="text-[10px] text-red-500 font-bold block">{errors.chapters}</span>}
                  
                  {/* Part 1: Chapter Adder */}
                  <div className="p-3 bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                    <span className="text-[10px] font-black text-gray-900 dark:text-white block">افزودن/ویرایش فصل</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="عنوان فصل (مثال: عمیق شدن در Hooks)"
                        value={chapTitle}
                        onChange={(e) => setChapTitle(e.target.value)}
                        className="px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[9px] font-black focus:border-primary focus:outline-none transition-all text-right"
                      />
                      <input
                        type="text"
                        placeholder="توضیح کوتاه فصل (مثال: مدیریت حرفه‌ای وضعیت)"
                        value={chapSubtitle}
                        onChange={(e) => setChapSubtitle(e.target.value)}
                        className="px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[9px] font-black focus:border-primary focus:outline-none transition-all text-right"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addOrUpdateChapter}
                      className="w-full py-1.5 bg-primary hover:bg-primary-hover text-background-dark rounded-xl text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{editingChapId ? "به‌روزرسانی فصل" : "افزودن فصل"}</span>
                    </button>
                  </div>

                  {/* Part 2: Lesson Adder */}
                  {formData.chapters.length > 0 && (
                    <div className="p-3 bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                      <span className="text-[10px] font-black text-gray-900 dark:text-white block">افزودن/ویرایش جلسه درسی</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Select target Chapter */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-gray-400">انتخاب فصل هدف</label>
                          <select
                            value={selectedChapIdForLesson}
                            onChange={(e) => setSelectedChapIdForLesson(e.target.value)}
                            className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[9px] font-bold"
                          >
                            <option value="">-- انتخاب فصل --</option>
                            {formData.chapters.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </div>

                        {/* Lesson Title */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-gray-400">عنوان درس</label>
                          <input
                            type="text"
                            placeholder="مثال: هوک useEffect و چرخه حیات"
                            value={lesTitle}
                            onChange={(e) => setLesTitle(e.target.value)}
                            className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[9px] font-bold text-right"
                          />
                        </div>

                        {/* Duration */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-gray-400">مدت زمان درس</label>
                          <input
                            type="text"
                            placeholder="مثال: ۲۲:۳۰"
                            value={lesDuration}
                            onChange={(e) => setLesDuration(e.target.value)}
                            className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[9px] font-bold text-left"
                            dir="ltr"
                          />
                        </div>

                        {/* Access */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] text-gray-400">دسترسی جلسه</label>
                          <select
                            value={lesAccess}
                            onChange={(e) => setLesAccess(e.target.value)}
                            className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[9px] font-bold"
                          >
                            <option value="free">رایگان (نمایش به عمومی)</option>
                            <option value="locked">قفل شده (مخصوص دانشجویان)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={addOrUpdateLesson}
                        className="w-full py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{editingLesId ? "به‌روزرسانی جلسه" : "افزودن جلسه درسی"}</span>
                      </button>
                    </div>
                  )}

                  {/* Chapter List View inside Form */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto mt-3">
                    {formData.chapters.map((chap, chapIdx) => (
                      <div key={chap.id} className="p-3 bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                        <div className="flex items-center justify-between border-b dark:border-white/5 pb-2">
                          <div>
                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black mr-1">{chap.number}</span>
                            <span className="text-[10px] font-black text-gray-900 dark:text-white">{chap.title}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => moveChapter(chapIdx, "up")} disabled={chapIdx === 0} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded disabled:opacity-30">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => moveChapter(chapIdx, "down")} disabled={chapIdx === formData.chapters.length - 1} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded disabled:opacity-30">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => editChapter(chap)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-blue-500">
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button type="button" onClick={() => deleteChapter(chap.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Lessons inside chapter */}
                        <div className="space-y-1.5 pr-4 border-r border-gray-200 dark:border-white/5">
                          {chap.lessons.length === 0 ? (
                            <span className="text-[8px] text-gray-400 block font-bold">هیچ درسی به این فصل اضافه نشده است.</span>
                          ) : (
                            chap.lessons.map((les) => (
                              <div key={les.id} className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-[9px] font-bold">
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-xs text-primary">
                                    {les.access === "free" ? "play_circle" : "lock"}
                                  </span>
                                  <span>{les.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] opacity-75 font-mono">{les.duration}</span>
                                  <button type="button" onClick={() => editLesson(chap.id, les)} className="text-blue-500">
                                    <span className="material-symbols-outlined text-[12px]">edit</span>
                                  </button>
                                  <button type="button" onClick={() => deleteLesson(chap.id, les.id)} className="text-red-500">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- 3D. FAQ SECTION --- */}
                <div className="p-4 bg-gray-50/30 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                  <span className="text-xs font-black text-gray-900 dark:text-white block border-b dark:border-white/5 pb-2">۴. سوالات متداول</span>
                  
                  {warnings.faqs && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 rounded-xl text-[9px] font-bold flex items-center gap-1.5 leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{warnings.faqs}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="پرسش سوال (مثال: پشتیبانی دوره چگونه است؟)"
                      value={faqQ}
                      onChange={(e) => setFaqQ(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1c23] border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                    />
                    <textarea
                      rows={3}
                      placeholder="پاسخ سوال به طور دقیق..."
                      value={faqA}
                      onChange={(e) => setFaqA(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1a1c23] border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-medium focus:border-primary focus:outline-none transition-all text-right leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={addOrUpdateFAQ}
                      className="w-full py-2 bg-primary/15 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingFaqId ? "ویرایش و ذخیره سوال" : "افزودن سوال جدید"}</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto mt-3">
                    {formData.faqs.map((faq) => (
                      <div key={faq.id} className="p-2.5 rounded-xl bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-white/5 text-[9px] font-bold">
                        <div className="flex items-center justify-between border-b dark:border-white/5 pb-1 mb-1">
                          <span className="text-gray-900 dark:text-white truncate max-w-[80%]">{faq.question}</span>
                          <div className="flex gap-1.5 shrink-0">
                            <button type="button" onClick={() => editFAQ(faq)} className="p-1 hover:bg-gray-100 rounded text-blue-500">
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                            </button>
                            <button type="button" onClick={() => deleteFAQ(faq.id)} className="p-1 hover:bg-gray-100 rounded text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-semibold leading-relaxed line-clamp-2">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 4: FINAL SUBMISSION REVIEW */}
            {step === 4 && (
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
            {step < 4 ? (
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
        <div className="lg:col-span-6 lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-4 bg-gray-50/50 dark:bg-white/[0.02] backdrop-blur-md shadow-inner scrollbar-thin space-y-6">
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

                    {/* Curriculum Section */}
                    <CourseCurriculum
                      chapters={mappedChapters as any}
                      totalLessons={totalLessonsCount}
                    />

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

                    {/* Curriculum accordion */}
                    <CourseCurriculum
                      chapters={mappedChapters as any}
                      totalLessons={totalLessonsCount}
                    />

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

    </div>
  );
}
