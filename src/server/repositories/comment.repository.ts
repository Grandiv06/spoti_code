import { prisma } from "@/server/db/prisma";

export async function findCourseCommentsByCourseId(
  courseId: string,
  page: number,
  limit: number
) {
  const where = {
    courseId,
    parentId: null,
  };

  const [items, totalItems] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
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
  authorId?: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
}) {
  const id = `comment-${Date.now()}`;

  return prisma.comment.create({
    data: {
      id,
      courseId: input.courseId,
      content: input.content,
      rating: input.rating,
      authorId: input.authorId,
      authorName: input.authorName,
      authorRole: input.authorRole,
      authorAvatar: input.authorAvatar,
    },
    include: {
      replies: true,
    },
  });
}
