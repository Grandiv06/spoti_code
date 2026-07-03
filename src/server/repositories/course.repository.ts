import type { CourseCategory } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export interface FindPublishedCoursesParams {
  page: number;
  limit: number;
  category?: CourseCategory;
  search?: string;
}

export async function findPublishedCourses({
  page,
  limit,
  category,
  search,
}: FindPublishedCoursesParams) {
  const where = {
    status: "published" as const,
    ...(category ? { category } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { shortDescription: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.course.findMany({
      where,
      include: { instructor: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({ where }),
  ]);

  return { items, totalItems };
}
