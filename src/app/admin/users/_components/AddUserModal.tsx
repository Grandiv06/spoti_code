import React, { useState } from "react";
import { X, User as UserIcon, Phone, FileText, UserCog, Activity } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { ApplicationMainRoles, type ApplicationMainRole } from "@/lib/application-roles";
import type { AdminUserCreateInput } from "@/lib/admin-users";
import { sanitizeNumericInput } from "@/lib/digits";

const IRAN_PHONE_MAX_LENGTH = 11;

const ADD_USER_ROLE_OPTIONS: Array<{ value: ApplicationMainRole; label: string }> = [
  { value: ApplicationMainRoles.USER, label: "کاربر" },
  { value: ApplicationMainRoles.ADMIN, label: "ادمین" },
  { value: ApplicationMainRoles.INSTRUCTOR, label: "استاد" },
];

const ADD_USER_STATUS_OPTIONS: Array<{ label: string; value: "فعال" | "غیرفعال" }> = [
  { label: "فعال", value: "فعال" },
  { label: "غیرفعال", value: "غیرفعال" },
];

const addUserSelectClassName =
  "[&_button]:min-h-[46px] [&_button]:h-[46px] [&_button]:rounded-2xl [&_button]:text-xs [&_button]:px-4 [&_button]:py-3 [&_button]:!bg-gray-50 [&_button]:dark:!bg-black/20 [&_button]:!border-gray-100 [&_button]:dark:!border-white/5 [&_button]:font-bold [&_button]:!shadow-none [&_button]:!ring-0 [&_button:hover]:!border-gray-200 [&_button:hover]:dark:!border-white/10";

type InstructorTier = "standard" | "verified";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newUser: AdminUserCreateInput) => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
}: AddUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"فعال" | "غیرفعال">("فعال");
  const [role, setRole] = useState<ApplicationMainRole>(ApplicationMainRoles.USER);
  const [instructorTier, setInstructorTier] = useState<InstructorTier>("standard");
  const [internalNotes, setInternalNotes] = useState("");
  const [sendWelcomeSms, setSendWelcomeSms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(sanitizeNumericInput(event.target.value).slice(0, IRAN_PHONE_MAX_LENGTH));
  };

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "لطفاً نام کاربر را وارد کنید.";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "لطفاً نام خانوادگی کاربر را وارد کنید.";
    }

    if (!phone.trim()) {
      newErrors.phone = "لطفاً شماره موبایل کاربر را وارد کنید.";
    } else if (!/^09\d{9}$/.test(phone.trim())) {
      newErrors.phone = "شماره موبایل نامعتبر است. باید ۱۱ رقم بوده و با ۰۹ شروع شود.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setStatus("فعال");
    setRole(ApplicationMainRoles.USER);
    setInstructorTier("standard");
    setInternalNotes("");
    setSendWelcomeSms(true);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAdd({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      status,
      role,
      internalNotes: internalNotes.trim(),
      sendWelcomeSms,
      ...(role === ApplicationMainRoles.INSTRUCTOR
        ? { canPublishWithoutApproval: instructorTier === "verified" }
        : {}),
    });

    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-6" dir="rtl">
      <div
        className="fixed inset-0 cursor-pointer bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl transition-all duration-300 animate-in zoom-in-95 dark:border-white/5 dark:bg-[#12141a]">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-5 dark:border-white/5 dark:bg-black/10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <h2 className="text-base font-black text-gray-900 dark:text-white">افزودن کاربر جدید به پلتفرم</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-gray-100 text-gray-400 transition-all hover:border-gray-200 hover:bg-gray-100 hover:text-gray-700 dark:border-white/5 dark:text-gray-500 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">نام</label>
              <div className="relative">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full rounded-2xl border bg-gray-50 py-3 pl-4 pr-10 text-xs font-bold text-gray-900 outline-none transition-all focus:border-primary/50 dark:bg-black/20 dark:text-white ${
                    errors.firstName ? "border-red-500" : "border-gray-100 dark:border-white/5"
                  }`}
                  placeholder="مثال: آرمان"
                />
                <UserIcon className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.firstName ? <p className="text-[10px] font-bold text-red-500">{errors.firstName}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">نام خانوادگی</label>
              <div className="relative">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full rounded-2xl border bg-gray-50 py-3 pl-4 pr-10 text-xs font-bold text-gray-900 outline-none transition-all focus:border-primary/50 dark:bg-black/20 dark:text-white ${
                    errors.lastName ? "border-red-500" : "border-gray-100 dark:border-white/5"
                  }`}
                  placeholder="مثال: ابراهیمی"
                />
                <UserIcon className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.lastName ? <p className="text-[10px] font-bold text-red-500">{errors.lastName}</p> : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">شماره موبایل (ورود به حساب)</label>
              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={IRAN_PHONE_MAX_LENGTH}
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`w-full rounded-2xl border bg-gray-50 py-3 pl-4 pr-10 text-left text-xs font-bold text-gray-900 outline-none transition-all focus:border-primary/50 dark:bg-black/20 dark:text-white ${
                    errors.phone ? "border-red-500" : "border-gray-100 dark:border-white/5"
                  }`}
                  placeholder="09126666666"
                  dir="ltr"
                />
                <Phone className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.phone ? <p className="text-[10px] font-bold text-red-500">{errors.phone}</p> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="relative z-30 space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">وضعیت اولیه حساب</label>
              <CustomSelect
                options={ADD_USER_STATUS_OPTIONS}
                value={status}
                onChange={(value) => setStatus(value as "فعال" | "غیرفعال")}
                placeholder="وضعیت حساب"
                size="sm"
                icon={<Activity className="h-4 w-4" />}
                className={addUserSelectClassName}
              />
            </div>

            <div className="relative z-20 space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">نقش سیستم</label>
              <CustomSelect
                options={ADD_USER_ROLE_OPTIONS}
                value={role}
                onChange={(value) => setRole(value as ApplicationMainRole)}
                placeholder="نقش سیستم"
                size="sm"
                icon={<UserCog className="h-4 w-4" />}
                className={addUserSelectClassName}
              />
            </div>
          </div>

          {role === ApplicationMainRoles.INSTRUCTOR ? (
            <div className="space-y-2 rounded-[1.35rem] border border-primary/15 bg-primary/5 p-4">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">نوع دسترسی استاد</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setInstructorTier("standard")}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-right transition-all ${
                    instructorTier === "standard"
                      ? "border-primary/30 bg-white text-primary shadow-sm dark:bg-white/10"
                      : "border-gray-100 bg-white/70 text-gray-600 hover:border-gray-200 dark:border-white/10 dark:bg-black/20 dark:text-gray-300"
                  }`}
                >
                  <p className="text-xs font-black">استاد معمولی</p>
                  <p className="mt-1 text-[10px] font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                    ایجاد و ویرایش دوره نیازمند تایید ادمین است
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setInstructorTier("verified")}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-right transition-all ${
                    instructorTier === "verified"
                      ? "border-emerald-500/30 bg-white text-emerald-600 shadow-sm dark:bg-white/10 dark:text-emerald-400"
                      : "border-gray-100 bg-white/70 text-gray-600 hover:border-gray-200 dark:border-white/10 dark:bg-black/20 dark:text-gray-300"
                  }`}
                >
                  <p className="text-xs font-black">استاد تاییدشده اسپاتی‌کد</p>
                  <p className="mt-1 text-[10px] font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                    انتشار دوره بدون نیاز به تایید ادمین
                  </p>
                </button>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">یادداشت داخلی</label>
            <div className="relative">
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="h-24 w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-4 pr-10 text-xs font-medium leading-relaxed text-gray-900 outline-none transition-all focus:border-primary/50 dark:border-white/5 dark:bg-black/20 dark:text-white"
                placeholder="توضیحات یا یادداشتی برای استفاده داخلی مدیران..."
              />
              <FileText className="absolute right-3.5 top-4 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={sendWelcomeSms}
                onChange={(e) => setSendWelcomeSms(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                ارسال پیام خوش‌آمدگویی برای کاربر (پیامک)
              </span>
            </label>
          </div>

          <button type="submit" className="hidden" />
        </form>

        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-5 dark:border-white/5 dark:bg-black/10">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex cursor-pointer items-center gap-1.5 rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-hover"
          >
            <span>ایجاد کاربر جدید</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-2xl bg-gray-100 px-6 py-3 text-xs font-bold text-gray-700 transition-all hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}
