import React, { useState, useEffect } from "react";
import { Course } from "./types";
import { X, Check, Image as ImageIcon, Plus, Trash2 } from "lucide-react";

interface EditCourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
}

export default function EditCourseModal({ course, isOpen, onClose, onSave }: EditCourseModalProps) {
  // Form States
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [instructor, setInstructor] = useState("");
  const [category, setCategory] = useState<"Frontend" | "Backend" | "DevOps" | "Mobile" | "UI/UX">("Frontend");
  const [level, setLevel] = useState<"مقدماتی" | "متوسط" | "پیشرفته">("متوسط");
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<"منتشر شده" | "پیش‌نویس" | "در انتظار بررسی" | "غیرفعال">("پیش‌نویس");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [duration, setDuration] = useState("");
  const [prereqInput, setPrereqInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Sync state with course props when opened
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setCode(course.id);
      setInstructor(course.instructor);
      setCategory(course.category);
      setLevel(course.level);
      setPrice(course.price);
      setStatus(course.status);
      setShortDesc(course.shortDescription);
      setFullDesc(course.description);
      setDuration(course.duration);
      setPrereqInput(course.prerequisites.join(" , "));
      setTagInput(course.tags.join(" , "));
    }
  }, [course, isOpen]);

  if (!isOpen || !course) return null;

  // Handle Save Trigger
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPrereqs = prereqInput
      ? prereqInput.split(",").map((p) => p.trim()).filter(Boolean)
      : [];

    const updatedTags = tagInput
      ? tagInput.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const updatedCourse: Course = {
      ...course,
      id: code,
      title,
      instructor,
      category,
      level,
      price: Number(price),
      status,
      shortDescription: shortDesc,
      description: fullDesc,
      duration,
      prerequisites: updatedPrereqs,
      tags: updatedTags,
      updatedAt: "1404/12/18", // Simulated today's date
    };

    onSave(updatedCourse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" dir="rtl">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ImageIcon className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">ویرایش مشخصات دوره</h3>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">{course.title} ({course.id})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-black/25 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          
          {/* Section 1: Basic Specifications */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-primary border-b border-gray-100 dark:border-white/5 pb-1.5 mb-3">مشخصات عمومی</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">عنوان دوره *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">کد دوره *</label>
                <input
                  type="text"
                  required
                  disabled
                  value={code}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-black/45 border border-gray-100 dark:border-white/5 text-xs font-bold rounded-2xl outline-none text-gray-400 dark:text-gray-500 cursor-not-allowed select-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">مدرس دوره *</label>
                <input
                  type="text"
                  required
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
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

          {/* Section 2: Financial and Release Status */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-primary border-b border-gray-100 dark:border-white/5 pb-1.5 mb-3">مالی و وضعیت انتشار</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">قیمت (تومان) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">وضعیت دوره *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-700 dark:text-gray-300"
                >
                  <option value="منتشر شده">منتشر شده</option>
                  <option value="پیش‌نویس">پیش‌نویس</option>
                  <option value="در انتظار بررسی">در انتظار بررسی</option>
                  <option value="غیرفعال">غیرفعال</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">مدت زمان دوره *</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Content Details */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-primary border-b border-gray-100 dark:border-white/5 pb-1.5 mb-3">محتوا و جزئیات سئو</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">توضیح کوتاه (یک خط) *</label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">توضیحات کامل دوره *</label>
                <textarea
                  rows={4}
                  required
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200 leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">پیش‌نیازها (جدا شده با کاما ویرگول)</label>
                  <input
                    type="text"
                    value={prereqInput}
                    onChange={(e) => setPrereqInput(e.target.value)}
                    placeholder="پیش‌نیاز 1 , پیش‌نیاز 2"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">برچسب‌ها / تگ‌ها (جدا شده با کاما ویرگول)</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="React , Next.js , Tailwind"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 focus:border-primary/50 text-xs font-bold rounded-2xl outline-none transition-all text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              {/* Cover Image UI */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-500 dark:text-gray-400">تصویر کاور دوره (نمایشی)</label>
                <div className="flex items-center gap-4 p-4 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-black/20 select-none">
                  <div className="w-16 h-12 bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/5 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 block mb-0.5">آپلود مجدد تصویر کاور</span>
                    <span className="text-[9px] text-gray-400 block">فایل‌های مجاز: PNG, JPG (حداکثر حجم ۲ مگابایت)</span>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-200 dark:border-white/10 text-[10px] font-black text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-black/30 transition-all shrink-0"
                  >
                    تغییر عکس
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>

        {/* Modal Footer Controls */}
        <div className="relative z-10 px-8 py-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-black/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-transparent hover:bg-gray-100 dark:hover:bg-black/25 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-2xl transition-all"
          >
            انصراف
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/10"
          >
            <Check className="w-4 h-4" />
            <span>ذخیره تغییرات</span>
          </button>
        </div>
      </div>
    </div>
  );
}
