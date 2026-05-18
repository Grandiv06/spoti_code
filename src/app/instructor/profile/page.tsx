"use client";

import React, { useState, useEffect } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Linkedin,
  Github,
  Send,
  Globe,
  Camera,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { useInstructorData, InstructorProfile } from "@/context/InstructorDataContext";

export default function InstructorProfilePage() {
  const { profile, updateProfile } = useInstructorData();

  // Form State
  const [formData, setFormData] = useState<InstructorProfile>({
    name: "",
    displayName: "",
    specialty: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
    socials: {
      linkedin: "",
      github: "",
      telegram: "",
      website: "",
    },
  });

  // Simulated image upload state
  const [avatarProgress, setAvatarProgress] = useState(0);

  // Sync state with context on mount/load
  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        socials: {
          linkedin: profile.socials?.linkedin || "",
          github: profile.socials?.github || "",
          telegram: profile.socials?.telegram || "",
          website: profile.socials?.website || "",
        },
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [name]: value,
      },
    }));
  };

  // Mock Avatar Upload
  const handleAvatarChangeSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarProgress(10);
      const interval = setInterval(() => {
        setAvatarProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // set high-end mock avatar image
            setFormData((prevData) => ({
              ...prevData,
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
            }));
            return 100;
          }
          return prev + 30;
        });
      }, 100);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="max-w-[1000px] mx-auto pb-20 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* 1. Header Banner */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 px-8 py-8 md:px-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <UserRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white mb-1 font-black">پروفایل کاربری مدرس</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
              مشخصات عمومی، تخصصی، بیوگرافی و آدرس شبکه‌های اجتماعی خود را بروزرسانی کنید.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Profile Customization Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Step-Block A: Avatar and base information */}
        <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8 space-y-6">
          <h3 className="text-xs font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">تصویر پروفایل و معرفی</h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Avatar Preview & File Input */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 dark:border-primary/40 bg-primary/5 flex items-center justify-center">
                {formData.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formData.avatar} alt="پروفایل" className="w-full h-full object-cover" />
                ) : (
                  <UserRound className="w-12 h-12 text-primary" />
                )}
              </div>
              
              {/* Overlay Upload Button */}
              <label className="absolute bottom-1 left-1 p-2 rounded-full bg-primary text-white hover:bg-primary-hover shadow-lg cursor-pointer transition-transform hover:scale-110">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChangeSimulate}
                  className="hidden"
                />
                <Camera className="w-4 h-4" />
              </label>

              {avatarProgress > 0 && avatarProgress < 100 && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center text-white text-[10px] font-black z-25">
                  {avatarProgress}٪
                </div>
              )}
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نام و نام خانوادگی</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                />
              </div>

              {/* Display Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">عنوان نمایشی (لقب)</label>
                <input
                  type="text"
                  required
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                />
              </div>

              {/* Specialty */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">تخصص / حوزه فعالیت اصلی</label>
                <input
                  type="text"
                  required
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Step-Block B: Professional Bio */}
        <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8 space-y-4">
          <h3 className="text-xs font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">درباره مدرس (بیوگرافی کامل)</h3>
          
          <div className="flex flex-col gap-2">
            <textarea
              name="bio"
              rows={5}
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="رزومه، سوابق کاری، دستاوردها و روش تدریس خود را در ۲ الی ۳ پاراگراف بنویسید..."
              className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-right leading-relaxed"
            />
          </div>
        </div>

        {/* Step-Block C: Contact Details */}
        <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8 space-y-6">
          <h3 className="text-xs font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">اطلاعات تماس</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 justify-end">
                <span>ایمیل رسمی</span>
                <Mail className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Mobile Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 justify-end">
                <span>شماره تماس</span>
                <Phone className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

          </div>
        </div>

        {/* Step-Block D: Social Profiles */}
        <div className="rounded-3xl bg-white dark:bg-[#1c1e26] border border-gray-100 dark:border-white/5 shadow-md p-6 md:p-8 space-y-6">
          <h3 className="text-xs font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">آدرس شبکه‌های اجتماعی</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* LinkedIn */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 justify-end">
                <span>پروفایل لینکدین</span>
                <Linkedin className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.socials?.linkedin}
                onChange={handleSocialChange}
                placeholder="linkedin.com/in/username"
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* GitHub */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 justify-end">
                <span>اکانت گیت‌هاب</span>
                <Github className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                name="github"
                value={formData.socials?.github}
                onChange={handleSocialChange}
                placeholder="github.com/username"
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Telegram */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 justify-end">
                <span>کانال یا اکانت تلگرام</span>
                <Send className="w-4 h-4 text-gray-400 -rotate-45" />
              </label>
              <input
                type="text"
                name="telegram"
                value={formData.socials?.telegram}
                onChange={handleSocialChange}
                placeholder="t.me/username"
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Portfolio Website */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 justify-end">
                <span>وب‌سایت شخصی (پورتفولیو)</span>
                <Globe className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                name="website"
                value={formData.socials?.website}
                onChange={handleSocialChange}
                placeholder="yoursite.com"
                className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-2xl text-xs font-bold focus:border-primary focus:outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3.5 bg-primary text-white text-xs font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            ذخیره تغییرات پروفایل
          </button>
        </div>

      </form>

    </div>
  );
}
