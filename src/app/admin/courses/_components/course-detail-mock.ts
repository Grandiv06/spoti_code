import { Course, initialCoursesData } from "./types";

const DETAIL_CACHE_PREFIX = "admin-course-detail-";
const PENDING_DETAIL_KEY = "admin-course-detail-pending";

export function buildMockCourseDetail(course: Course): Course {
  const template = initialCoursesData[0];

  return {
    ...template,
    ...course,
    id: course.id,
    title: course.title,
    instructor: course.instructor || template.instructor,
    category: course.category || template.category,
    students: course.students,
    completion: course.completion || template.completion,
    revenue: course.revenue,
    status: course.status || template.status,
    price: course.price || template.price,
    publishDate: course.publishDate || template.publishDate,
    updatedAt: course.updatedAt || template.updatedAt,
    shortDescription:
      course.shortDescription ||
      `نمایش موقت جزئیات دوره «${course.title}» با داده‌های نمونه.`,
    description:
      course.description ||
      `این صفحه فعلاً با داده mock نمایش داده می‌شود. ${template.description}`,
    level: course.level || template.level,
    duration: course.duration !== "—" ? course.duration : template.duration,
    coverImage: course.coverImage || template.coverImage,
    tags: course.tags.length > 0 ? course.tags : [...template.tags],
    prerequisites: course.prerequisites.length > 0 ? course.prerequisites : [...template.prerequisites],
    chapters: course.chapters.length > 0 ? course.chapters : template.chapters,
    studentsList:
      course.studentsList.length > 0
        ? course.studentsList
        : template.studentsList.map((student, index) => ({
            ...student,
            id: `${course.id}-student-${index + 1}`,
            progress: course.completion || student.progress,
          })),
    reviews:
      course.reviews.length > 0
        ? course.reviews
        : template.reviews.map((review, index) => ({
            ...review,
            id: `${course.id}-review-${index + 1}`,
            comment: `نظر نمونه برای دوره «${course.title}»: ${review.comment}`,
          })),
    refundRate: course.refundRate || template.refundRate,
  };
}

export function cacheAdminCourseDetail(course: Course) {
  if (typeof window === "undefined" || !course.id) return;
  const serialized = JSON.stringify(course);
  sessionStorage.setItem(PENDING_DETAIL_KEY, serialized);
  sessionStorage.setItem(`${DETAIL_CACHE_PREFIX}${course.id}`, serialized);
}

export function readAdminCourseDetail(courseId: string): Course | null {
  if (typeof window === "undefined" || !courseId) return null;

  try {
    const pendingRaw = sessionStorage.getItem(PENDING_DETAIL_KEY);
    if (pendingRaw) {
      const pending = JSON.parse(pendingRaw) as Course;
      if (pending.id === courseId) {
        return pending;
      }
    }

    const raw = sessionStorage.getItem(`${DETAIL_CACHE_PREFIX}${courseId}`);
    if (!raw) return null;
    return JSON.parse(raw) as Course;
  } catch {
    return null;
  }
}

export function buildMockCourseDetailById(courseId: string, partial?: Partial<Course>): Course {
  const template = initialCoursesData[0];

  return buildMockCourseDetail({
    ...template,
    ...partial,
    id: courseId,
    title: partial?.title || `دوره ${courseId.slice(0, 8)}`,
    instructor: partial?.instructor || template.instructor,
    category: partial?.category || template.category,
    students: partial?.students ?? 0,
    completion: partial?.completion ?? template.completion,
    revenue: partial?.revenue ?? 0,
    status: partial?.status || template.status,
    price: partial?.price ?? template.price,
    publishDate: partial?.publishDate || template.publishDate,
    updatedAt: partial?.updatedAt || template.updatedAt,
    shortDescription: partial?.shortDescription || "",
    description: partial?.description || "",
    level: partial?.level || template.level,
    duration: partial?.duration || template.duration,
    tags: partial?.tags || [],
    prerequisites: partial?.prerequisites || [],
    chapters: partial?.chapters || [],
    studentsList: partial?.studentsList || [],
    reviews: partial?.reviews || [],
    refundRate: partial?.refundRate ?? template.refundRate,
  });
}
