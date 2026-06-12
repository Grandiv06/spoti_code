"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InputOTP } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { apiPostNoMock } from "@/lib/api";
import { useLoginByPhoneMutation } from "@/hooks/api/useAuthMutations";


type AppRole = "admin" | "user" | "instructor";

const PHONE_ROLE_MAP: Record<string, AppRole> = {
  "+989100000001": "admin", // superadmin -> admin panel
  "+989100000002": "admin",
  "+989100000003": "instructor",
  "+989100000004": "user",
};

/** اعداد فارسی/عربی را به انگلیسی تبدیل می‌کند */
function normalizeDigits(str: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persian[i], "g"), String(i));
    result = result.replace(new RegExp(arabic[i], "g"), String(i));
  }
  return result.replace(/\s/g, "").replace(/-/g, "");
}

function toIranIntlPhone(input: string): string {
  let value = normalizeDigits(input).replace(/[^0-9]/g, "");
  if (value.startsWith("98")) value = value.slice(2);
  if (value.startsWith("0")) value = value.slice(1);
  return `+98${value}`;
}

function resolveAppRole(result: {
  user?: { role?: string; roles?: Array<{ name?: string }> };
  data?: { role?: string; roles?: Array<{ name?: string }>; phoneNumber?: string; phone?: string };
}, fallbackPhone: string): AppRole {
  const roleNames = [
    ...(result?.data?.roles ?? []).map((r) => String(r?.name || "").toUpperCase()),
    ...(result?.user?.roles ?? []).map((r) => String(r?.name || "").toUpperCase()),
  ];

  if (roleNames.some((r) => r === "SUPER_ADMIN" || r === "ADMIN")) return "admin";
  if (roleNames.some((r) => r === "INSTRUCTOR")) return "instructor";
  if (roleNames.some((r) => r === "USER")) return "user";

  const directRole = String(result?.data?.role || result?.user?.role || "").toLowerCase();
  if (directRole === "superadmin" || directRole === "super_admin" || directRole === "admin") return "admin";
  if (directRole === "instructor") return "instructor";
  if (directRole === "user") return "user";

  const phone = result?.data?.phoneNumber || result?.data?.phone || fallbackPhone;
  return PHONE_ROLE_MAP[phone] || "user";
}

export default function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [sentOtp, setSentOtp] = useState("");
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const loginMutation = useLoginByPhoneMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedReturnUrl = searchParams.get("returnUrl");

  const completeLogin = (
    user: {
      id: string;
      phone: string;
      displayName: string;
      role: AppRole;
    },
    token?: string
  ) => {
    login(user, token);

    const fallbackPath =
      user.role === "admin"
        ? "/admin"
        : user.role === "instructor"
          ? "/instructor/dashboard"
          : "/panel";

    router.push(requestedReturnUrl || fallbackPath);
  };

  useEffect(() => {
    document.documentElement.classList.remove("auth-route-transitioning");
    const initialPhone = searchParams.get("phone");
    if (initialPhone) setPhoneInput(normalizeDigits(initialPhone).replace(/[^0-9]/g, ""));
  }, [searchParams]);

  useEffect(() => {
    if (step !== "otp" || otpExpiresIn <= 0) return;
    const intervalId = window.setInterval(() => {
      setOtpExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [step, otpExpiresIn]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const value = normalizeDigits(phoneInput).replace(/[^0-9]/g, "");
    if (value.length < 10) {
      setError("شماره معتبر نیست.");
      return;
    }

    const normalizedPhone = toIranIntlPhone(value);

    try {
      const resendOtpPayload = {
        phoneNumber: normalizedPhone,
      };
      const result = await apiPostNoMock<{
        data?: { otp?: string; phoneNumber?: string; secondsToExpire?: number };
      }>("/api/auth/resend-verification-code", resendOtpPayload);
      setPhone(normalizedPhone);
      setSentOtp(result?.data?.otp || "");
      setOtpExpiresIn(Number(result?.data?.secondsToExpire ?? 180));
      setStep("otp");
    } catch {
      setError("ارسال کد تایید انجام نشد.");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeDigits(e.target.value).replace(/[^0-9]/g, "");
    setPhoneInput(normalized);
  };

  const verifyOtpAndLogin = async () => {
    if (otpSubmitting || loginMutation.isPending) return;
    setError("");
    if (otp.length !== 6) return;
    const normalizedOtp = normalizeDigits(otp).replace(/[^0-9]/g, "");
    setOtpSubmitting(true);

    try {
      const normalizedPhone = toIranIntlPhone(phone);
      const result = await loginMutation.mutateAsync({
        phone: normalizedPhone,
        otp: normalizedOtp,
      }) as {
        accessToken?: string;
        token?: string;
        data?: {
          accessToken?: string;
          token?: string;
          id?: string;
          userName?: string;
          fullName?: string | null;
          displayName?: string;
          phoneNumber?: string;
          phone?: string;
          role?: string;
          roles?: Array<{ name?: string }>;
        };
        user?: {
          id?: string;
          phone?: string;
          phoneNumber?: string;
          userName?: string;
          fullName?: string | null;
          displayName?: string;
          role?: string;
          roles?: Array<{ name?: string }>;
        };
      };

      const accessToken = result?.accessToken || result?.token || result?.data?.accessToken || result?.data?.token;
      if (accessToken && typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }

      const apiUser = result?.data || result?.user;
      const role = resolveAppRole(result, normalizedPhone);
      const userPhone = apiUser?.phoneNumber || apiUser?.phone || normalizedPhone;
      const displayName = apiUser?.fullName || apiUser?.displayName || apiUser?.userName || "کاربر اسپاتی‌کد";

      completeLogin({
        id: apiUser?.id || `${role}-${userPhone}`,
        phone: userPhone,
        displayName,
        role,
      }, accessToken);
      return;
    } catch {
      setError("کد تایید نامعتبر است یا ورود انجام نشد.");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpAndLogin();
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setSentOtp("");
    setOtpExpiresIn(0);
  };

  const handleResendOtp = async () => {
    if (!phone || otpSubmitting || loginMutation.isPending) return;

    setError("");
    setOtp("");

    try {
      const result = await apiPostNoMock<{
        data?: { otp?: string; phoneNumber?: string; secondsToExpire?: number };
      }>("/api/auth/resend-verification-code", {
        phoneNumber: phone,
      });

      setSentOtp(result?.data?.otp || "");
      setOtpExpiresIn(Number(result?.data?.secondsToExpire ?? 180));
    } catch {
      setError("ارسال مجدد کد تایید انجام نشد.");
    }
  };

  if (step === "otp") {
    return (
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          کد تایید
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
          کد ۶ رقمی ارسال شده به {phone} را وارد کنید
        </p>
        {otpExpiresIn > 0 ? (
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-2">
            زمان باقی‌مانده: {Math.floor(otpExpiresIn / 60).toString().padStart(2, "0")}:
            {(otpExpiresIn % 60).toString().padStart(2, "0")}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={otpSubmitting || loginMutation.isPending}
            className="mt-2 text-sm font-black text-[#00c853] dark:text-green-400 hover:underline decoration-2 underline-offset-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ارسال مجدد کد
          </button>
        )}
        {sentOtp && (
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-2">
            کد OTP (تست): {sentOtp}
          </p>
        )}

        <form
          onSubmit={handleOtpSubmit}
          className="space-y-6 mt-8"
        >
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center">{error}</p>
          )}
          <div className="flex justify-center" dir="ltr">
            <InputOTP
              maxLength={6}
              pattern="^[0-9۰-۹٠-٩]+$"
              value={otp}
              onChange={(v) => {
                setError("");
                const normalized = normalizeDigits(v).replace(/[^0-9]/g, "").slice(0, 6);
                setOtp(normalized);
                if (normalized.length === 6) {
                  if (otpExpiresIn > 0) {
                    setTimeout(() => {
                      verifyOtpAndLogin();
                    }, 0);
                  }
                }
              }}
              placeholder="•"
              textAlign="left"
              dir="ltr"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6 || otpSubmitting || loginMutation.isPending || otpExpiresIn <= 0}
            className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>
              {otpExpiresIn <= 0
                ? "کد منقضی شده"
                : otpSubmitting || loginMutation.isPending
                  ? "در حال تایید..."
                  : "تایید و ورود"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleBackToPhone}
            className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#00c853] dark:hover:text-green-400 transition-colors cursor-pointer"
          >
            تغییر شماره موبایل
          </button>

        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-[#00c853] dark:text-green-400 font-black mr-1"
            >
              ایجاد حساب
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          ورود به حساب کاربری
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
          برای استفاده از خدمات آکادمی، شماره موبایل خود را وارد کنید
        </p>

      </div>

      <form className="space-y-6" onSubmit={handlePhoneSubmit}>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center">{error}</p>
        )}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1"
          >
            شماره تلفن
          </label>
          <div className="relative group">
            <input
              id="phone"
              name="phone"
              type="tel"
              dir="ltr"
              required
              value={phoneInput}
              onChange={handlePhoneChange}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={11}
              className="w-full h-14 px-6 pr-14 rounded-[2.5rem] border border-gray-300 dark:border-slate-700/85 bg-gray-50 dark:bg-[#171922] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#00c853]/20 focus:border-[#00c853] focus:bg-white dark:focus:bg-[#14161d] outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:text-base placeholder:tracking-normal font-medium text-base tracking-normal text-left"
              placeholder="0912 345 6789"
            />
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
              smartphone
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <span>{loginMutation.isPending ? "در حال ارسال..." : "دریافت کد تایید"}</span>
        </button>
      </form>

      <div className="mt-8 space-y-5 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-[#00c853] dark:text-green-400 font-black mr-1"
            >
              ایجاد حساب
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
