import React, { useState, useEffect } from "react";
import { X, User as UserIcon, Phone, Mail, Shield, Sparkles, FileText, CheckCircle } from "lucide-react";
import { User } from "./types";

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export default function EditUserModal({
  user,
  isOpen,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"فعال" | "غیرفعال" | "معلق">("فعال");
  const [plan, setPlan] = useState<"Starter" | "Pro" | "Enterprise">("Starter");
  const [role, setRole] = useState<"کاربر عادی" | "ادمین" | "پشتیبان">("کاربر عادی");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setStatus(user.status);
      setPlan(user.plan);
      setRole(user.role);
      setInternalNotes(user.internalNotes || "");
      setSubscriptionEndDate("1405/12/29"); // Mock or default subscription end date
      setErrors({});
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "لطفاً نام کامل کاربر را وارد کنید.";
    }

    if (!phone.trim()) {
      newErrors.phone = "لطفاً شماره موبایل کاربر را وارد کنید.";
    } else if (!/^09\d{9}$/.test(phone.trim())) {
      newErrors.phone = "شماره موبایل نامعتبر است. باید ۱۱ رقم بوده و با ۰۹ شروع شود.";
    }

    if (!email.trim()) {
      newErrors.email = "لطفاً آدرس ایمیل کاربر را وارد کنید.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "آدرس ایمیل وارد شده نامعتبر است.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedUser: User = {
        ...user,
        name,
        phone,
        email,
        status,
        plan,
        role,
        internalNotes,
      };
      onSave(updatedUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto" dir="rtl">
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#12141a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-300 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-base font-black text-gray-900 dark:text-white">ویرایش اطلاعات کاربر ({user.name})</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">نام کامل</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-black/20 border ${
                    errors.name ? "border-red-500" : "border-gray-100 dark:border-white/5"
                  } rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500/50 transition-all`}
                  placeholder="مثال: سروش مشایخی"
                />
                <UserIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
            </div>

            {/* Mobile Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">شماره موبایل</label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-black/20 border ${
                    errors.phone ? "border-red-500" : "border-gray-100 dark:border-white/5"
                  } rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500/50 transition-all text-left`}
                  placeholder="09121111111"
                  dir="ltr"
                />
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">پست الکترونیک (ایمیل)</label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-black/20 border ${
                    errors.email ? "border-red-500" : "border-gray-100 dark:border-white/5"
                  } rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500/50 transition-all text-left`}
                  placeholder="example@gmail.com"
                  dir="ltr"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
            </div>

            {/* Subscription End Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">تاریخ پایان اشتراک (اختیاری)</label>
              <div className="relative">
                <input
                  type="text"
                  value={subscriptionEndDate}
                  onChange={(e) => setSubscriptionEndDate(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500/50 transition-all text-left"
                  placeholder="1405/12/29"
                  dir="ltr"
                />
                <Shield className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Status Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">وضعیت حساب</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500/50 transition-all cursor-pointer"
              >
                <option value="فعال">فعال</option>
                <option value="غیرفعال">غیرفعال</option>
                <option value="معلق">معلق</option>
              </select>
            </div>

            {/* Plan Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">پلن اشتراک</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500/50 transition-all cursor-pointer"
              >
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            {/* Role Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">نقش کاربر</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500/50 transition-all cursor-pointer"
              >
                <option value="کاربر عادی">کاربر عادی</option>
                <option value="ادمین">مدیر (ادمین)</option>
                <option value="پشتیبان">پشتیبان</option>
              </select>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">یادداشت داخلی ادمین</label>
            <div className="relative">
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full pl-4 pr-10 py-3 h-28 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-amber-500/50 transition-all resize-none leading-relaxed"
                placeholder="یادداشتی در مورد تخلفات، سوابق یا درخواست‌های خاص کاربر بنویسید..."
              />
              <FileText className="absolute right-3.5 top-4 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Hidden submit so Enter key works */}
          <button type="submit" className="hidden" />
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10 shrink-0">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            <span>ذخیره تغییرات</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all"
          >
            لغو
          </button>
        </div>

      </div>
    </div>
  );
}
