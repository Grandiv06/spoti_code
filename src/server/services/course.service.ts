import type { CourseCategory, User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { toPublicCourseDetailDto } from "@/server/dto/public-course-detail.dto";
import {
  toPublicCourseListItemDto,
  type PublicCourseListItemDto,
  type PublicCourseListQueryDto,
  type PublicCourseListResponseDto,
} from "@/server/dto/public-course.dto";
import {
  findCourseByIdForAdminPreview,
  findPublishedCourseById,
  findPublishedCourseBySlug,
  findPublishedCourses,
} from "@/server/repositories/course.repository";
import {
  getDisplayDiscountMapForCourses,
  warmAutomaticDiscountCache,
} from "@/server/services/discount.service";

async function enrichPublicCourseListItems(
  items: PublicCourseListItemDto[]
): Promise<PublicCourseListItemDto[]> {
  if (items.length === 0) return items;

  try {
    const displayMap = await getDisplayDiscountMapForCourses(
      items.map((course) => ({ id: course.id, price: course.price }))
    );

    return items.map((course) => {
      const display = displayMap.get(course.id);
      if (!display || display.displayPrice >= display.originalPrice) {
        return course;
      }

      return {
        ...course,
        originalPrice: display.originalPrice,
        displayPrice: display.displayPrice,
        finalPrice: display.displayPrice,
        discountPercent: display.discountPercent,
      };
    });
  } catch (error) {
    console.error("[getPublicCourses] discount enrichment failed:", error);
    return items;
  }
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const PUBLIC_COURSES_CACHE_TTL_MS = 60_000;

type PublicCoursesCacheEntry = {
  expiresAt: number;
  value: PublicCourseListResponseDto;
};

const publicCoursesCache = new Map<string, PublicCoursesCacheEntry>();
const inflightPublicCourses = new Map<string, Promise<PublicCourseListResponseDto>>();

export function invalidatePublicCoursesCache() {
  publicCoursesCache.clear();
}

function normalizePage(value?: number) {
  return Number.isFinite(value) && (value ?? 0) > 0 ? Math.floor(value!) : 1;
}

function normalizeLimit(value?: number) {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(value!), MAX_LIMIT);
}

function publicCoursesCacheKey(query: {
  page: number;
  limit: number;
  category?: CourseCategory;
  search?: string;
}) {
  return `${query.page}|${query.limit}|${query.category ?? ""}|${query.search ?? ""}`;
}

async function fetchPublicCoursesUncached(query: {
  page: number;
  limit: number;
  category?: CourseCategory;
  search?: string;
}): Promise<PublicCourseListResponseDto> {
  // Warm the discount cache while the published-list query runs so enrichment
  // is usually an in-memory map after the DB round-trip returns.
  const [{ items, totalItems }] = await Promise.all([
    findPublishedCourses(query),
    warmAutomaticDiscountCache(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

  return {
    data: await enrichPublicCourseListItems(items.map(toPublicCourseListItemDto)),
    meta: {
      itemCount: items.length,
      totalItems,
      itemsPerPage: query.limit,
      totalPages,
      currentPage: query.page,
    },
  };
}

export async function getPublicCourses(
  query: PublicCourseListQueryDto = {}
): Promise<PublicCourseListResponseDto> {
  const page = normalizePage(query.page);
  const limit = normalizeLimit(query.limit);
  const category = query.category as CourseCategory | undefined;
  const search = query.search?.trim() || undefined;
  const normalized = { page, limit, category, search };
  const cacheKey = publicCoursesCacheKey(normalized);

  // Search results are ad-hoc — skip process cache.
  if (!search) {
    const cached = publicCoursesCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const inflight = inflightPublicCourses.get(cacheKey);
    if (inflight) {
      return inflight;
    }
  }

  const load = fetchPublicCoursesUncached(normalized)
    .then((value) => {
      if (!search) {
        publicCoursesCache.set(cacheKey, {
          value,
          expiresAt: Date.now() + PUBLIC_COURSES_CACHE_TTL_MS,
        });
      }
      return value;
    })
    .finally(() => {
      inflightPublicCourses.delete(cacheKey);
    });

  if (!search) {
    inflightPublicCourses.set(cacheKey, load);
  }

  return load;
}

export async function getPublicCourseBySlug(slug: string) {
  const course = await findPublishedCourseBySlug(slug.trim());
  if (!course) return null;
  const [enriched] = await enrichPublicCourseListItems([toPublicCourseListItemDto(course)]);
  return { data: toPublicCourseDetailDto(course, enriched) };
}

export async function getPublicCourseById(id: string) {
  const course = await findPublishedCourseById(id.trim());
  if (!course) return null;
  const [enriched] = await enrichPublicCourseListItems([toPublicCourseListItemDto(course)]);
  return { data: toPublicCourseDetailDto(course, enriched) };
}

export type AdminCoursePreviewMetaDto = {
  course: ReturnType<typeof toPublicCourseDetailDto>;
  approvalStatus: "draft" | "pending" | "approved" | "rejected";
  submittedAt?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  approvalNote?: string | null;
  instructorName: string;
};

export async function getAdminCoursePreview(user: User, courseId: string): Promise<AdminCoursePreviewMetaDto | null> {
  if (user.role !== "ADMIN") {
    throw new AuthError("دسترسی ادمین لازم است", 403);
  }

  const course = await findCourseByIdForAdminPreview(courseId);
  if (!course) return null;

  const approvalStatus = course.approvalStatus;
  const normalizedStatus =
    approvalStatus === "approved" || approvalStatus === "rejected" || approvalStatus === "draft"
      ? approvalStatus
      : "pending";

  return {
    course: toPublicCourseDetailDto(course),
    approvalStatus: normalizedStatus,
    submittedAt: course.submittedAt?.toISOString() ?? null,
    approvedAt: course.approvedAt?.toISOString() ?? null,
    rejectedAt: course.rejectedAt?.toISOString() ?? null,
    approvalNote: course.approvalNote ?? null,
    instructorName: course.instructor.name,
  };
}
