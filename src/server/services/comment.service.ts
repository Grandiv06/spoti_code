import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import {
  toCourseCommentListItemDto,
  type CreateCourseCommentInputDto,
  type CourseCommentListResponseDto,
} from "@/server/dto/course-comment.dto";
import {
  createCourseComment,
  findRootCourseComment,
  findCourseCommentsByCourseId,
  findPublishedCourseId,
} from "@/server/repositories/comment.repository";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function normalizePage(value?: number) {
  return Number.isFinite(value) && (value ?? 0) > 0 ? Math.floor(value!) : 1;
}

function normalizeLimit(value?: number) {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(value!), MAX_LIMIT);
}

export async function getCourseComments(
  courseIdOrSlug: string,
  options: { page?: number; limit?: number; offset?: number } = {}
): Promise<CourseCommentListResponseDto | null> {
  const courseId = await findPublishedCourseId(courseIdOrSlug);
  if (!courseId) return null;

  const normalizedPage = normalizePage(options.page);
  const normalizedLimit = normalizeLimit(options.limit);
  const normalizedOffset =
    typeof options.offset === "number" && options.offset >= 0
      ? Math.floor(options.offset)
      : undefined;

  const { items, totalItems } = await findCourseCommentsByCourseId(
    courseId,
    normalizedLimit,
    normalizedOffset !== undefined
      ? { offset: normalizedOffset }
      : { page: normalizedPage }
  );

  const mappedItems = items.map(toCourseCommentListItemDto);
  const skip =
    normalizedOffset ?? (normalizedPage - 1) * normalizedLimit;
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedLimit));

  return {
    data: {
      items: mappedItems,
      total: totalItems,
      meta: {
        itemCount: mappedItems.length,
        totalItems,
        itemsPerPage: normalizedLimit,
        totalPages,
        currentPage: normalizedPage,
        offset: skip,
      },
    },
  };
}

export async function createPublicCourseComment(input: CreateCourseCommentInputDto) {
  return createPublicCourseCommentForUser(input);
}

function readAuthorRole(user?: User | null) {
  if (user?.role === "ADMIN") return "ادمین";
  if (user?.role === "INSTRUCTOR") return "مدرس";
  return "دانشجو";
}

function canCreateStandaloneCourseReview(user?: User | null) {
  return user?.role !== "ADMIN" && user?.role !== "INSTRUCTOR";
}

export async function createPublicCourseCommentForUser(input: CreateCourseCommentInputDto, user?: User | null) {
  if (input.commentableType !== "course") {
    throw new Error("نوع نظر پشتیبانی نمی‌شود");
  }

  const courseId = await findPublishedCourseId(input.commentableId);
  if (!courseId) return null;

  const parentId = typeof input.parentId === "string" && input.parentId.trim() ? input.parentId.trim() : undefined;

  if (!parentId && !canCreateStandaloneCourseReview(user)) {
    throw new AuthError("ادمین و مدرس امکان ثبت نظر مستقل برای دوره را ندارند و فقط می‌توانند به نظرها پاسخ دهند.", 403);
  }

  if (parentId) {
    const parent = await findRootCourseComment(parentId, courseId);
    if (!parent) {
      throw new AuthError("نظر اصلی برای پاسخ پیدا نشد", 404);
    }
  }

  const comment = await createCourseComment({
    courseId,
    content: input.content.trim(),
    parentId,
    rating: parentId ? undefined : input.rating,
    authorId: user?.id,
    authorName: user?.fullName?.trim() || "کاربر اسپاتی‌کد",
    authorRole: readAuthorRole(user),
    authorAvatar: "/images/student1.jpg",
    isInstructorReply: user?.role === "ADMIN" || user?.role === "INSTRUCTOR",
  });

  return {
    data: toCourseCommentListItemDto({ ...comment, replies: [] }),
  };
}
