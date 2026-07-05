import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function findCourseCommentsByCourseId(
  courseId: string,
  limit: number,
  options?: { page?: number; offset?: number }
) {
  const skip =
    typeof options?.offset === "number" && options.offset >= 0
      ? options.offset
      : ((options?.page ?? 1) - 1) * limit;

  const baseWhere = Prisma.sql`
    "courseId" = ${courseId}
    AND "parentId" IS NULL
    AND "rating" IS NOT NULL
    AND (
      "approvalStatus" = 'approved'
      OR EXISTS (
        SELECT 1
        FROM "Comment" AS instructor_reply
        WHERE instructor_reply."parentId" = "Comment"."id"
          AND instructor_reply."isInstructorReply" = true
      )
    )
  `;

  const [idRows, countRows] = await Promise.all([
    prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id"
      FROM "Comment"
      WHERE ${baseWhere}
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
      OFFSET ${skip}
    `,
    prisma.$queryRaw<Array<{ total: bigint | number }>>`
      SELECT COUNT(*) as "total"
      FROM "Comment"
      WHERE ${baseWhere}
    `,
  ]);

  const ids = idRows.map((row) => row.id);
  const items = ids.length
    ? await prisma.comment.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          replies: {
            orderBy: { createdAt: "asc" },
          },
        },
      })
    : [];

  const order = new Map(ids.map((id, index) => [id, index]));
  const totalItems = Number(countRows[0]?.total ?? 0);

  return {
    items: items.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)),
    totalItems,
  };
}

export async function findCourseCommentsByCourseIdLegacy(
  courseId: string,
  limit: number,
  options?: { page?: number; offset?: number }
) {
  const where = {
    courseId,
    parentId: null,
  };

  const skip =
    typeof options?.offset === "number" && options.offset >= 0
      ? options.offset
      : ((options?.page ?? 1) - 1) * limit;

  const [items, totalItems] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.comment.count({ where }),
  ]);

  return { items, totalItems };
}

export async function findPublishedCourseId(courseIdOrSlug: string) {
  const course = await prisma.course.findFirst({
    where: {
      status: "published",
      OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }],
    },
    select: { id: true },
  });

  return course?.id ?? null;
}

export async function createCourseComment(input: {
  courseId: string;
  content: string;
  rating?: number;
  parentId?: string;
  authorId?: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  isInstructorReply?: boolean;
}) {
  const id = `comment-${Date.now()}`;

  const comment = await prisma.comment.create({
    data: {
      id,
      courseId: input.courseId,
      parentId: input.parentId,
      content: input.content,
      rating: input.parentId ? null : input.rating,
      authorId: input.authorId,
      authorName: input.authorName,
      authorRole: input.authorRole,
      authorAvatar: input.authorAvatar,
      isInstructorReply: input.isInstructorReply ?? false,
    },
    include: {
      replies: true,
    },
  });

  if (!input.parentId) {
    await prisma.$executeRaw`
      UPDATE "Comment"
      SET "approvalStatus" = 'pending'
      WHERE "id" = ${comment.id}
    `;
  }

  return comment;
}

export async function findRootCourseComment(commentId: string, courseId: string) {
  return prisma.comment.findFirst({
    where: {
      id: commentId,
      courseId,
      parentId: null,
      rating: { not: null },
    },
    select: {
      id: true,
    },
  });
}
