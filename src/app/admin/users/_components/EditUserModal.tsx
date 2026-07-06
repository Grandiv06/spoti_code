import React, { useState, useEffect } from "react";
import { X, User as UserIcon, Phone, FileText, UserCog, Activity, Loader2 } from "lucide-react";
import { User } from "./types";
import CustomSelect from "@/components/ui/CustomSelect";
import { isValidIranPhone } from "@/lib/admin-users";
import { ApplicationMainRoles, type ApplicationMainRole } from "@/lib/application-roles";
import { sanitizeNumericInput } from "@/lib/digits";
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

const IRAN_PHONE_MAX_LENGTH = 11;

const EDIT_USER_ROLE_OPTIONS: Array<{ value: ApplicationMainRole; label: string }> = [
  { value: ApplicationMainRoles.USER, label: "کاربر" },
  { value: ApplicationMainRoles.ADMIN, label: "ادمین" },
  { value: ApplicationMainRoles.INSTRUCTOR, label: "استاد" },
];

const EDIT_USER_STATUS_OPTIONS: Array<{ label: string; value: User["status"] }> = [
  { label: "فعال", value: "فعال" },
  { label: "غیرفعال", value: "غیرفعال" },
];

const editUserSelectClassName =
  "[&_button]:min-h-[46px] [&_button]:h-[46px] [&_button]:rounded-2xl [&_button]:text-xs [&_button]:px-4 [&_button]:py-3 [&_button]:!bg-gray-50 [&_button]:dark:!bg-black/20 [&_button]:!border-gray-100 [&_button]:dark:!border-white/5 [&_button]:font-bold [&_button]:!shadow-none [&_button]:!ring-0 [&_button:hover]:!border-gray-200 [&_button:hover]:dark:!border-white/10";

type InstructorTier = "standard" | "verified";

function normalizeOptionalEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—" || trimmed === "-") return "";
  return trimmed;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "", lastName: "" };

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0] ?? "", lastName: "" };
  }

  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function getRoleOptions(currentRole?: ApplicationMainRole) {
  if (currentRole === ApplicationMainRoles.SUPER_ADMIN) {
    return [
      { value: ApplicationMainRoles.SUPER_ADMIN, label: "سوپر ادمین" },
      ...EDIT_USER_ROLE_OPTIONS,
    ];
  }

  return EDIT_USER_ROLE_OPTIONS;
}

function EditUserModalSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5 md:col-span-2" />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
        <div className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
      </div>
      <div className="h-24 rounded-2xl bg-gray-100 dark:bg-white/5" />
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [preservedEmail, setPreservedEmail] = useState("");
  const [status, setStatus] = useState<User["status"]>("فعال");
  const [role, setRole] = useState<ApplicationMainRole>(ApplicationMainRoles.USER);
  const [instructorTier, setInstructorTier] = useState<InstructorTier>("standard");
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

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(sanitizeNumericInput(event.target.value).slice(0, IRAN_PHONE_MAX_LENGTH));
  };

  useEffect(() => {
    if (user && isOpen) {
      const { firstName: loadedFirstName, lastName: loadedLastName } = splitFullName(user.name);
      // The modal owns an editable draft copy of the loaded user record.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(loadedFirstName);
      setLastName(loadedLastName);
      setPhone(sanitizeNumericInput(user.phone).slice(0, IRAN_PHONE_MAX_LENGTH));
      setPreservedEmail(normalizeOptionalEmail(user.email));
      setStatus(user.status);
      setRole(user.role);
      setInstructorTier(user.canPublishWithoutApproval ? "verified" : "standard");
      setInternalNotes(user.internalNotes || "");
      setErrors({});
    }
  }, [user, isOpen]);

  if (!isOpen || !userId) return null;

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
    } else if (!isValidIranPhone(phone.trim())) {
      newErrors.phone = "شماره موبایل نامعتبر است. باید ۱۱ رقم بوده و با ۰۹ شروع شود.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !userId) return;

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ").trim();
    const canPublishWithoutApproval =
      role === ApplicationMainRoles.INSTRUCTOR ? instructorTier === "verified" : false;

    try {
      const updatedUser = await updateMutation.mutateAsync({
        userId,
        input: {
          name: fullName,
          phone,
          email: preservedEmail,
          status,
          role,
          internalNotes,
          canPublishWithoutApproval,
        },
      });
      onSave({ ...user, ...updatedUser });
    } catch (err) {
      const message = err instanceof Error ? err.message : "ذخیره تغییرات انجام نشد.";
      onError?.(message);
    }
  };

  const isSaving = updateMutation.isPending;
  const displayName = user?.name || [firstName, lastName].filter(Boolean).join(" ") || "کاربر";
  const roleOptions = getRoleOptions(user?.role);

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
            <h2 className="text-base font-black text-gray-900 dark:text-white">
              ویرایش اطلاعات کاربر ({displayName})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-gray-100 text-gray-400 transition-all hover:border-gray-200 hover:bg-gray-100 hover:text-gray-700 dark:border-white/5 dark:text-gray-500 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
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
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-700"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        ) : (
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
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">وضعیت حساب</label>
                <CustomSelect
                  options={EDIT_USER_STATUS_OPTIONS}
                  value={status}
                  onChange={(value) => setStatus(value as User["status"])}
                  placeholder="وضعیت حساب"
                  size="sm"
                  icon={<Activity className="h-4 w-4" />}
                  className={editUserSelectClassName}
                />
              </div>

              <div className="relative z-20 space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">نقش سیستم</label>
                <CustomSelect
                  options={roleOptions}
                  value={role}
                  onChange={(value) => setRole(value as ApplicationMainRole)}
                  placeholder="نقش سیستم"
                  size="sm"
                  icon={<UserCog className="h-4 w-4" />}
                  className={editUserSelectClassName}
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

            <button type="submit" className="hidden" />
          </form>
        )}

        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-5 dark:border-white/5 dark:bg-black/10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || isError || isSaving}
            className="flex cursor-pointer items-center gap-1.5 rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-2xl bg-gray-100 px-6 py-3 text-xs font-bold text-gray-700 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}
