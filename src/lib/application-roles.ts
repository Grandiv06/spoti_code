export const ApplicationMainRoles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  INSTRUCTOR: "INSTRUCTOR",
  USER: "USER",
} as const;

export type ApplicationMainRole =
  (typeof ApplicationMainRoles)[keyof typeof ApplicationMainRoles];

export const APPLICATION_MAIN_ROLE_LABELS: Record<ApplicationMainRole, string> = {
  SUPER_ADMIN: "سوپر ادمین",
  ADMIN: "مدیر (ادمین)",
  INSTRUCTOR: "مدرس",
  USER: "کاربر عادی",
};

export const APPLICATION_MAIN_ROLE_OPTIONS = (
  Object.values(ApplicationMainRoles) as ApplicationMainRole[]
).map((value) => ({
  value,
  label: APPLICATION_MAIN_ROLE_LABELS[value],
}));

const PERSIAN_LEGACY_ROLE_MAP: Record<string, ApplicationMainRole> = {
  "کاربر عادی": ApplicationMainRoles.USER,
  ادمین: ApplicationMainRoles.ADMIN,
  پشتیبان: ApplicationMainRoles.USER,
};

export function normalizeApplicationMainRole(value: unknown): ApplicationMainRole {
  const raw = String(value ?? "").trim();
  if (!raw) return ApplicationMainRoles.USER;

  if (raw in PERSIAN_LEGACY_ROLE_MAP) {
    return PERSIAN_LEGACY_ROLE_MAP[raw];
  }

  const upper = raw.toUpperCase().replace(/-/g, "_");
  if (upper === ApplicationMainRoles.SUPER_ADMIN || upper === "SUPERADMIN") {
    return ApplicationMainRoles.SUPER_ADMIN;
  }
  if (upper === ApplicationMainRoles.ADMIN) return ApplicationMainRoles.ADMIN;
  if (upper === ApplicationMainRoles.INSTRUCTOR) return ApplicationMainRoles.INSTRUCTOR;
  if (upper === ApplicationMainRoles.USER) return ApplicationMainRoles.USER;

  const normalized = raw.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const legacyMap: Record<string, ApplicationMainRole> = {
    superadmin: ApplicationMainRoles.SUPER_ADMIN,
    super_admin: ApplicationMainRoles.SUPER_ADMIN,
    admin: ApplicationMainRoles.ADMIN,
    administrator: ApplicationMainRoles.ADMIN,
    instructor: ApplicationMainRoles.INSTRUCTOR,
    teacher: ApplicationMainRoles.INSTRUCTOR,
    user: ApplicationMainRoles.USER,
    customer: ApplicationMainRoles.USER,
    student: ApplicationMainRoles.USER,
    support: ApplicationMainRoles.USER,
    supportagent: ApplicationMainRoles.USER,
    moderator: ApplicationMainRoles.USER,
  };

  if (normalized in legacyMap) return legacyMap[normalized];
  if (raw.includes("سوپر") || raw.includes("super")) return ApplicationMainRoles.SUPER_ADMIN;
  if (raw.includes("ادمین") || raw.includes("admin")) return ApplicationMainRoles.ADMIN;
  if (raw.includes("مدرس") || raw.includes("instructor")) return ApplicationMainRoles.INSTRUCTOR;

  return ApplicationMainRoles.USER;
}

export function pickPrimaryApplicationRole(roles: string[]): ApplicationMainRole {
  const normalized = roles.map(normalizeApplicationMainRole);
  if (normalized.includes(ApplicationMainRoles.SUPER_ADMIN)) return ApplicationMainRoles.SUPER_ADMIN;
  if (normalized.includes(ApplicationMainRoles.ADMIN)) return ApplicationMainRoles.ADMIN;
  if (normalized.includes(ApplicationMainRoles.INSTRUCTOR)) return ApplicationMainRoles.INSTRUCTOR;
  return ApplicationMainRoles.USER;
}

export function getApplicationMainRoleLabel(role: ApplicationMainRole | string): string {
  return APPLICATION_MAIN_ROLE_LABELS[role as ApplicationMainRole] ?? APPLICATION_MAIN_ROLE_LABELS.USER;
}
