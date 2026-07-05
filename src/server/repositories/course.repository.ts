import type { CourseCategory, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

function parseJsonColumn(value: unknown): Prisma.JsonValue | null {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Prisma.JsonValue;
    } catch {
      return null;
    }
  }
  return value as Prisma.JsonValue;
}

async function attachDraftData<T extends { id: string }>(course: T) {
  const [row] = await prisma.$queryRaw<Array<{ draftData: unknown }>>`
    SELECT CAST("draftData" AS TEXT) as "draftData"
    FROM "Course"
    WHERE "id" = ${course.id}
    LIMIT 1
  `;

  return {
    ...course,
    draftData: parseJsonColumn(row?.draftData),
  };
}

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

export async function findPublishedCourseBySlug(slug: string) {
  const course = await prisma.course.findFirst({
    where: { slug, status: "published" },
    include: { instructor: true },
  });
  if (!course) return null;
  return attachDraftData(course);
}

export async function findPublishedCourseById(id: string) {
  const course = await prisma.course.findFirst({
    where: {
      status: "published",
      OR: [{ id }, { slug: id }],
    },
    include: { instructor: true },
  });
  if (!course) return null;
  return attachDraftData(course);
}

export async function findCourseByIdForAdminPreview(courseId: string) {
  const normalizedId = decodeURIComponent(courseId).trim();
  if (!normalizedId) return null;

  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: normalizedId }, { slug: normalizedId }],
    },
    include: { instructor: true },
  });
  if (!course) return null;

  const [approvalRow] = await prisma.$queryRaw<
    Array<{
      approvalStatus: string | null;
      submittedAt: Date | null;
      approvedAt: Date | null;
      rejectedAt: Date | null;
      approvalNote: string | null;
    }>
  >`
    SELECT
      "approvalStatus",
      "submittedAt",
      "approvedAt",
      "rejectedAt",
      "approvalNote"
    FROM "Course"
    WHERE "id" = ${course.id}
    LIMIT 1
  `;

  const withDraft = await attachDraftData(course);

  return {
    ...withDraft,
    approvalStatus: approvalRow?.approvalStatus ?? "draft",
    submittedAt: approvalRow?.submittedAt ?? null,
    approvedAt: approvalRow?.approvedAt ?? null,
    rejectedAt: approvalRow?.rejectedAt ?? null,
    approvalNote: approvalRow?.approvalNote ?? null,
  };
}
