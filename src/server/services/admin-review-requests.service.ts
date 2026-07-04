import { Prisma, type User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import {
  normalizeReviewApprovalStatus,
  toAdminReviewRequestDto,
  toAdminReviewRequestsResponseDto,
  type ReviewApprovalStatus,
} from "@/server/dto/admin-review-requests.dto";

export type AdminReviewRequestFilterInput = {
  status?: string;
  courseId?: string;
  search?: string;
  sort?: string;
};

function assertAdmin(user: User) {
  if (user.role !== "ADMIN") {
    throw new AuthError("دسترسی ادمین لازم است", 403);
  }
}

function normalizeStatus(value?: string) {
  if (value === "pending" || value === "approved" || value === "rejected") return value;
  return "all";
}

function normalizeSort(value?: string) {
  return value === "oldest" ? "oldest" : "newest";
}

function reviewMatchesSearch(
  item: {
    content: string;
    authorName: string;
    course: {
      title: string;
      instructor: { name: string };
    };
  },
  search?: string
) {
  const query = search?.trim().toLowerCase();
  if (!query) return true;

  return (
    item.content.toLowerCase().includes(query) ||
    item.authorName.toLowerCase().includes(query) ||
    item.course.title.toLowerCase().includes(query) ||
    item.course.instructor.name.toLowerCase().includes(query)
  );
}

type ReviewRequestRow = {
  id: string;
  courseId: string;
  parentId: string | null;
  content: string;
  rating: number | null;
  authorName: string;
  authorAvatar: string;
  approvalStatus: string | null;
  createdAt: Date | string;
  courseTitle: string;
  instructorName: string;
};

function rowToReviewComment(row: ReviewRequestRow) {
  return {
    id: row.id,
    courseId: row.courseId,
    parentId: row.parentId,
    content: row.content,
    rating: row.rating,
    authorName: row.authorName,
    authorAvatar: row.authorAvatar,
    approvalStatus: row.approvalStatus,
    createdAt: row.createdAt,
    course: {
      title: row.courseTitle,
      instructor: {
        name: row.instructorName,
      },
    },
  };
}

function buildReviewRequestWhere(input: { status: string; courseId?: string }) {
  const clauses = [
    Prisma.sql`c."parentId" IS NULL`,
    Prisma.sql`c."rating" IS NOT NULL`,
  ];

  if (input.courseId) {
    clauses.push(Prisma.sql`c."courseId" = ${input.courseId}`);
  }

  if (input.status !== "all") {
    clauses.push(Prisma.sql`c."approvalStatus" = ${input.status}`);
  }

  return Prisma.join(clauses, " AND ");
}

async function findReviewRequestRows(input: {
  status: string;
  courseId?: string;
  sort: string;
}) {
  const where = buildReviewRequestWhere(input);
  const orderBy = input.sort === "oldest" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

  return prisma.$queryRaw<ReviewRequestRow[]>`
    SELECT
      c."id",
      c."courseId",
      c."parentId",
      c."content",
      c."rating",
      c."authorName",
      c."authorAvatar",
      c."approvalStatus",
      c."createdAt",
      co."title" as "courseTitle",
      i."name" as "instructorName"
    FROM "Comment" c
    INNER JOIN "Course" co ON co."id" = c."courseId"
    INNER JOIN "Instructor" i ON i."id" = co."instructorId"
    WHERE ${where}
    ORDER BY c."createdAt" ${orderBy}
  `;
}

export async function getAdminReviewRequests(user: User, filters: AdminReviewRequestFilterInput = {}) {
  assertAdmin(user);

  const status = normalizeStatus(filters.status);
  const sort = normalizeSort(filters.sort);
  const courseId = filters.courseId && filters.courseId !== "all" ? filters.courseId : undefined;

  const comments = (await findReviewRequestRows({ status, courseId, sort })).map(rowToReviewComment);

  const filtered = comments.filter((comment) => reviewMatchesSearch(comment, filters.search));
  const response = toAdminReviewRequestsResponseDto(filtered);
  const allRequests = toAdminReviewRequestsResponseDto(comments);

  return {
    ...response,
    courses: allRequests.courses,
    stats: allRequests.stats,
  };
}

export async function updateAdminReviewRequestStatus(
  user: User,
  reviewId: string,
  nextStatus: ReviewApprovalStatus
) {
  assertAdmin(user);

  const decodedId = decodeURIComponent(reviewId);
  const status = normalizeReviewApprovalStatus(nextStatus);
  const existing = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT "id"
    FROM "Comment"
    WHERE "id" = ${decodedId}
      AND "parentId" IS NULL
      AND "rating" IS NOT NULL
    LIMIT 1
  `;

  if (!existing.length) {
    throw new AuthError("درخواست نظر پیدا نشد", 404);
  }

  await prisma.$executeRaw`
    UPDATE "Comment"
    SET "approvalStatus" = ${status}
    WHERE "id" = ${decodedId}
  `;

  const [updated] = await prisma.$queryRaw<ReviewRequestRow[]>`
    SELECT
      c."id",
      c."courseId",
      c."parentId",
      c."content",
      c."rating",
      c."authorName",
      c."authorAvatar",
      c."approvalStatus",
      c."createdAt",
      co."title" as "courseTitle",
      i."name" as "instructorName"
    FROM "Comment" c
    INNER JOIN "Course" co ON co."id" = c."courseId"
    INNER JOIN "Instructor" i ON i."id" = co."instructorId"
    WHERE c."id" = ${decodedId}
    LIMIT 1
  `;

  const dto = updated ? toAdminReviewRequestDto(rowToReviewComment(updated)) : null;
  if (!dto) {
    throw new AuthError("درخواست نظر معتبر نیست", 404);
  }

  return dto;
}
