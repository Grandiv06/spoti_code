import React, { useState } from "react";
import { Course, Chapter, CourseStudent, CourseReview } from "./types";
import { X, Check, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

interface CreateCourseWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (course: Course) => void;
}

export default function CreateCourseWizard({ isOpen, onClose, onAdd }: CreateCourseWizardProps) {
  const [step, setStep] = useState(1);
  
  // Step 1 States
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [instructor, setInstructor] = useState("");
  const [category, setCategory] = useState<"Frontend" | "Backend" | "DevOps" | "Mobile" | "UI/UX">("Frontend");
  const [level, setLevel] = useState<"مقدماتی" | "متوسط" | "پیشرفته">("متوسط");

  // Step 2 States
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<"منتشر شده" | "پیش‌نویس" | "در انتظار بررسی" | "غیرفعال">("پیش‌نویس");
  const [discount, setDiscount] = useState("");

  // Step 3 States
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [prereqs, setPrereqs] = useState("");
  const [chaptersInput, setChaptersInput] = useState("");
  const [duration, setDuration] = useState("20 ساعت");

  if (!isOpen) return null;

  // Handle step advancement
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Submit course creation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map Prerequisites
    const prereqList = prereqs
      ? prereqs.split(",").map((p) => p.trim()).filter(Boolean)
      : [];

    // Map Mock Chapters
    const chapterTitles = chaptersInput
      ? chaptersInput.split(",").map((c) => c.trim()).filter(Boolean)
      : ["فصل اول: مقدمات و تعاریف"];

    const mockChapters: Chapter[] = chapterTitles.map((chTitle, idx) => ({
      id: `CH-${idx + 1}`,
      title: chTitle,
      duration: "5 ساعت",
      lessons: [
        { id: `L-${idx + 1}-1`, title: "آشنایی با مفاهیم و سرفصل‌ها", duration: "15:00", isFree: true },
        { id: `L-${idx + 1}-2`, title: "پیاده‌سازی اولین پروژه عملی", duration: "45:00" },
      ],
    }));

    const mockStudents: CourseStudent[] = [
      { id: "USR-992", name: "نیما احمدی", purchaseDate: "1404/12/18", progress: 0, status: "فعال" }
    ];

    const mockReviews: CourseReview[] = [];

    const newCourse: Course = {
      id: code.trim() || `CRS-${Math.floor(Math.random() * 100) + 300}`,
      title: title.trim() || "دوره جدید آموزشی",
      instructor: instructor.trim() || "مدرس نمونه",
      category,
      students: 0,
      completion: 0,
      revenue: 0,
      status,
      price: Number(price),
      publishDate: "1404/12/18",
      updatedAt: "1404/12/18",
      shortDescription: shortDesc.trim() || "توضیح کوتاه ثبت نشده است.",
      description: fullDesc.trim() || "توضیحات جامع دوره ثبت نشده است.",
      level,
      duration: duration || "10 ساعت",
      tags: [category, level],
      prerequisites: prereqList,
      chapters: mockChapters,
      studentsList: mockStudents,
      reviews: mockReviews,
      refundRate: 0.0,
    };

    onAdd(newCourse);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setCode("");
    setInstructor("");
    setCategory("Frontend");
    setLevel("متوسط");
    setPrice(0);
    setStatus("پیش‌نویس");
    setDiscount("");
    setShortDesc("");
    setFullDesc("");
    setPrereqs("");
    setChaptersInput("");
    setDuration("20 ساعت");
  };

  const stepsInfo = [
    { num: 1, name: "اطلاعات پایه" },
    { num: 2, name: "قیمت و وضعیت" },
    { num: 3, name: "توضیحات و محتوا" },
    { num: 4, name: "بررسی نهایی" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">ایجاد دوره جدید</h3>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">افزودن دوره آموزشی جدید به پلتفرم</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-black/25 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicators */}
        <div className="relative z-10 px-8 py-5 bg-gray-50/50 dark:bg-black/10 border-b border-gray-100 dark:border-white/5 flex justify-between items-center select-none">
          {stepsInfo.map((s, idx) => (
            <React.Fragment key={s.num}>
              {/* Step circle */}
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border ${
                    step === s.num
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                      : step > s.num
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-white dark:bg-[#1c1e26] border-gray-200 dark:border-white/10 text-gray-400"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[9px] font-black ${step >= s.num ? "text-gray-800 dark:text-gray-200" : "text-gray-400"}`}>
                  {s.name}
                </span>
              </div>

              {/* Line connector */}
              {idx < stepsInfo.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-100 dark:bg-white/5 relative overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 h-full bg-primary transition-all duration-300"
                    style={{ width: step > s.num ? "100%" : "0%" }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">عنوان دوره *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: مسترکلاس Next.js پیشرفته"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">کد دوره (شناسه یکتا) *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="مثال: CRS-410"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">نام مدرس *</label>
                  <input
                    type="text"
                    required
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="مثال: سروش مشایخی"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">دسته‌بندی *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-700 dark:text-gray-300"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">سطح دوره *</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-700 dark:text-gray-300"
                  >
                    <option value="مقدماتی">مقدماتی</option>
                    <option value="متوسط">متوسط</option>
                    <option value="پیشرفته">پیشرفته</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PRICING & STATUS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">قیمت دوره (تومان) *</label>
                  <input
                    type="number"
                    required
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="مثال: 2900000 (0 برای رایگان)"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">وضعیت انتشار اولیه *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-700 dark:text-gray-300"
                  >
                    <option value="پیش‌نویس">پیش‌نویس (Draft)</option>
                    <option value="منتشر شده">منتشر شده (Published)</option>
                    <option value="در انتظار بررسی">در انتظار بررسی (Pending)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">تخفیف نمایشی (%)</label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="مثال: 20%"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">مدت زمان کل دوره</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="مثال: 32 ساعت"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTENT & DESCRIPTION */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">توضیح کوتاه (یک خط) *</label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="مثال: آموزش عمیق Next.js همراه با ساخت پروژه نهایی فروشگاه"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">توضیحات جامع دوره *</label>
                <textarea
                  rows={4}
                  required
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="سر فصل‌ها، اهداف دوره و هر نکته لازم دیگر را اینجا به طور کامل توضیح دهید..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200 leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">پیش‌نیازها (جدا شده با کاما ویرگول)</label>
                <input
                  type="text"
                  value={prereqs}
                  onChange={(e) => setPrereqs(e.target.value)}
                  placeholder="مثال: تسلط بر React.js , آشنایی با تایپ‌اسکریپت"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">سرفصل‌های اولیه دوره (جدا شده با کاما ویرگول)</label>
                <input
                  type="text"
                  value={chaptersInput}
                  onChange={(e) => setChaptersInput(e.target.value)}
                  placeholder="مثال: فصل اول: مبانی مقدماتی , فصل دوم: ابزارها و وب‌پک , فصل سوم: توسعه عملی"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          )}

          {/* STEP 4: FINAL REVIEW */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-gray-50 dark:bg-black/15 p-5 rounded-[1.5rem] border border-gray-100 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-black text-primary border-b border-primary/10 pb-2 mb-2">خلاصه اطلاعات دوره جدید</h4>
                
                <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                  <div className="flex gap-2">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">عنوان:</span>
                    <span className="font-black text-gray-800 dark:text-gray-200">{title || "ـ"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">کد دوره:</span>
                    <span className="font-black text-gray-800 dark:text-gray-200">{code || "ـ"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">مدرس:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{instructor || "ـ"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">دسته‌بندی:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{category} ({level})</span>
                  </div>
                  <div className="flex gap-2 col-span-2 border-t border-gray-100 dark:border-white/5 pt-2">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">قیمت:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {price > 0 ? `${price.toLocaleString("fa-IR")} تومان` : "رایگان"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">وضعیت انتشار:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{status}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">مدت زمان:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{duration}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 border-t border-gray-100 dark:border-white/5 pt-2">
                    <span className="text-gray-400 dark:text-gray-500 font-bold">توضیح کوتاه:</span>
                    <span className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{shortDesc || "ـ"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/10 p-3 rounded-2xl text-[10px] text-blue-500 leading-relaxed font-bold">
                <span>پس از تأیید، سرفصل‌ها و ساختار پایه ایجاد شده و دوره به عنوان {status} در دیتابیس ثبت می‌شود. می‌توانید در هر زمان اطلاعات دوره را مجدداً ویرایش کنید.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="relative z-10 px-8 py-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-black/10">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 dark:bg-[#1c1e26] dark:hover:bg-black/25 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-2xl border border-gray-100 dark:border-white/5 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>مرحله قبل</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-5 py-2.5 bg-transparent hover:bg-gray-100 dark:hover:bg-black/25 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-2xl transition-all"
            >
              انصراف
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={step === 1 && (!title || !code || !instructor)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-emerald-600 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/10"
              >
                <span>مرحله بعد</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-emerald-500/10"
              >
                <Check className="w-4 h-4" />
                <span>تأیید و ایجاد دوره</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
