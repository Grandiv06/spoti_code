export type AuthAppRole = "ADMIN" | "INSTRUCTOR" | "USER";

export type StaffPhoneAccount = {
  id: string;
  phone: string;
  fullName: string;
  role: AuthAppRole;
};

/** Seeded staff accounts — roles are stored in the database. */
export const STAFF_PHONE_ACCOUNTS = {
  ADMIN: {
    id: "USR-ADMIN-001",
    phone: "+989104138412",
    fullName: "ادمین اسپاتی‌کد",
    role: "ADMIN",
  },
  INSTRUCTOR: {
    id: "USR-INST-001",
    phone: "+989395063084",
    fullName: "مدرس اسپاتی‌کد",
    role: "INSTRUCTOR",
  },
} as const satisfies Record<string, StaffPhoneAccount>;
