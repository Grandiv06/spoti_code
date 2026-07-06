export type { AuthAppRole, StaffPhoneAccount } from "@/lib/staff-accounts";
export { STAFF_PHONE_ACCOUNTS } from "@/lib/staff-accounts";

export const OTP_EXPIRY_SECONDS = 180;

/** Fixed OTP for staff phones — skips SMS and uses this code instead. */
export const STATIC_OTP_BY_PHONE: Record<string, string> = {
  "+989395063084": "881900",
};
