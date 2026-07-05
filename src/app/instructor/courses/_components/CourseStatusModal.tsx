"use client";

import { useEffect } from "react";
import { Clock3, FilePenLine, Info } from "lucide-react";

export type CourseStatusModalVariant = "pending" | "draft" | "unavailable" | "not_manageable";

type CourseStatusModalProps = {
  open: boolean;
  variant: CourseStatusModalVariant;
  draftStep?: number;
  onClose: () => void;
  onConfirm?: () => void;
};

function getModalCopy(variant: CourseStatusModalVariant, draftStep?: number) {
  if (variant === "pending") {
    return {
      icon: Clock3,
      iconClassName: "text-amber-500 bg-amber-500/10",
      title: "در انتظار بررسی",
      description:
        "وضعیت این دوره در حال بررسی می‌باشد. پس از تایید تیم اسپاتی‌کد، مدیریت کامل و نمایش عمومی دوره فعال می‌شود.",
      confirmLabel: "متوجه شدم",
      showCancel: false,
    };
  }

  if (variant === "draft") {
    return {
      icon: FilePenLine,
      iconClassName: "text-primary bg-primary/10",
      title: "دوره پیش‌نویس",
      description: `این دوره هنوز منتشر نشده و در مرحله ${draftStep ?? 1} از ۵ قرار دارد. برای مشاهده عمومی، ابتدا ساخت دوره را تکمیل و ارسال کنید.`,
      confirmLabel: "ادامه تکمیل پیش‌نویس",
      showCancel: true,
    };
  }

  if (variant === "not_manageable") {
    return {
      icon: Info,
      iconClassName: "text-rose-500 bg-rose-500/10",
      title: "غیرقابل مدیریت",
      description: "این دوره در وضعیت فعلی قابل مدیریت نیست.",
      confirmLabel: "متوجه شدم",
      showCancel: false,
    };
  }

  return {
    icon: Info,
    iconClassName: "text-gray-500 bg-gray-500/10",
    title: "غیرقابل مشاهده",
    description: "این دوره هنوز قابل مشاهده عمومی نیست.",
    confirmLabel: "متوجه شدم",
    showCancel: false,
  };
}

export default function CourseStatusModal({
  open,
  variant,
  draftStep,
  onClose,
  onConfirm,
}: CourseStatusModalProps) {
  const copy = getModalCopy(variant, draftStep);
  const Icon = copy.icon;

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-status-modal-title"
    >
      <div
        className="w-full max-w-md rounded-[2rem] border border-gray-100 bg-white p-6 text-right shadow-2xl dark:border-white/10 dark:bg-[#1c1e26] md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`mb-5 inline-flex size-14 items-center justify-center rounded-2xl ${copy.iconClassName}`}>
          <Icon className="size-7" />
        </div>

        <h3 id="course-status-modal-title" className="text-lg font-black text-gray-900 dark:text-white md:text-xl">
          {copy.title}
        </h3>
        <p className="mt-3 text-sm font-medium leading-7 text-gray-600 dark:text-gray-300">{copy.description}</p>

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {copy.showCancel ? (
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-2xl border border-gray-200 px-5 text-xs font-black text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              بستن
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="h-11 rounded-2xl bg-primary px-5 text-xs font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
          >
            {copy.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
