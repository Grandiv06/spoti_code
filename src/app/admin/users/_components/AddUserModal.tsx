import React, { useState } from "react";
import { X, User as UserIcon, Phone, Mail, Shield, Key, FileText, CheckCircle2 } from "lucide-react";
import { User } from "./types";
import { APPLICATION_MAIN_ROLE_OPTIONS, ApplicationMainRoles, type ApplicationMainRole } from "@/lib/application-roles";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newUser: User) => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
}: AddUserModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sendActivationLink, setSendActivationLink] = useState(false);
  const [plan, setPlan] = useState<"Starter" | "Pro" | "Enterprise">("Starter");
  const [status, setStatus] = useState<"فعال" | "غیرفعال">("فعال");
  const [role, setRole] = useState<ApplicationMainRole>(ApplicationMainRoles.USER);
  const [internalNotes, setInternalNotes] = useState("");
  const [sendWelcomeSms, setSendWelcomeSms] = useState(true);

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

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

    if (!sendActivationLink && !password.trim()) {
      newErrors.password = "لطفاً رمز عبور اولیه را وارد کنید یا گزینه ارسال لینک فعالسازی را انتخاب کنید.";
    } else if (!sendActivationLink && password.length < 6) {
      newErrors.password = "رمز عبور اولیه باید حداقل ۶ کاراکتر باشد.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Pick a random avatar gradient
      const gradients = [
        "from-emerald-400 to-teal-600",
        "from-blue-400 to-indigo-600",
        "from-purple-400 to-pink-600",
        "from-amber-400 to-orange-600",
        "from-cyan-400 to-blue-600",
        "from-rose-400 to-red-600",
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

      const newUser: User = {
        id: "", // Will be assigned by parent page state to ensure uniqueness
        name,
        phone,
        email,
        plan,
        status,
        role,
        joinedAt: "1405/02/27", // Today's Persian date (Gregorian May 17, 2026)
        courses: 0,
        ltv: 0,
        avatarColor: randomGradient,
        lastLogin: "تاکنون وارد نشده",
        purchasesCount: 0,
        successfulTransactionsCount: 0,
        supportTicketsCount: 0,
        lastCourseViewed: "هیچ",
        internalNotes: internalNotes.trim() ? internalNotes : undefined,
        purchasedCourses: [],
        recentTransactions: [],
        recentTickets: [],
      };

      onAdd(newUser);
      
      // Reset form fields
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setSendActivationLink(false);
      setPlan("Starter");
      setStatus("فعال");
      setRole(ApplicationMainRoles.USER);
      setInternalNotes("");
      setSendWelcomeSms(true);
      setErrors({});
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
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h2 className="text-base font-black text-gray-900 dark:text-white">افزودن کاربر جدید به پلتفرم</h2>
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
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">نام کامل کاربر</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-black/20 border ${
                    errors.name ? "border-red-500" : "border-gray-100 dark:border-white/5"
                  } rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary/50 transition-all`}
                  placeholder="مثال: آرمان ابراهیمی"
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
                  } rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary/50 transition-all text-left`}
                  placeholder="09126666666"
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
                  } rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary/50 transition-all text-left`}
                  placeholder="arman@gmail.com"
                  dir="ltr"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">رمز عبور اولیه</label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendActivationLink}
                    onChange={(e) => {
                      setSendActivationLink(e.target.checked);
                      if (e.target.checked) setPassword("");
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">ارسال لینک فعالسازی</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={sendActivationLink}
                  className={`w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-black/20 border ${
                    errors.password ? "border-red-500" : "border-gray-100 dark:border-white/5"
                  } ${
                    sendActivationLink ? "opacity-50 cursor-not-allowed select-none" : ""
                  } rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary/50 transition-all text-left`}
                  placeholder={sendActivationLink ? "لینک فعالسازی ارسال خواهد شد" : "••••••"}
                  dir="ltr"
                />
                <Key className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Plan Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">پلن اولیه کاربر</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
              >
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">وضعیت اولیه حساب</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
              >
                <option value="فعال">فعال</option>
                <option value="غیرفعال">غیرفعال</option>
              </select>
            </div>

            {/* Role Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">نقش سیستم</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as ApplicationMainRole)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
              >
                {APPLICATION_MAIN_ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">یادداشت داخلی</label>
            <div className="relative">
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full pl-4 pr-10 py-3 h-24 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-primary/50 transition-all resize-none leading-relaxed"
                placeholder="توضیحات یا یادداشتی برای استفاده داخلی مدیران..."
              />
              <FileText className="absolute right-3.5 top-4 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Welcome Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendWelcomeSms}
                onChange={(e) => setSendWelcomeSms(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
              />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                ارسال پیام خوشآمدگویی و فعالسازی برای کاربر (پیامک و ایمیل)
              </span>
            </label>
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
            <span>ایجاد کاربر جدید</span>
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
