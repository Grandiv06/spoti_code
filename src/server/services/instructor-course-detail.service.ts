import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import { loadInstructorCourseRow } from "@/server/services/instructor-course-draft.service";

const INSTRUCTOR_REVENUE_SHARE = 0.7;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveCourseChapters(course: Awaited<ReturnType<typeof loadInstructorCourseRow>>["course"]) {
  const fromColumn = course.chapters;
  if (Array.isArray(fromColumn) && fromColumn.length > 0) {
    return fromColumn;
  }

  const draftData = course.draftData;
  if (isRecord(draftData) && Array.isArray(draftData.chapters) && draftData.chapters.length > 0) {
    return draftData.chapters;
  }

  return Array.isArray(fromColumn) ? fromColumn : [];
}

function formatEnrollmentDate(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function getInstructorCourseDetail(user: User, courseId: string) {
  const { course } = await loadInstructorCourseRow(user, courseId);

  const [dbCourse, enrollments, reviewsCount] = await Promise.all([
    prisma.course.findUnique({
      where: { id: course.id },
      select: {
        studentsCount: true,
        revenue: true,
        rating: true,
      },
    }),
    prisma.courseEnrollment.findMany({
      where: { courseId: course.id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            status: true,
            profile: { select: { image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.comment.count({
      where: {
        courseId: course.id,
        parentId: null,
        rating: { not: null },
      },
    }),
  ]);

  const studentsCount =
    dbCourse?.studentsCount && dbCourse.studentsCount > 0 ? dbCourse.studentsCount : enrollments.length;
  const instructorRevenue = Math.round(Number(dbCourse?.revenue ?? 0) * INSTRUCTOR_REVENUE_SHARE);
  const rating = Number(dbCourse?.rating ?? 0);
  const completionRate =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, row) => sum + row.progress, 0) / enrollments.length)
      : 0;

  const students = enrollments.map((enrollment) => ({
    id: enrollment.userId,
    name: enrollment.user.fullName?.trim() || "دانشجو",
    date: formatEnrollmentDate(enrollment.createdAt),
    enrolledAt: enrollment.createdAt.toISOString(),
    progress: enrollment.progress,
    status: enrollment.user.status === "active" ? "فعال" : "غیرفعال",
    avatar: enrollment.user.profile?.image?.trim() || null,
  }));

  const chapters = resolveCourseChapters(course);

  return {
    ...course,
    chapters,
    studentsCount,
    rating,
    revenue: instructorRevenue,
    instructorRevenue,
    completionRate,
    reviewsCount,
    overview: {
      studentsCount,
      rating,
      revenue: instructorRevenue,
      completionRate,
      reviewsCount,
    },
    students,
  };
}
