export const TEST_OTP_CODE = "123456";
export const OTP_EXPIRY_SECONDS = 180;

export type AuthAppRole = "ADMIN" | "INSTRUCTOR" | "USER";

export type TestPhoneAccount = {
  id: string;
  fullName: string;
  role: AuthAppRole;
};

export const TEST_PHONE_ACCOUNTS: Record<string, TestPhoneAccount> = {
  "+989000000001": {
    id: "USR-ADMIN-001",
    fullName: "ادمین تست",
    role: "ADMIN",
  },
  "+989000000002": {
    id: "USR-INST-001",
    fullName: "مدرس تست",
    role: "INSTRUCTOR",
  },
  "+989000000003": {
    id: "USR-USER-001",
    fullName: "کاربر تست",
    role: "USER",
  },
};
