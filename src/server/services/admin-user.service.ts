import { randomBytes } from "crypto";
import { Prisma, type AppUserRole, type User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import { ensureCourseApprovalSchema } from "@/server/services/course-approval-schema.service";
import { resolveInstructorForUser } from "@/server/services/instructor-dashboard.service";

type AdminUsersQuery = {
  search?: string;
  email?: string;
  phoneNumber?: string;
  nationalCode?: string;
  role?: string;
  page?: number;
  limit?: number;
};

type AdminUserPayload = {
  firstName?: unknown;
  lastName?: unknown;
  fullName?: unknown;
  name?: unknown;
  phoneNumber?: unknown;
  phone?: unknown;
  email?: unknown;
  roleName?: unknown;
  role?: unknown;
  status?: unknown;
  accountStatus?: unknown;
  isActive?: unknown;
  plan?: unknown;
  internalAdminNote?: unknown;
  internalNotes?: unknown;
  nationalCode?: unknown;
  canPublishWithoutApproval?: unknown;
  sendWelcomeSms?: unknown;
};

const PAID_STATUSES = ["success", "paid", "completed", "successful"];

function assertAdmin(user: User) {
  if (user.role !== "ADMIN") {
    throw new AuthError("دسترسی مدیریت لازم است", 403);
  }
}

function normalizeDigits(value: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let result = value;
  for (let index = 0; index < 10; index += 1) {
    result = result.replace(new RegExp(persian[index], "g"), String(index));
    result = result.replace(new RegExp(arabic[index], "g"), String(index));
  }
  return result.replace(/\s/g, "").replace(/-/g, "");
}

function normalizeIranPhone(input: unknown): string {
  let value = normalizeDigits(String(input ?? "")).replace(/[^0-9]/g, "");
  if (value.startsWith("98")) value = value.slice(2);
  if (value.startsWith("0")) value = value.slice(1);
  if (value.length !== 10 || !value.startsWith("9")) {
    throw new AuthError("شماره موبایل معتبر نیست", 400);
  }
  return `+98${value}`;
}

function optionalString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const text = String(value).trim();
  return text || null;
}

function normalizeRole(value: unknown): AppUserRole {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/-/g, "_");
  if (
    normalized === "ADMIN" ||
    normalized === "SUPER_ADMIN" ||
    normalized === "SUPERADMIN"
  )
    return "ADMIN";
  if (normalized === "INSTRUCTOR") return "INSTRUCTOR";
  return "USER";
}

function normalizeRoleFilter(value: unknown): AppUserRole | undefined {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "all") return undefined;
  return normalizeRole(raw);
}

function normalizeStatus(input: AdminUserPayload): string | undefined {
  if (typeof input.isActive === "boolean")
    return input.isActive ? "active" : "inactive";

  const raw = String(input.status ?? input.accountStatus ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return undefined;
  if (["active", "enabled", "فعال", "true", "1"].includes(raw)) return "active";
  return "inactive";
}

function normalizePlan(value: unknown): string | undefined {
  const raw = String(value ?? "").trim();
  if (!raw) return undefined;
  const normalized = raw.toLowerCase();
  if (["pro", "premium"].includes(normalized)) return "Pro";
  if (["enterprise", "business"].includes(normalized)) return "Enterprise";
  return "Starter";
}

function isPaidStatus(status: string) {
  return PAID_STATUSES.includes(status.toLowerCase());
}

function formatDate(value: Date) {
  return value.toISOString();
}

function hashToGradientSeed(input: string): string {
  const palettes = [
    "from-emerald-400 to-teal-600",
    "from-blue-400 to-indigo-600",
    "from-purple-400 to-pink-600",
    "from-amber-400 to-orange-600",
    "from-cyan-400 to-blue-600",
    "from-red-400 to-rose-600",
  ];
  const hash = input
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palettes[hash % palettes.length];
}

const adminUserInclude = {
  profile: true,
  enrollments: {
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" as const },
  },
  orders: {
    orderBy: { createdAt: "desc" as const },
  },
  tickets: {
    orderBy: { updatedAt: "desc" as const },
  },
};

type AdminUserRecord = Awaited<ReturnType<typeof findAdminUserById>>;

async function findAdminUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: adminUserInclude,
  });
}

function mapCourse(
  enrollment: NonNullable<AdminUserRecord>["enrollments"][number],
) {
  return {
    id: enrollment.id,
    courseId: enrollment.courseId,
    name: enrollment.course.title,
    title: enrollment.course.title,
    purchaseDate: formatDate(enrollment.createdAt),
    createdAt: formatDate(enrollment.createdAt),
    status: "active",
    progress: enrollment.progress,
    progressPercent: enrollment.progress,
  };
}

function mapTransaction(order: NonNullable<AdminUserRecord>["orders"][number]) {
  return {
    id: order.id,
    amount: order.amount,
    status: order.status,
    createdAt: formatDate(order.createdAt),
    date: formatDate(order.createdAt),
    productTitle: order.productTitle || order.description || "سفارش",
    paymentMethod: order.paymentMethod || "",
    trackingCode: order.trackingCode || "",
    type: order.type,
  };
}

function mapTicket(ticket: NonNullable<AdminUserRecord>["tickets"][number]) {
  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.status,
    createdAt: formatDate(ticket.createdAt),
    updatedAt: formatDate(ticket.updatedAt),
    date: formatDate(ticket.createdAt),
  };
}

function mapAdminUser(user: NonNullable<AdminUserRecord>) {
  const paidOrders = user.orders.filter((order) => isPaidStatus(order.status));
  const ltv = paidOrders.reduce((sum, order) => sum + order.amount, 0);
  const latestEnrollment = user.enrollments[0];
  const accountStatus = user.status || "active";

  return {
    id: user.id,
    fullName: user.fullName || user.profile?.occupation || "کاربر اسپاتی‌کد",
    name: user.fullName || user.profile?.occupation || "کاربر اسپاتی‌کد",
    phoneNumber: user.phone,
    phone: user.phone,
    email: user.email || user.profile?.contacts || "",
    status: accountStatus,
    isActive: accountStatus === "active",
    role: user.role,
    roleName: user.role,
    roles: [{ name: user.role }],
    plan: user.plan,
    nationalCode: user.nationalCode || "",
    joinedAt: formatDate(user.createdAt),
    createdAt: formatDate(user.createdAt),
    lastLogin: user.lastLoginAt
      ? formatDate(user.lastLoginAt)
      : formatDate(user.updatedAt),
    lastLoginAt: user.lastLoginAt
      ? formatDate(user.lastLoginAt)
      : formatDate(user.updatedAt),
    coursesCount: user.enrollments.length,
    enrolledCoursesCount: user.enrollments.length,
    purchasesCount: user.orders.length,
    successfulTransactionsCount: paidOrders.length,
    supportTicketsCount: user.tickets.length,
    ltv,
    totalSpent: ltv,
    lastCourseViewed: latestEnrollment?.course.title || "—",
    internalAdminNote: user.internalAdminNote || "",
    internalNotes: user.internalAdminNote || "",
    canPublishWithoutApproval: false,
    avatarColor: hashToGradientSeed(user.id),
    purchasedCourses: user.enrollments.map(mapCourse),
    recentTransactions: user.orders.slice(0, 5).map(mapTransaction),
    recentTickets: user.tickets.slice(0, 5).map(mapTicket),
  };
}

async function attachInstructorPublishPermissions<
  T extends { id: string; role: string },
>(users: T[]): Promise<T[]> {
  const instructorUserIds = users
    .filter((user) => user.role === "INSTRUCTOR")
    .map((user) => user.id);
  if (instructorUserIds.length === 0) return users;

  await ensureCourseApprovalSchema();
  const rows = await prisma.$queryRaw<
    Array<{ id: string; canPublishWithoutApproval: boolean | number | null }>
  >`
    SELECT "id", "canPublishWithoutApproval"
    FROM "Instructor"
    WHERE "id" IN (${Prisma.join(instructorUserIds)})
  `;
  const permissions = new Map(
    rows.map((row) => [
      row.id,
      row.canPublishWithoutApproval === true ||
        row.canPublishWithoutApproval === 1,
    ]),
  );

  return users.map((user) => ({
    ...user,
    canPublishWithoutApproval: permissions.get(user.id) ?? false,
  }));
}

function matchesSearch(
  user: ReturnType<typeof mapAdminUser>,
  query: AdminUsersQuery,
) {
  const search = query.search?.trim().toLowerCase();
  const email = query.email?.trim().toLowerCase();
  const phoneNumber = query.phoneNumber?.trim();
  const nationalCode = query.nationalCode?.trim();

  if (search) {
    const haystack = [
      user.id,
      user.name,
      user.phone,
      user.email,
      user.role,
      user.status,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  if (email && !user.email.toLowerCase().includes(email)) return false;
  if (phoneNumber && !user.phone.includes(phoneNumber)) return false;
  if (nationalCode && !String(user.nationalCode).includes(nationalCode))
    return false;
  return true;
}

export async function getAdminUsers(
  adminUser: User,
  query: AdminUsersQuery = {},
) {
  assertAdmin(adminUser);

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 50));
  const role = normalizeRoleFilter(query.role);
  const users = await prisma.user.findMany({
    where: role ? { role } : undefined,
    include: adminUserInclude,
    orderBy: { createdAt: "desc" },
  });

  const mappedUsers = (
    await attachInstructorPublishPermissions(users.map(mapAdminUser))
  ).filter((user) => matchesSearch(user, query));
  const start = (page - 1) * limit;

  return {
    users: mappedUsers.slice(start, start + limit),
    meta: {
      total: mappedUsers.length,
      page,
      limit,
    },
  };
}

export async function getAdminUserOverview(adminUser: User, userId: string) {
  assertAdmin(adminUser);
  const user = await findAdminUserById(userId);
  if (!user) return null;
  const [mapped] = await attachInstructorPublishPermissions([
    mapAdminUser(user),
  ]);
  return mapped;
}

export async function getAdminUserCourses(adminUser: User, userId: string) {
  const user = await getAdminUserOverview(adminUser, userId);
  return user?.purchasedCourses ?? null;
}

export async function getAdminUserTransactions(
  adminUser: User,
  userId: string,
) {
  const user = await getAdminUserOverview(adminUser, userId);
  return user?.recentTransactions ?? null;
}

export async function getAdminUserTickets(adminUser: User, userId: string) {
  const user = await getAdminUserOverview(adminUser, userId);
  return user?.recentTickets ?? null;
}

export async function getAdminUserActivities(adminUser: User, userId: string) {
  assertAdmin(adminUser);
  const user = await findAdminUserById(userId);
  if (!user) return null;

  return [
    {
      id: `ACT-${user.id}-created`,
      kind: "profile",
      title: "ایجاد حساب کاربری",
      description: `حساب ${user.fullName || user.phone} در اسپاتی‌کد ساخته شد.`,
      timestamp: formatDate(user.createdAt),
    },
    ...user.enrollments.map((enrollment) => ({
      id: `ACT-${enrollment.id}`,
      kind: "lesson",
      title: "ثبت‌نام در دوره",
      description: `دوره «${enrollment.course.title}» برای کاربر فعال است.`,
      timestamp: formatDate(enrollment.createdAt),
    })),
    ...user.orders.map((order) => ({
      id: `ACT-${order.id}`,
      kind: "payment",
      title: isPaidStatus(order.status) ? "پرداخت موفق" : "ثبت تراکنش",
      description:
        order.productTitle || order.description || "تراکنش مالی ثبت شد.",
      timestamp: formatDate(order.createdAt),
    })),
    ...user.tickets.map((ticket) => ({
      id: `ACT-${ticket.id}`,
      kind: "ticket",
      title: "تیکت پشتیبانی",
      description: ticket.title,
      timestamp: formatDate(ticket.createdAt),
    })),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export async function getAdminUserInternalNote(
  adminUser: User,
  userId: string,
) {
  assertAdmin(adminUser);
  const rows = await prisma.$queryRaw<
    Array<{ internalAdminNote: string | null }>
  >`
    SELECT "internalAdminNote"
    FROM "User"
    WHERE "id" = ${userId}
    LIMIT 1
  `;

  const user = rows[0];
  return user ? { note: user.internalAdminNote || "" } : null;
}

export async function updateAdminUserInternalNote(
  adminUser: User,
  userId: string,
  note: unknown,
) {
  assertAdmin(adminUser);
  const nextNote = optionalString(note) ?? null;
  const result = await prisma.$executeRaw`
    UPDATE "User"
    SET "internalAdminNote" = ${nextNote}, "updatedAt" = ${new Date()}
    WHERE "id" = ${userId}
  `;

  if (result === 0) {
    throw new AuthError("کاربر پیدا نشد", 404);
  }

  return { note: nextNote || "" };
}

export async function createAdminUser(
  adminUser: User,
  input: AdminUserPayload,
) {
  assertAdmin(adminUser);

  const phone = normalizeIranPhone(input.phoneNumber ?? input.phone);
  const firstName = optionalString(input.firstName);
  const lastName = optionalString(input.lastName);
  const fullName =
    (optionalString(input.fullName ?? input.name) ??
      [firstName, lastName].filter(Boolean).join(" ").trim()) ||
    null;
  if (!fullName) {
    throw new AuthError("نام و نام خانوادگی کاربر الزامی است", 400);
  }

  const user = await prisma.user.create({
    data: {
      id: `USR-${randomBytes(6).toString("hex")}`,
      phone,
      email: optionalString(input.email) ?? null,
      fullName,
      role: normalizeRole(input.roleName ?? input.role),
      status: normalizeStatus(input) ?? "active",
      plan: normalizePlan(input.plan) ?? "Starter",
      nationalCode: optionalString(input.nationalCode) ?? null,
      internalAdminNote:
        optionalString(input.internalAdminNote ?? input.internalNotes) ?? null,
    },
    include: adminUserInclude,
  });

  if (user.role === "INSTRUCTOR") {
    await ensureCourseApprovalSchema();
    const instructor = await resolveInstructorForUser(user);
    if (instructor) {
      await prisma.$executeRaw`
        UPDATE "Instructor"
        SET "canPublishWithoutApproval" = ${input.canPublishWithoutApproval === true},
            "updatedAt" = ${new Date()}
        WHERE "id" = ${instructor.id}
      `;
    }
  }

  const [mapped] = await attachInstructorPublishPermissions([
    mapAdminUser(user),
  ]);
  return mapped;
}

export async function updateAdminUser(
  adminUser: User,
  userId: string,
  input: AdminUserPayload,
) {
  assertAdmin(adminUser);

  const data: {
    fullName?: string | null;
    phone?: string;
    email?: string | null;
    role?: AppUserRole;
    status?: string;
    plan?: string;
    nationalCode?: string | null;
    internalAdminNote?: string | null;
  } = {};

  if (input.fullName !== undefined || input.name !== undefined) {
    const fullName = optionalString(input.fullName ?? input.name);
    if (!fullName) throw new AuthError("نام کامل کاربر الزامی است", 400);
    data.fullName = fullName;
  }
  if (input.phoneNumber !== undefined || input.phone !== undefined) {
    data.phone = normalizeIranPhone(input.phoneNumber ?? input.phone);
  }
  if (input.email !== undefined)
    data.email = optionalString(input.email) ?? null;
  if (input.roleName !== undefined || input.role !== undefined) {
    data.role = normalizeRole(input.roleName ?? input.role);
  }
  const status = normalizeStatus(input);
  if (status) data.status = status;
  const plan = normalizePlan(input.plan);
  if (plan) data.plan = plan;
  if (input.nationalCode !== undefined)
    data.nationalCode = optionalString(input.nationalCode) ?? null;
  if (
    input.internalAdminNote !== undefined ||
    input.internalNotes !== undefined
  ) {
    data.internalAdminNote =
      optionalString(input.internalAdminNote ?? input.internalNotes) ?? null;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: adminUserInclude,
  });

  if (
    input.canPublishWithoutApproval !== undefined &&
    user.role === "INSTRUCTOR"
  ) {
    await ensureCourseApprovalSchema();
    const instructor = await resolveInstructorForUser(user);
    await prisma.$executeRaw`
      UPDATE "Instructor"
      SET "canPublishWithoutApproval" = ${input.canPublishWithoutApproval === true},
          "updatedAt" = ${new Date()}
      WHERE "id" = ${instructor?.id ?? user.id}
    `;
  }

  const [mapped] = await attachInstructorPublishPermissions([
    mapAdminUser(user),
  ]);
  return mapped;
}
