import type { CourseCategory } from "@prisma/client";
import { toPublicCourseDetailDto } from "@/server/dto/public-course-detail.dto";
import {
  toPublicCourseListItemDto,
  type PublicCourseListQueryDto,
  type PublicCourseListResponseDto,
} from "@/server/dto/public-course.dto";
import {
  findPublishedCourseById,
  findPublishedCourseBySlug,
  findPublishedCourses,
} from "@/server/repositories/course.repository";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function normalizePage(value?: number) {
  return Number.isFinite(value) && (value ?? 0) > 0 ? Math.floor(value!) : 1;
}

function normalizeLimit(value?: number) {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(value!), MAX_LIMIT);
}

export async function getPublicCourses(
  query: PublicCourseListQueryDto = {}
): Promise<PublicCourseListResponseDto> {
  const page = normalizePage(query.page);
  const limit = normalizeLimit(query.limit);
  const category = query.category as CourseCategory | undefined;
  const search = query.search?.trim() || undefined;

  const { items, totalItems } = await findPublishedCourses({
    page,
    limit,
    category,
    search,
  });

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    data: items.map(toPublicCourseListItemDto),
    meta: {
      itemCount: items.length,
      totalItems,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    },
  };
}

export async function getPublicCourseBySlug(slug: string) {
  const course = await findPublishedCourseBySlug(slug.trim());
  if (!course) return null;
  return { data: toPublicCourseDetailDto(course) };
}

export async function getPublicCourseById(id: string) {
  const course = await findPublishedCourseById(id.trim());
  if (!course) return null;
  return { data: toPublicCourseDetailDto(course) };
}
