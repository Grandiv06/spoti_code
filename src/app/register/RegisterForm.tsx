"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InputOTP } from "@/components/ui/input-otp";
import OtpCodeDisplay from "@/components/auth/OtpCodeDisplay";
import { useAuth } from "@/context/AuthContext";
import { extractTokensFromAuthResponse } from "@/lib/auth-tokens";
import { useLoginByPhoneMutation, useRegisterByPhoneMutation } from "@/hooks/api/useAuthMutations";
import { normalizeDigits, PHONE_ROLE_MAP, toIranIntlPhone, extractOtpFromAuthResponse, extractAuthErrorMessage } from "@/lib/phone-auth";

type AppRole = "admin" | "user" | "instructor";

function resolveAppRole(result: {
  user?: { role?: string; roles?: Array<{ name?: string }> };
  data?: { role?: string; roles?: Array<{ name?: string }>; phoneNumber?: string; phone?: string };
}, fallbackPhone: string): AppRole {
  const roleNames = [
    ...(result?.data?.roles ?? []).map((role) => String(role?.name || "").toUpperCase()),
    ...(result?.user?.roles ?? []).map((role) => String(role?.name || "").toUpperCase()),
  ];

  if (roleNames.some((role) => role === "SUPER_ADMIN" || role === "ADMIN")) return "admin";
  if (roleNames.some((role) => role === "INSTRUCTOR")) return "instructor";
  if (roleNames.some((role) => role === "USER")) return "user";

  const directRole = String(result?.data?.role || result?.user?.role || "").toLowerCase();
  if (directRole === "superadmin" || directRole === "super_admin" || directRole === "admin") return "admin";
  if (directRole === "instructor") return "instructor";
  if (directRole === "user") return "user";

  const phone = result?.data?.phoneNumber || result?.data?.phone || fallbackPhone;
  return PHONE_ROLE_MAP[phone] || "user";
}

export default function RegisterForm() {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [fullName, setFullName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const registerMutation = useRegisterByPhoneMutation();
  const loginMutation = useLoginByPhoneMutation();
  const lastAutoSubmitCodeRef = useRef("");

  useEffect(() => {
    document.documentElement.classList.remove("auth-route-transitioning");
  }, []);

  useEffect(() => {
    if (step !== "otp" || otpExpiresIn <= 0) return;
    const intervalId = window.setInterval(() => {
      setOtpExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [step, otpExpiresIn]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeDigits(event.target.value).replace(/[^0-9]/g, "");
    setPhoneInput(normalized);
  };

  const completeLogin = useCallback(
    (user: { id: string; phone: string; displayName: string; role: AppRole }, token?: string, refreshToken?: string) => {
      login(user, token, refreshToken);
      const fallbackPath =
        user.role === "admin"
          ? "/admin"
          : user.role === "instructor"
            ? "/instructor/dashboard"
            : "/panel";
      router.push(fallbackPath);
    },
    [login, router]
  );

  const handleDetailsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setError("نام و نام خانوادگی الزامی است.");
      return;
    }

    const rawPhone = normalizeDigits(phoneInput).replace(/[^0-9]/g, "");
    if (rawPhone.length < 10) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }

    const normalizedPhone = toIranIntlPhone(rawPhone);

    try {
      const result = await registerMutation.mutateAsync({
        phone: normalizedPhone,
        fullName: trimmedName,
      });
      const { otp, secondsToExpire } = extractOtpFromAuthResponse(result);
      setPhone(normalizedPhone);
      setSentOtp(otp);
      setOtpExpiresIn(secondsToExpire);
      setStep("otp");
    } catch (error) {
      setError(extractAuthErrorMessage(error, "ثبت‌نام ناموفق بود. دوباره تلاش کنید."));
    }
  };

  const verifyOtpAndLogin = useCallback(async () => {
    if (otpSubmitting || loginMutation.isPending) return;
    setError("");
    if (otp.length !== 6) return;

    const normalizedOtp = normalizeDigits(otp).replace(/[^0-9]/g, "");
    setOtpSubmitting(true);

    try {
      const result = await loginMutation.mutateAsync({
        phone,
        otp: normalizedOtp,
      }) as {
        data?: {
          id?: string;
          accessToken?: string;
          fullName?: string | null;
          displayName?: string;
          phoneNumber?: string;
          phone?: string;
          role?: string;
          roles?: Array<{ name?: string }>;
        };
      };

      const { accessToken, refreshToken } = extractTokensFromAuthResponse(result);
      const apiUser = result?.data;
      const role = resolveAppRole(result, phone);
      const userPhone = apiUser?.phoneNumber || apiUser?.phone || phone;
      const displayName = apiUser?.fullName || apiUser?.displayName || fullName.trim() || "کاربر اسپاتی‌کد";

      completeLogin(
        {
          id: apiUser?.id || `${role}-${userPhone}`,
          phone: userPhone,
          displayName,
          role,
        },
        accessToken,
        refreshToken
      );
    } catch {
      setError("کد تایید نامعتبر است.");
    } finally {
      setOtpSubmitting(false);
    }
  }, [completeLogin, fullName, loginMutation, otp, otpSubmitting, phone]);

  useEffect(() => {
    if (step !== "otp" || otpExpiresIn <= 0 || otp.length !== 6) {
      lastAutoSubmitCodeRef.current = "";
      return;
    }

    if (lastAutoSubmitCodeRef.current === otp || otpSubmitting || loginMutation.isPending) {
      return;
    }

    lastAutoSubmitCodeRef.current = otp;
    void verifyOtpAndLogin();
  }, [loginMutation.isPending, otp, otpExpiresIn, otpSubmitting, step, verifyOtpAndLogin]);

  const handleResendOtp = async () => {
    if (!phone || otpSubmitting || loginMutation.isPending || registerMutation.isPending) return;

    setError("");
    setOtp("");

    try {
      const result = await registerMutation.mutateAsync({
        phone,
        fullName: fullName.trim(),
      });
      const { otp, secondsToExpire } = extractOtpFromAuthResponse(result);
      setSentOtp(otp);
      setOtpExpiresIn(secondsToExpire);
    } catch (error) {
      setError(extractAuthErrorMessage(error, "ارسال مجدد کد تایید انجام نشد."));
    }
  };

  const inputClassName =
    "w-full h-14 px-6 pr-14 rounded-[2.5rem] border border-gray-300 dark:border-slate-700/85 bg-gray-50 dark:bg-[#171922] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#00c853]/20 focus:border-[#00c853] focus:bg-white dark:focus:bg-[#14161d] outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:text-base placeholder:tracking-normal font-medium text-base tracking-normal";

  if (step === "otp") {
    return (
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          تایید شماره موبایل
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
          کد ۶ رقمی ارسال شده به {phone} را وارد کنید
        </p>
        <OtpCodeDisplay code={sentOtp} />
        {otpExpiresIn > 0 ? (
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-2">
            زمان باقی‌مانده: {Math.floor(otpExpiresIn / 60).toString().padStart(2, "0")}:
            {(otpExpiresIn % 60).toString().padStart(2, "0")}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={otpSubmitting || loginMutation.isPending || registerMutation.isPending}
            className="mt-2 text-sm font-black text-[#00c853] dark:text-green-400 hover:underline decoration-2 underline-offset-4 cursor-pointer disabled:opacity-50"
          >
            ارسال مجدد کد
          </button>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void verifyOtpAndLogin();
          }}
          className="space-y-6 mt-8"
        >
          {error ? (
            <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center">{error}</p>
          ) : null}
          <div className="flex justify-center" dir="ltr">
            <InputOTP
              maxLength={6}
              pattern="^[0-9۰-۹٠-٩]+$"
              value={otp}
              onChange={(value) => {
                setError("");
                setOtp(normalizeDigits(value).replace(/[^0-9]/g, "").slice(0, 6));
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
            onClick={() => {
              setStep("details");
              setOtp("");
              setSentOtp("");
              setOtpExpiresIn(0);
            }}
            className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#00c853] dark:hover:text-green-400 transition-colors cursor-pointer"
          >
            ویرایش اطلاعات ثبت‌نام
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="text-[#00c853] dark:text-green-400 font-black mr-1">
              ورود
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
          ثبت‌نام در آکادمی
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
          با پر کردن فرم زیر، حساب کاربری خود را ایجاد کنید
        </p>
        <p className="text-gray-400 dark:text-gray-500 font-medium text-xs leading-relaxed mt-2">
          می‌توانید با هر شماره موبایل معتبر ایران ثبت‌نام کنید.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleDetailsSubmit}>
        {error ? (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center">{error}</p>
        ) : null}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1">
            نام و نام خانوادگی
          </label>
          <div className="relative group">
            <input
              id="name"
              name="name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClassName}
              placeholder="علی محمدی"
            />
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
              person
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 text-sm font-bold pr-1">
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
              className={`${inputClassName} text-left`}
              placeholder="0912 345 6789"
            />
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c853] dark:group-focus-within:text-green-400 transition-colors text-2xl">
              smartphone
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-14 bg-[#00c853] hover:bg-[#009624] dark:bg-[#00c853] dark:hover:bg-[#009624] text-white text-lg font-bold rounded-[2.5rem] shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <span>{registerMutation.isPending ? "در حال ارسال کد..." : "دریافت کد تایید"}</span>
        </button>
      </form>

      <div className="mt-8 space-y-5 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="text-[#00c853] dark:text-green-400 font-black mr-1">
              ورود
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
