"use client";

import { useMutation } from "@tanstack/react-query";
import { apiPost, apiPostNoMock } from "@/lib/api";

const REGISTER_PATH = "/api/auth/register-by-phone";
const LOGIN_PATH = "/api/auth/verify-phone";
const SEND_OTP_PATH = "/api/auth/resend-verification-code";

type RegisterPayload = {
  phone: string;
};

type LoginPayload = {
  phone: string;
  otp?: string;
  code?: string;
};

export function useRegisterByPhoneMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiPost(REGISTER_PATH, {
        phoneNumber: payload.phone,
      }),
  });
}

export function useLoginByPhoneMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => {
      const normalizedOtp = payload.otp ?? payload.code;
      return apiPostNoMock(
        normalizedOtp ? LOGIN_PATH : SEND_OTP_PATH,
        normalizedOtp
          ? {
              phoneNumber: payload.phone,
              otp: normalizedOtp,
            }
          : {
              phoneNumber: payload.phone,
            }
      );
    },
  });
}

export { LOGIN_PATH, REGISTER_PATH };
