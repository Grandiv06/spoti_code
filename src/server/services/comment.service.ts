import {
  toCourseCommentListItemDto,
  type CreateCourseCommentInputDto,
  type CourseCommentListResponseDto,
} from "@/server/dto/course-comment.dto";
import {
  createCourseComment,
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
  page = 1,
  limit = DEFAULT_LIMIT
): Promise<CourseCommentListResponseDto | null> {
  const courseId = await findPublishedCourseId(courseIdOrSlug);
  if (!courseId) return null;

  const normalizedPage = normalizePage(page);
  const normalizedLimit = normalizeLimit(limit);

  const { items, totalItems } = await findCourseCommentsByCourseId(
    courseId,
    normalizedPage,
    normalizedLimit
  );

  const mappedItems = items.map(toCourseCommentListItemDto);
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
      },
    },
  };
}

export async function createPublicCourseComment(input: CreateCourseCommentInputDto) {
  if (input.commentableType !== "course") {
    throw new Error("نوع نظر پشتیبانی نمی‌شود");
  }

  const courseId = await findPublishedCourseId(input.commentableId);
  if (!courseId) return null;

  const comment = await createCourseComment({
    courseId,
    content: input.content.trim(),
    rating: input.rating,
    authorName: "کاربر اسپاتی‌کد",
    authorRole: "دانشجو",
    authorAvatar: "/images/student1.jpg",
  });

  return {
    data: toCourseCommentListItemDto({ ...comment, replies: [] }),
  };
}
