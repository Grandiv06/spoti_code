import type { DiscountApplyType, DiscountScope, DiscountType, User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";

export type DiscountDto = {
  id: string;
  title: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  scope: DiscountScope;
  selectedCourseIds: string[];
  startAt: string | null;
  endAt: string | null;
  usageLimit: number | null;
  usagePerUser: number | null;
  applyType: DiscountApplyType;
  isEnabled: boolean;
  usedCount: number;
};

export type CartLineItem = {
  courseId: string;
  price: number;
};

export type AppliedDiscountResult = {
  code: string;
  title: string;
  applyType: DiscountApplyType;
  discountAmount: number;
  lineDiscounts: Record<string, number>;
  eligibleCourseIds: string[];
};

export type DiscountPreviewResult = {
  subtotal: number;
  discountAmount: number;
  total: number;
  applied: AppliedDiscountResult | null;
};

type DiscountInput = {
  title?: string;
  code?: string;
  type?: string;
  discountType?: string;
  value?: number;
  discountValue?: number;
  scope?: string;
  selectedCourseIds?: string[];
  courseIds?: string[];
  applyType?: string;
  startsAt?: string;
  startAt?: string;
  expiresAt?: string;
  endAt?: string;
  isActive?: boolean;
  isEnabled?: boolean;
  globalUsageLimit?: number;
  usageLimit?: number;
  perUserUsageLimit?: number;
  usagePerUser?: number;
};

type DiscountWithCourses = {
  id: string;
  title: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  scope: DiscountScope;
  applyType: DiscountApplyType;
  isEnabled: boolean;
  startsAt: Date | null;
  expiresAt: Date | null;
  globalUsageLimit: number | null;
  perUserUsageLimit: number | null;
  usedCount: number;
  courses: { courseId: string }[];
};

function assertAdmin(user: User) {
  if (user.role !== "ADMIN") {
    throw new AuthError("دسترسی ادمین لازم است", 403);
  }
}

function normalizeDiscountType(value: unknown): DiscountType {
  const raw = String(value ?? "percentage").toLowerCase();
  if (["fixed", "amount", "money"].includes(raw)) return "fixed";
  return "percentage";
}

function normalizeScope(value: unknown, courseIds: string[]): DiscountScope {
  const raw = String(value ?? "").toLowerCase();
  if (raw === "specific" || courseIds.length > 0) return "specific";
  return "all";
}

function normalizeApplyType(value: unknown): DiscountApplyType {
  const raw = String(value ?? "user").toLowerCase();
  if (["admin", "automatic", "auto"].includes(raw)) return "admin";
  if (raw === "both") return "both";
  return "user";
}

function normalizeCourseIds(input: DiscountInput): string[] {
  const raw = input.selectedCourseIds ?? input.courseIds ?? [];
  return [...new Set(raw.map((id) => String(id).trim()).filter(Boolean))];
}

function normalizeDiscountInput(input: DiscountInput) {
  const discountType = normalizeDiscountType(input.discountType ?? input.type);
  const discountValue = Math.round(Number(input.discountValue ?? input.value ?? 0));
  const selectedCourseIds = normalizeCourseIds(input);
  const scope = normalizeScope(input.scope, selectedCourseIds);
  const startsAtRaw = input.startsAt ?? input.startAt;
  const expiresAtRaw = input.expiresAt ?? input.endAt;

  return {
    title: String(input.title ?? "").trim() || "بدون عنوان",
    code: String(input.code ?? "").trim().toUpperCase(),
    discountType,
    discountValue,
    scope,
    selectedCourseIds: scope === "all" ? [] : selectedCourseIds,
    applyType: normalizeApplyType(input.applyType),
    isEnabled: input.isEnabled ?? input.isActive ?? true,
    startsAt: startsAtRaw ? new Date(startsAtRaw) : null,
    expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    globalUsageLimit:
      input.globalUsageLimit ?? input.usageLimit
        ? Math.round(Number(input.globalUsageLimit ?? input.usageLimit))
        : null,
    perUserUsageLimit:
      input.perUserUsageLimit ?? input.usagePerUser
        ? Math.round(Number(input.perUserUsageLimit ?? input.usagePerUser))
        : null,
  };
}

function toDto(discount: DiscountWithCourses): DiscountDto {
  return {
    id: discount.id,
    title: discount.title,
    code: discount.code,
    discountType: discount.discountType,
    discountValue: discount.discountValue,
    scope: discount.scope,
    selectedCourseIds: discount.courses.map((row) => row.courseId),
    startAt: discount.startsAt?.toISOString() ?? null,
    endAt: discount.expiresAt?.toISOString() ?? null,
    usageLimit: discount.globalUsageLimit,
    usagePerUser: discount.perUserUsageLimit,
    applyType: discount.applyType,
    isEnabled: discount.isEnabled,
    usedCount: discount.usedCount,
  };
}

function isWithinSchedule(discount: DiscountWithCourses, now = new Date()) {
  if (discount.startsAt && now < discount.startsAt) return false;
  if (discount.expiresAt && now > discount.expiresAt) return false;
  return true;
}

function isDiscountUsable(discount: DiscountWithCourses, now = new Date()) {
  if (!discount.isEnabled) return false;
  if (!isWithinSchedule(discount, now)) return false;
  if (discount.globalUsageLimit != null && discount.usedCount >= discount.globalUsageLimit) return false;
  return true;
}

function isCourseEligible(discount: DiscountWithCourses, courseId: string) {
  if (discount.scope === "all") return true;
  return discount.courses.some((row) => row.courseId === courseId);
}

function supportsManualEntry(applyType: DiscountApplyType) {
  return applyType === "user" || applyType === "both";
}

function supportsAutomaticApply(applyType: DiscountApplyType) {
  return applyType === "admin" || applyType === "both";
}

export type CourseDisplayDiscount = {
  originalPrice: number;
  displayPrice: number;
  discountPercent: number | null;
};

function calculateDiscountedPrice(basePrice: number, discount: DiscountWithCourses) {
  if (basePrice <= 0) return 0;
  if (discount.discountType === "percentage") {
    const rate = Math.min(Math.max(discount.discountValue, 0), 100) / 100;
    return Math.max(Math.round(basePrice * (1 - rate)), 0);
  }
  return Math.max(basePrice - Math.min(discount.discountValue, basePrice), 0);
}

function pickBestDisplayDiscount(
  courseId: string,
  basePrice: number,
  automaticDiscounts: DiscountWithCourses[]
): CourseDisplayDiscount {
  let displayPrice = basePrice;
  let discountPercent: number | null = null;

  for (const discount of automaticDiscounts) {
    if (!supportsAutomaticApply(discount.applyType)) continue;
    if (!isCourseEligible(discount, courseId)) continue;

    const nextPrice = calculateDiscountedPrice(basePrice, discount);
    if (nextPrice >= displayPrice) continue;

    displayPrice = nextPrice;
    discountPercent =
      discount.discountType === "percentage"
        ? discount.discountValue
        : basePrice > 0
          ? Math.round(((basePrice - nextPrice) / basePrice) * 100)
          : null;
  }

  return {
    originalPrice: basePrice,
    displayPrice,
    discountPercent: displayPrice < basePrice ? discountPercent : null,
  };
}

export async function getDisplayDiscountMapForCourses(
  courses: { id: string; price: number }[]
): Promise<Map<string, CourseDisplayDiscount>> {
  const automaticDiscounts = await loadActiveAutomaticDiscounts();
  const map = new Map<string, CourseDisplayDiscount>();

  for (const course of courses) {
    map.set(course.id, pickBestDisplayDiscount(course.id, course.price, automaticDiscounts));
  }

  return map;
}

export async function buildCheckoutLineItems(courses: { id: string; price: number }[]) {
  const displayMap = await getDisplayDiscountMapForCourses(courses);
  return courses.map((course) => ({
    courseId: course.id,
    price: displayMap.get(course.id)?.displayPrice ?? course.price,
  }));
}

function calculateLineDiscounts(
  items: CartLineItem[],
  discount: DiscountWithCourses
): { lineDiscounts: Record<string, number>; eligibleCourseIds: string[]; discountAmount: number } {
  const eligibleItems = items.filter((item) => isCourseEligible(discount, item.courseId));
  const eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + item.price, 0);
  const lineDiscounts: Record<string, number> = {};

  if (eligibleItems.length === 0 || eligibleSubtotal <= 0) {
    return { lineDiscounts, eligibleCourseIds: [], discountAmount: 0 };
  }

  if (discount.discountType === "percentage") {
    const rate = Math.min(Math.max(discount.discountValue, 0), 100) / 100;
    for (const item of eligibleItems) {
      lineDiscounts[item.courseId] = Math.round(item.price * rate);
    }
  } else {
    const totalFixed = Math.min(Math.max(discount.discountValue, 0), eligibleSubtotal);
    let remaining = totalFixed;
    eligibleItems.forEach((item, index) => {
      if (index === eligibleItems.length - 1) {
        lineDiscounts[item.courseId] = remaining;
        return;
      }
      const share = Math.floor((item.price / eligibleSubtotal) * totalFixed);
      lineDiscounts[item.courseId] = share;
      remaining -= share;
    });
  }

  const discountAmount = Object.values(lineDiscounts).reduce((sum, value) => sum + value, 0);
  return {
    lineDiscounts,
    eligibleCourseIds: eligibleItems.map((item) => item.courseId),
    discountAmount,
  };
}

async function getUserUsageCount(discountId: string, userId: string) {
  return prisma.discountCodeUsage.count({
    where: { discountCodeId: discountId, userId },
  });
}

async function assertUserCanUseDiscount(discount: DiscountWithCourses, userId: string) {
  if (discount.perUserUsageLimit != null) {
    const userUsage = await getUserUsageCount(discount.id, userId);
    if (userUsage >= discount.perUserUsageLimit) {
      throw new AuthError("سقف استفاده از این کد تخفیف برای شما تکمیل شده است", 400);
    }
  }
}

async function loadDiscountByCode(code: string) {
  return prisma.discountCode.findUnique({
    where: { code: code.trim().toUpperCase() },
    include: { courses: { select: { courseId: true } } },
  });
}

async function loadActiveAutomaticDiscounts() {
  const now = new Date();
  const discounts = await prisma.discountCode.findMany({
    where: {
      isEnabled: true,
      applyType: { in: ["admin", "both"] },
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] }],
    },
    include: { courses: { select: { courseId: true } } },
    orderBy: { createdAt: "desc" },
  });

  return discounts.filter((discount) => isDiscountUsable(discount, now));
}

export async function getAdminDiscounts(adminUser: User) {
  assertAdmin(adminUser);

  const discounts = await prisma.discountCode.findMany({
    include: { courses: { select: { courseId: true } } },
    orderBy: { createdAt: "desc" },
  });

  return discounts.map(toDto);
}

export async function getAdminDiscountCourseOptions(adminUser: User) {
  assertAdmin(adminUser);

  return prisma.course.findMany({
    where: { status: "published" },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });
}

export async function createAdminDiscount(adminUser: User, rawInput: unknown) {
  assertAdmin(adminUser);
  const input = normalizeDiscountInput((rawInput ?? {}) as DiscountInput);

  if (!input.code) {
    throw new AuthError("کد تخفیف الزامی است", 400);
  }
  if (!Number.isFinite(input.discountValue) || input.discountValue <= 0) {
    throw new AuthError("مقدار تخفیف نامعتبر است", 400);
  }
  if (input.discountType === "percentage" && input.discountValue > 100) {
    throw new AuthError("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد", 400);
  }
  if (input.scope === "specific" && input.selectedCourseIds.length === 0) {
    throw new AuthError("حداقل یک دوره باید انتخاب شود", 400);
  }

  const existing = await prisma.discountCode.findUnique({ where: { code: input.code } });
  if (existing) {
    throw new AuthError("این کد تخفیف قبلاً ثبت شده است", 409);
  }

  const id = `DSC-${Date.now()}`;
  const created = await prisma.discountCode.create({
    data: {
      id,
      title: input.title,
      code: input.code,
      discountType: input.discountType,
      discountValue: input.discountValue,
      scope: input.scope,
      applyType: input.applyType,
      isEnabled: input.isEnabled,
      startsAt: input.startsAt,
      expiresAt: input.expiresAt,
      globalUsageLimit: input.globalUsageLimit,
      perUserUsageLimit: input.perUserUsageLimit,
      courses:
        input.scope === "specific"
          ? {
              create: input.selectedCourseIds.map((courseId) => ({ courseId })),
            }
          : undefined,
    },
    include: { courses: { select: { courseId: true } } },
  });

  return toDto(created);
}

export async function updateAdminDiscount(adminUser: User, discountId: string, rawInput: unknown) {
  assertAdmin(adminUser);
  const input = normalizeDiscountInput((rawInput ?? {}) as DiscountInput);

  const existing = await prisma.discountCode.findUnique({
    where: { id: discountId },
    include: { courses: true },
  });
  if (!existing) {
    throw new AuthError("کد تخفیف یافت نشد", 404);
  }

  if (input.code && input.code !== existing.code) {
    const duplicate = await prisma.discountCode.findUnique({ where: { code: input.code } });
    if (duplicate) {
      throw new AuthError("این کد تخفیف قبلاً ثبت شده است", 409);
    }
  }

  if (input.scope === "specific" && input.selectedCourseIds.length === 0) {
    throw new AuthError("حداقل یک دوره باید انتخاب شود", 400);
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.discountCodeCourse.deleteMany({ where: { discountCodeId: discountId } });

    return tx.discountCode.update({
      where: { id: discountId },
      data: {
        title: input.title || existing.title,
        code: input.code || existing.code,
        discountType: input.discountType,
        discountValue: input.discountValue,
        scope: input.scope,
        applyType: input.applyType,
        isEnabled: input.isEnabled,
        startsAt: input.startsAt,
        expiresAt: input.expiresAt,
        globalUsageLimit: input.globalUsageLimit,
        perUserUsageLimit: input.perUserUsageLimit,
        courses:
          input.scope === "specific"
            ? {
                create: input.selectedCourseIds.map((courseId) => ({ courseId })),
              }
            : undefined,
      },
      include: { courses: { select: { courseId: true } } },
    });
  });

  return toDto(updated);
}

export async function deleteAdminDiscount(adminUser: User, discountId: string) {
  assertAdmin(adminUser);

  const existing = await prisma.discountCode.findUnique({ where: { id: discountId } });
  if (!existing) {
    throw new AuthError("کد تخفیف یافت نشد", 404);
  }

  await prisma.discountCode.delete({ where: { id: discountId } });
  return { success: true };
}

export async function previewCartDiscount(
  user: User | null,
  items: CartLineItem[],
  manualCode?: string | null
): Promise<DiscountPreviewResult> {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  if (subtotal <= 0 || items.length === 0) {
    return { subtotal: 0, discountAmount: 0, total: 0, applied: null };
  }

  const normalizedCode = manualCode?.trim().toUpperCase() || null;

  if (!normalizedCode) {
    return {
      subtotal,
      discountAmount: 0,
      total: subtotal,
      applied: null,
    };
  }

  const discount = await loadDiscountByCode(normalizedCode);
  if (!discount) {
    throw new AuthError("کد تخفیف معتبر نیست", 400);
  }
  if (!isDiscountUsable(discount)) {
    throw new AuthError("کد تخفیف منقضی یا غیرفعال است", 400);
  }
  if (!supportsManualEntry(discount.applyType)) {
    throw new AuthError("این کد تخفیف باید به‌صورت خودکار اعمال شود", 400);
  }
  if (user) {
    await assertUserCanUseDiscount(discount, user.id);
  }

  const { lineDiscounts, eligibleCourseIds, discountAmount } = calculateLineDiscounts(items, discount);
  if (eligibleCourseIds.length === 0) {
    throw new AuthError("این کد تخفیف برای دوره‌های انتخاب‌شده قابل استفاده نیست", 400);
  }

  return {
    subtotal,
    discountAmount,
    total: Math.max(subtotal - discountAmount, 0),
    applied: {
      code: discount.code,
      title: discount.title,
      applyType: discount.applyType,
      discountAmount,
      lineDiscounts,
      eligibleCourseIds,
    },
  };
}

export async function resolveCheckoutDiscount(
  user: User,
  items: CartLineItem[],
  manualCode?: string | null
) {
  const preview = await previewCartDiscount(user, items, manualCode);
  if (!preview.applied) {
    return {
      ...preview,
      discountId: null as string | null,
      lineDiscounts: {} as Record<string, number>,
    };
  }

  const discount = await loadDiscountByCode(preview.applied.code);
  if (!discount) {
    throw new AuthError("کد تخفیف معتبر نیست", 400);
  }

  await assertUserCanUseDiscount(discount, user.id);

  return {
    ...preview,
    discountId: discount.id,
    lineDiscounts: preview.applied.lineDiscounts,
  };
}

export async function recordDiscountUsage(discountId: string, userId: string, orderId?: string) {
  await prisma.$transaction([
    prisma.discountCodeUsage.create({
      data: {
        id: `DCU-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        discountCodeId: discountId,
        userId,
        orderId: orderId ?? null,
      },
    }),
    prisma.discountCode.update({
      where: { id: discountId },
      data: { usedCount: { increment: 1 } },
    }),
  ]);
}
