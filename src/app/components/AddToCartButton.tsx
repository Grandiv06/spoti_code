"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

type CourseOrderPayload = {
  id: string;
  title: string;
  price: string;
  image: string;
  instructor: string;
};

export default function AddToCartButton({ course }: { course: CourseOrderPayload }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (isSubmitting || isSuccess) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await apiPost("/api/orders", { courseId: course.id });
      setIsSuccess(true);
    } catch {
      setErrorMessage("ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleRegister}
        disabled={isSubmitting || isSuccess}
        className={`w-full text-white text-base md:text-xl font-black py-4 md:py-6 rounded-2xl md:rounded-[2rem] shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-2 md:gap-3 group/btn border border-white/20 relative overflow-hidden ${
          isSubmitting || isSuccess
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-primary to-emerald-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:-translate-y-1 active:scale-95 cursor-pointer"
        }`}
      >
        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
        <span className="material-symbols-outlined text-2xl md:text-[28px] relative z-10">
          {isSuccess ? "check_circle" : "local_mall"}
        </span>
        <span className="relative z-10">
          {isSubmitting
            ? "در حال ثبت‌نام..."
            : isSuccess
              ? "ثبت‌نام انجام شد"
              : "ثبت‌نام در دوره"}
        </span>
      </button>
      {errorMessage && (
        <p className="text-center text-xs md:text-sm font-bold text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
