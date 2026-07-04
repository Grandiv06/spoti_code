import React, { useState, useEffect } from "react";
import { X, User as UserIcon, Phone, Mail, FileText, Shield, Activity, Loader2 } from "lucide-react";
import { User } from "./types";
import CustomSelect from "@/components/ui/CustomSelect";
import { isValidIranPhone } from "@/lib/admin-users";
import { APPLICATION_MAIN_ROLE_OPTIONS, ApplicationMainRoles, type ApplicationMainRole } from "@/lib/application-roles";
import {
  useAdminUserByIdQuery,
  useUpdateAdminUserMutation,
} from "@/hooks/api/useAdminUserEditQueries";

interface EditUserModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
  onError?: (message: string) => void;
}

const statusOptions = [
  { value: "فعال", label: "فعال" },
  { value: "غیرفعال", label: "غیرفعال" },
  { value: "معلق", label: "معلق" },
];

const roleOptions = APPLICATION_MAIN_ROLE_OPTIONS;

const modalSelectClassName =
  "[&_button]:h-11 [&_button]:min-h-[44px] [&_button]:rounded-2xl [&_button]:text-xs [&_button]:px-4";

function EditUserModalSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5 md:col-span-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
      </div>
      <div className="h-28 rounded-2xl bg-gray-100 dark:bg-white/5" />
    </div>
  );
}

export default function EditUserModal({
  userId,
  isOpen,
  onClose,
  onSave,
  onError,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"فعال" | "غیرفعال" | "معلق">("فعال");
  const [role, setRole] = useState<ApplicationMainRole>(ApplicationMainRoles.USER);
  const [canPublishWithoutApproval, setCanPublishWithoutApproval] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: user,
    isPending,
    isError,
    error,
    refetch,
  } = useAdminUserByIdQuery(userId, isOpen);

  const updateMutation = useUpdateAdminUserMutation();

  useEffect(() => {
    if (user && isOpen) {
      // The modal owns an editable draft copy of the loaded user record.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setStatus(user.status);
      setRole(user.role);
      setCanPublishWithoutApproval(Boolean(user.canPublishWithoutApproval));
      setInternalNotes(user.internalNotes || "");
      setErrors({});
    }
  }, [user, isOpen]);

  if (!isOpen || !userId) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "لطفاً نام کامل کاربر را وارد کنید.";
    }

    if (!phone.trim()) {
      newErrors.phone = "لطفاً شماره موبایل کاربر را وارد کنید.";
    } else if (!isValidIranPhone(phone.trim())) {
      newErrors.phone = "شماره موبایل نامعتبر است. باید ۱۱ رقم بوده و با ۰۹ شروع شود یا با +۹۸ باشد.";
    }

    if (!email.trim()) {
      newErrors.email = "لطفاً آدرس ایمیل کاربر را وارد کنید.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "آدرس ایمیل وارد شده نامعتبر است.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !userId) return;

    try {
      const updatedUser = await updateMutation.mutateAsync({
        userId,
        input: { name, phone, email, status, role, internalNotes, canPublishWithoutApproval },
      });
      onSave({ ...user, ...updatedUser });
    } catch (err) {
      const message = err instanceof Error ? err.message : "ذخیره تغییرات انجام نشد.";
      onError?.(message);
    }
  };

  const isSaving = updateMutation.isPending;
  const displayName = user?.name || name || "کاربر";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto" dir="rtl">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#12141a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-300 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-base font-black text-gray-900 dark:text-white">
              ویرایش اطلاعات کاربر ({displayName})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-100 hover:border-gray-200 dark:border-white/5 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPending ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <EditUserModalSkeleton />
          </div>
        ) : isError ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <p className="text-sm font-black">بارگذاری اطلاعات کاربر انجام نشد.</p>
              <p className="mt-2 text-xs leading-relaxed opacity-90">
                {error?.message || "لطفاً اتصال شبکه و سطح دسترسی را بررسی کنید."}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-700"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

              <div className="space-y-2 md:col-span-2">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">وضعیت حساب</label>
                <CustomSelect
                  options={statusOptions}
                  value={status}
                  onChange={(value) => setStatus(value as User["status"])}
                  placeholder="وضعیت حساب"
                  size="md"
                  icon={<Activity className="w-4 h-4" />}
                  className={modalSelectClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">نقش کاربر</label>
                <CustomSelect
                  options={roleOptions}
                  value={role}
                  onChange={(value) => setRole(value as ApplicationMainRole)}
                  placeholder="نقش کاربر"
                  size="md"
                  icon={<Shield className="w-4 h-4" />}
                  className={modalSelectClassName}
                />
              </div>
            </div>

            {role === ApplicationMainRoles.INSTRUCTOR ? (
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white">مجوز انتشار مستقیم دوره</p>
                    <p className="mt-1 text-[10px] font-bold leading-5 text-gray-500 dark:text-gray-400">
                      اگر فعال باشد، این مدرس بعد از کلیک روی انتشار نیازی به تایید ادمین ندارد و دوره مستقیم منتشر می‌شود.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCanPublishWithoutApproval((current) => !current)}
                    className={`relative h-9 w-16 shrink-0 rounded-full border transition ${
                      canPublishWithoutApproval
                        ? "border-primary bg-primary"
                        : "border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-black/20"
                    }`}
                    aria-pressed={canPublishWithoutApproval}
                  >
                    <span
                      className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition ${
                        canPublishWithoutApproval ? "right-8" : "right-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : null}

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

            <button type="submit" className="hidden" />
          </form>
        )}

        <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isPending || isError || isSaving}
            className="flex items-center gap-1.5 px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 disabled:opacity-50 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition-all"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}
