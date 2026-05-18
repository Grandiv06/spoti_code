"use client";

import React, { useState } from "react";
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
  FileText,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { useInstructorData } from "@/context/InstructorDataContext";

export default function CreateCourseWizardPage() {
  const router = useRouter();
  const { addCourse } = useInstructorData();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Frontend",
    level: "intermediate",
    language: "فارسی",
    shortDescription: "",
    description: "",
    price: 0,
    discountPrice: 0,
    isPaid: "paid", // free or paid
    hasDiscount: false,
    discountStartDate: "",
    discountEndDate: "",
    cover: "",
    introVideo: "",
    introText: "",
    objectives: [] as string[],
    prerequisites: [] as string[],
    targetAudience: [] as string[],
  });

  // Dynamic state for adding list items
  const [newObj, setNewObj] = useState("");
  const [newPrereq, setNewPrereq] = useState("");
  const [newAudience, setNewAudience] = useState("");

  // Simulated upload progress states
  const [coverProgress, setCoverProgress] = useState(0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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

  // Mock File Uploads
  const handleCoverUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverProgress(10);
      const interval = setInterval(() => {
        setCoverProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // set standard mock cover image
            setFormData((prevData) => ({
              ...prevData,
              cover: "https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=600&auto=format&fit=crop",
            }));
            return 100;
          }
          return prev + 15;
        });
      }, 100);
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
              introVideo: "/videos/intro.mp4",
            }));
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
  };

  // List updates
  const addItem = (type: "obj" | "pre" | "aud") => {
    if (type === "obj" && newObj.trim()) {
      setFormData((p) => ({ ...p, objectives: [...p.objectives, newObj.trim()] }));
      setNewObj("");
    } else if (type === "pre" && newPrereq.trim()) {
      setFormData((p) => ({ ...p, prerequisites: [...p.prerequisites, newPrereq.trim()] }));
      setNewPrereq("");
    } else if (type === "aud" && newAudience.trim()) {
      setFormData((p) => ({ ...p, targetAudience: [...p.targetAudience, newAudience.trim()] }));
      setNewAudience("");
    }
  };

  const removeItem = (type: "obj" | "pre" | "aud", index: number) => {
    if (type === "obj") {
      setFormData((p) => ({ ...p, objectives: p.objectives.filter((_, i) => i !== index) }));
    } else if (type === "pre") {
      setFormData((p) => ({ ...p, prerequisites: p.prerequisites.filter((_, i) => i !== index) }));
    } else if (type === "aud") {
      setFormData((p) => ({ ...p, targetAudience: p.targetAudience.filter((_, i) => i !== index) }));
    }
  };

  // Submit operations
  const handleSubmit = (publishStatus: "published" | "draft" | "pending") => {
    const preparedCourse = {
      ...formData,
      status: publishStatus,
      category: formData.category as any,
      level: formData.level as any,
      price: formData.isPaid === "free" ? 0 : Number(formData.price),
      discountPrice: formData.hasDiscount ? Number(formData.discountPrice) : undefined,
    };
    addCourse(preparedCourse);
    router.push("/instructor/courses");
  };

  return (
    <div className="max-w-[1000px] mx-auto pb-20 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* 1. Header Banner */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="relative z-10 px-8 py-8 md:px-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white mb-1">ایجاد دوره آموزشی جدید</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
              در طی ۴ مرحله اطلاعات، قیمت، فایل معرفی و اهداف دوره خود را وارد کنید.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Step Indicator (Wizard Stepper) */}
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md rounded-[2rem] p-6 mb-8">
        <div className="relative flex items-center justify-between">
          {/* Connector Line behind steps */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-gray-100 dark:bg-white/5 z-0" />
          
          {[
            { stepNum: 1, label: "اطلاعات پایه" },
            { stepNum: 2, label: "قیمت و فروش" },
            { stepNum: 3, label: "رسانه و معرفی" },
            { stepNum: 4, label: "بررسی نهایی" },
          ].map((item) => (
            <button
              key={item.stepNum}
              onClick={() => step > item.stepNum && setStep(item.stepNum)}
              disabled={step < item.stepNum}
              className="relative z-10 flex flex-col items-center gap-2 cursor-pointer focus:outline-none disabled:cursor-not-allowed group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-300 ${
                  step === item.stepNum
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                    : step > item.stepNum
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600"
                }`}
              >
                {step > item.stepNum ? <Check className="w-4 h-4" /> : item.stepNum}
              </div>
              <span
                className={`text-[9px] font-black transition-colors duration-300 ${
                  step === item.stepNum
                    ? "text-primary font-black"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Steps Content Form Container */}
      <div className="bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md rounded-[2.5rem] p-6 md:p-10 mb-8">
        
        {/* --- STEP 1: BASIC INFO --- */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
              مرحله اول: اطلاعات پایه دوره
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Course Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان دوره</label>
                <input
                  type="text"
                  placeholder="مثال: متخصص React و Next.js"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                />
              </div>

              {/* Course Slug */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">اسلاگ (Slug) دوره</label>
                <input
                  type="text"
                  placeholder="react-nextjs-pro"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">دسته‌بندی اصلی</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value as any }))}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right cursor-pointer"
                >
                  <option value="Frontend">Frontend (فرانت‌اند)</option>
                  <option value="Backend">Backend (بک‌اند)</option>
                  <option value="DevOps">DevOps (دواپس)</option>
                  <option value="Mobile">Mobile (موبایل)</option>
                  <option value="UI/UX">UI/UX (رابط کاربری)</option>
                </select>
              </div>

              {/* Level */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">سطح آموزشی دوره</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData((p) => ({ ...p, level: e.target.value as any }))}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right cursor-pointer"
                >
                  <option value="elementary">مقدماتی</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">پیشرفته</option>
                </select>
              </div>

              {/* Language */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">زبان تدریس دوره</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData((p) => ({ ...p, language: e.target.value }))}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                />
              </div>

            </div>

            {/* Short Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیح کوتاه (نمایش در کارت‌ها)</label>
              <textarea
                rows={2}
                placeholder="توضیح کوتاهی درباره دوره در حد ۲ خط..."
                value={formData.shortDescription}
                onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
              />
            </div>

            {/* Full Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیحات کامل دوره</label>
              <textarea
                rows={6}
                placeholder="سرفصل‌ها، مزایای دوره، جزئیات و ساختار پروژه پایانی..."
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* --- STEP 2: PRICING & SALES --- */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
              مرحله دوم: قیمت‌گذاری و تنظیمات فروش
            </h2>

            {/* Pricing Mode */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 font-black">وضعیت قیمت دوره</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, isPaid: "free" }))}
                  className={`p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.isPaid === "free"
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-gray-50 dark:bg-white/5 border-gray-200/60 dark:border-white/5 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  رایگان
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, isPaid: "paid" }))}
                  className={`p-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.isPaid === "paid"
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-gray-50 dark:bg-white/5 border-gray-200/60 dark:border-white/5 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  نقدی (پولی)
                </button>
              </div>
            </div>

            {formData.isPaid === "paid" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Original Price */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">قیمت دوره (به تومان)</label>
                    <input
                      type="number"
                      placeholder="۴۵۰۰۰۰۰"
                      value={formData.price || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                      className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Discount Active Switch */}
                  <div className="flex flex-col justify-end gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.hasDiscount}
                        onChange={(e) => setFormData((p) => ({ ...p, hasDiscount: e.target.checked }))}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">اعمال تخفیف روی دوره</span>
                    </label>
                  </div>

                </div>

                {formData.hasDiscount && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 animate-in slide-in-from-top-4 duration-300">
                    
                    {/* Discounted Price */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-primary">قیمت با تخفیف (تومان)</label>
                      <input
                        type="number"
                        placeholder="۳۲۰۰۰۰۰"
                        value={formData.discountPrice || ""}
                        onChange={(e) => setFormData((p) => ({ ...p, discountPrice: Number(e.target.value) }))}
                        className="px-4 py-3 bg-white dark:bg-white/5 border border-primary/20 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                        dir="ltr"
                      />
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">تاریخ شروع تخفیف</label>
                      <input
                        type="date"
                        value={formData.discountStartDate}
                        onChange={(e) => setFormData((p) => ({ ...p, discountStartDate: e.target.value }))}
                        className="px-4 py-3 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                        dir="ltr"
                      />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">تاریخ پایان تخفیف</label>
                      <input
                        type="date"
                        value={formData.discountEndDate}
                        onChange={(e) => setFormData((p) => ({ ...p, discountEndDate: e.target.value }))}
                        className="px-4 py-3 bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                        dir="ltr"
                      />
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- STEP 3: MEDIA & INTRO --- */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
              مرحله سوم: رسانه‌ها و بخش معرفی دوره
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Cover Image Upload (Mock) */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">تصویر کاور دوره</label>
                <div className="relative border-2 border-dashed border-gray-200/60 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 min-h-[180px] text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUploadSimulate}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {coverProgress === 0 ? (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 mb-1">
                        انتخاب یا رها کردن تصویر کاور
                      </p>
                      <p className="text-[8px] text-gray-400">PNG, JPG حداکثر ۵ مگابایت (اندازه 16:9)</p>
                    </>
                  ) : coverProgress < 100 ? (
                    <div className="w-full space-y-2 px-4 z-20">
                      <FileImage className="w-8 h-8 text-primary mx-auto" />
                      <div className="flex justify-between text-[8px] text-gray-400">
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
                      <p className="text-[8px] text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
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
                        className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Intro Video Upload (Mock) */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">ویدیوی معرفی دوره</label>
                <div className="relative border-2 border-dashed border-gray-200/60 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 min-h-[180px] text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUploadSimulate}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {videoProgress === 0 ? (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 mb-1">
                        انتخاب یا رها کردن ویدیوی پیش‌نمایش
                      </p>
                      <p className="text-[8px] text-gray-400">MP4, MKV حداکثر ۵۰ مگابایت</p>
                    </>
                  ) : videoProgress < 100 ? (
                    <div className="w-full space-y-2 px-4 z-20">
                      <Video className="w-8 h-8 text-primary mx-auto" />
                      <div className="flex justify-between text-[8px] text-gray-400">
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
                      <p className="text-[8px] text-emerald-500 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
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
                        className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Intro Text */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">متن خوش‌آمدگویی یا شعار معرفی دوره</label>
              <input
                type="text"
                placeholder="مثال: به دنیای توسعه وب پیشرفته با مسترکلاس Next.js خوش آمدید..."
                value={formData.introText}
                onChange={(e) => setFormData((p) => ({ ...p, introText: e.target.value }))}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
              />
            </div>

            {/* Objectives, Prerequisites, Target Audience lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              
              {/* Objectives List */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">اهداف دوره</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: یادگیری Server Actions"
                    value={newObj}
                    onChange={(e) => setNewObj(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                  />
                  <button
                    type="button"
                    onClick={() => addItem("obj")}
                    className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                  {formData.objectives.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[9px] font-bold">
                      <span className="truncate flex-1 text-right">{item}</span>
                      <button type="button" onClick={() => removeItem("obj", idx)} className="text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites List */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">پیش‌نیازها</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: تسلط بر React"
                    value={newPrereq}
                    onChange={(e) => setNewPrereq(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                  />
                  <button
                    type="button"
                    onClick={() => addItem("pre")}
                    className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                  {formData.prerequisites.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[9px] font-bold">
                      <span className="truncate flex-1 text-right">{item}</span>
                      <button type="button" onClick={() => removeItem("pre", idx)} className="text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience List */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">این دوره برای چه کسانی مناسب است؟</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: برنامه‌نویسان فرانت‌اند"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl text-[10px] font-bold focus:border-primary focus:outline-none transition-all text-right"
                  />
                  <button
                    type="button"
                    onClick={() => addItem("aud")}
                    className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                  {formData.targetAudience.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[9px] font-bold">
                      <span className="truncate flex-1 text-right">{item}</span>
                      <button type="button" onClick={() => removeItem("aud", idx)} className="text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- STEP 4: FINAL REVIEW --- */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
              مرحله چهارم: بررسی نهایی اطلاعات دوره
            </h2>

            <div className="rounded-3xl border border-gray-100 dark:border-white/5 p-6 bg-gray-50/50 dark:bg-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 text-right">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white mb-2">{formData.title || "عنوان وارد نشده"}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-4">
                    <span>دسته‌بندی: {formData.category}</span>
                    <span>•</span>
                    <span>سطح: {formData.level}</span>
                    <span>•</span>
                    <span>زبان: {formData.language}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mb-2 leading-relaxed">
                    <strong>توضیح کوتاه: </strong>
                    {formData.shortDescription || "وارد نشده"}
                  </p>
                </div>
                
                {formData.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.cover}
                    alt=""
                    className="w-full sm:w-40 h-24 object-cover rounded-xl border border-gray-200 dark:border-white/10"
                  />
                )}
              </div>

              {/* Pricing detail */}
              <div className="border-t border-gray-200/50 dark:border-white/5 pt-4 flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">مبلغ نهایی دوره:</span>
                <span className="text-primary font-black">
                  {formData.isPaid === "free"
                    ? "رایگان"
                    : formData.hasDiscount
                    ? `${formData.discountPrice?.toLocaleString("fa-IR")} تومان (با تخفیف)`
                    : `${formData.price?.toLocaleString("fa-IR")} تومان`}
                </span>
              </div>

              {/* Objectives summary */}
              <div className="border-t border-gray-200/50 dark:border-white/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-black text-gray-900 dark:text-white mb-2">اهداف دوره:</h4>
                  {formData.objectives.length === 0 ? (
                    <p className="text-[9px] text-gray-400">ثبت نشده است.</p>
                  ) : (
                    <ul className="list-disc list-inside text-[9px] text-gray-500 space-y-1">
                      {formData.objectives.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-900 dark:text-white mb-2">پیش‌نیازها:</h4>
                  {formData.prerequisites.length === 0 ? (
                    <p className="text-[9px] text-gray-400">ثبت نشده است.</p>
                  ) : (
                    <ul className="list-disc list-inside text-[9px] text-gray-500 space-y-1">
                      {formData.prerequisites.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-700 dark:text-amber-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black">تذکر برای انتشار دوره</p>
                <p className="text-[10px] font-semibold leading-relaxed">
                  با کلیک بر روی «ارسال برای بررسی»، دوره شما توسط کارشناسان بررسی شده و در صورت تایید منتشر خواهد شد. شما همچنین می‌توانید دوره را به صورت «پیش‌نویس» ذخیره کرده و سرفصل‌ها را تکمیل کنید.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 4. Action buttons at the bottom of the Wizard */}
      <div className="flex justify-between items-center">
        
        {/* Back Button */}
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>مرحله قبلی</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/instructor/courses")}
            className="flex items-center gap-1.5 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>انصراف و بازگشت</span>
          </button>
        )}

        {/* Next / Submit buttons */}
        {step < 4 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 1 && !formData.title.trim()) {
                alert("لطفاً عنوان دوره را وارد کنید.");
                return;
              }
              setStep((s) => s + 1);
            }}
            className="flex items-center gap-1.5 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer"
          >
            <span>مرحله بعدی</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="px-5 py-3.5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl hover:border-primary transition-all cursor-pointer"
            >
              ذخیره به عنوان پیش‌نویس
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("pending")}
              className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02] cursor-pointer"
            >
              ارسال برای بررسی و انتشار
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
