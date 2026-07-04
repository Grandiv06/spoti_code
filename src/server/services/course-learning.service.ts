import type { Comment, Course, Instructor, User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import {
  buildCourseLearningDto,
  calculateProgressAfterLesson,
  findLearningLesson,
  readQaQuestionText,
  type CourseLearningQaMessageDto,
  type CourseLearningQaThreadDto,
  type CreateCourseLearningQaDto,
} from "@/server/dto/course-learning.dto";
import { parseLessonQaReplyPayload } from "@/server/dto/instructor-questions.dto";
import { prisma } from "@/server/db/prisma";

type CourseWithInstructor = Course & { instructor: Instructor };
type QaComment = Comment & {
  replies: Comment[];
};

type QaPayload = {
  kind: "lesson-qa";
  lessonId: string;
  text: string;
  attachments?: unknown[];
};

function assertLearnerAccess(user: User, course: CourseWithInstructor, enrollment: { progress: number } | null) {
  if (user.role === "ADMIN") return;
  if (user.role === "INSTRUCTOR" && course.instructor.name === user.fullName) return;
  if (enrollment) return;
  throw new AuthError("برای مشاهده این دوره باید آن را خریداری کرده باشید", 403);
}

async function findCourseForLearning(courseIdOrSlug: string): Promise<CourseWithInstructor | null> {
  const decoded = decodeURIComponent(courseIdOrSlug).trim();
  if (!decoded) return null;

  return prisma.course.findFirst({
    where: {
      OR: [{ id: decoded }, { slug: decoded }],
    },
    include: { instructor: true },
  });
}

async function getEnrollment(user: User, courseId: string) {
  return prisma.courseEnrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    select: {
      id: true,
      progress: true,
    },
  });
}

async function requireLearningCourse(user: User, courseIdOrSlug: string) {
  const course = await findCourseForLearning(courseIdOrSlug);
  if (!course) {
    throw new AuthError("دوره پیدا نشد", 404);
  }

  const enrollment = await getEnrollment(user, course.id);
  assertLearnerAccess(user, course, enrollment);

  return { course, enrollment };
}

function parseQaPayload(content: string): QaPayload | null {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed as { kind?: unknown }).kind === "lesson-qa"
    ) {
      const row = parsed as { lessonId?: unknown; text?: unknown; attachments?: unknown };
      const lessonId = typeof row.lessonId === "string" ? row.lessonId : "";
      const text = typeof row.text === "string" ? row.text : "";
      if (!lessonId || !text.trim()) return null;
      return {
        kind: "lesson-qa",
        lessonId,
        text,
        attachments: Array.isArray(row.attachments) ? row.attachments : undefined,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function stringifyQaPayload(payload: Omit<QaPayload, "kind">) {
  return JSON.stringify({
    kind: "lesson-qa",
    ...payload,
  });
}

function normalizeAttachment(value: unknown, index: number) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const name = typeof row.name === "string" ? row.name : typeof row.fileName === "string" ? row.fileName : "";
  if (!name.trim()) return null;

  return {
    id: typeof row.id === "string" ? row.id : `att-${index + 1}`,
    name,
    size: typeof row.size === "number" ? row.size : Number(row.size ?? 0),
    type: typeof row.type === "string" ? row.type : "application/octet-stream",
    previewUrl: typeof row.previewUrl === "string" ? row.previewUrl : typeof row.url === "string" ? row.url : undefined,
    caption: typeof row.caption === "string" ? row.caption : undefined,
  };
}

function commentToMessage(comment: Comment, qaId: string, role: CourseLearningQaMessageDto["senderType"], payloadText?: string, payloadAttachments?: unknown[]) {
  const replyPayload = payloadText ? null : parseLessonQaReplyPayload(comment.content);
  const attachments = (payloadAttachments ?? replyPayload?.attachments ?? []).map(normalizeAttachment).filter(Boolean) as NonNullable<CourseLearningQaMessageDto["attachments"]>;

  return {
    id: comment.id,
    qaId,
    senderType: role,
    senderName: comment.authorName,
    body: payloadText ?? replyPayload?.text ?? comment.content,
    createdAt: comment.createdAt.toISOString(),
    ...(attachments.length ? { attachments } : {}),
  } satisfies CourseLearningQaMessageDto;
}

function readLessonId(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildQaThread(comments: QaComment[], instructor: Instructor, lessonId?: string): CourseLearningQaThreadDto {
  const items: CourseLearningQaMessageDto[] = [];

  for (const comment of comments) {
    const payload = parseQaPayload(comment.content);
    if (!payload) continue;
    if (lessonId && payload.lessonId !== lessonId) continue;
    items.push(commentToMessage(comment, comment.id, "user", payload.text, payload.attachments));
    for (const reply of comment.replies) {
      items.push(commentToMessage(reply, comment.id, reply.isInstructorReply ? "instructor" : "user"));
    }
  }

  items.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

  return {
    items,
    instructor: {
      id: instructor.id,
      name: instructor.name,
      fullName: instructor.name,
      avatar: instructor.avatar,
    },
    meta: {
      currentPage: 1,
      totalPages: 1,
      totalItems: items.length,
    },
  };
}

export async function getCourseLearningPage(user: User, courseIdOrSlug: string) {
  const { course, enrollment } = await requireLearningCourse(user, courseIdOrSlug);
  return buildCourseLearningDto(course, enrollment?.progress ?? 0);
}

export async function getCourseLearningLesson(user: User, courseIdOrSlug: string, lessonId: string) {
  const { course, enrollment } = await requireLearningCourse(user, courseIdOrSlug);
  const lesson = findLearningLesson(course, decodeURIComponent(lessonId), enrollment?.progress ?? 0);
  if (!lesson) {
    throw new AuthError("درس پیدا نشد", 404);
  }
  return lesson;
}

export async function completeCourseLearningLesson(user: User, courseIdOrSlug: string, lessonId: string) {
  const { course, enrollment } = await requireLearningCourse(user, courseIdOrSlug);
  if (!enrollment) {
    throw new AuthError("برای ثبت پیشرفت باید در دوره ثبت‌نام کرده باشید", 403);
  }

  const decodedLessonId = decodeURIComponent(lessonId);
  const lesson = findLearningLesson(course, decodedLessonId, enrollment.progress);
  if (!lesson) {
    throw new AuthError("درس پیدا نشد", 404);
  }

  const progress = calculateProgressAfterLesson(course, decodedLessonId, enrollment.progress);
  await prisma.courseEnrollment.update({
    where: { id: enrollment.id },
    data: { progress },
  });

  return {
    id: decodedLessonId,
    isCompleted: true,
    completed: true,
    isWatched: true,
    watched: true,
    progress,
  };
}

export async function getCourseLearningLessonQa(user: User, courseIdOrSlug: string, lessonId: string) {
  const { course } = await requireLearningCourse(user, courseIdOrSlug);
  const decodedLessonId = decodeURIComponent(lessonId);

  const comments = await prisma.comment.findMany({
    where: {
      courseId: course.id,
      authorId: user.id,
      parentId: null,
      rating: null,
    },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return buildQaThread(comments, course.instructor, decodedLessonId);
}

export async function getCourseLearningCourseQa(user: User, courseIdOrSlug: string) {
  const { course } = await requireLearningCourse(user, courseIdOrSlug);

  const comments = await prisma.comment.findMany({
    where: {
      courseId: course.id,
      authorId: user.id,
      parentId: null,
      rating: null,
    },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return buildQaThread(comments, course.instructor);
}

export async function createCourseLearningLessonQa(
  user: User,
  courseIdOrSlug: string,
  lessonId: string,
  input: CreateCourseLearningQaDto
) {
  const { course } = await requireLearningCourse(user, courseIdOrSlug);
  const decodedLessonId = decodeURIComponent(lessonId);
  const text = readQaQuestionText(input);
  if (!text.trim()) {
    throw new AuthError("متن سوال الزامی است", 400);
  }

  await prisma.comment.create({
    data: {
      id: `qa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      courseId: course.id,
      authorId: user.id,
      authorName: user.fullName?.trim() || "کاربر اسپاتی‌کد",
      authorRole: "دانشجو",
      authorAvatar: "/images/student1.jpg",
      rating: null,
      content: stringifyQaPayload({
        lessonId: decodedLessonId,
        text,
        attachments: Array.isArray(input.attachments) ? input.attachments : undefined,
      }),
    },
  });

  return getCourseLearningLessonQa(user, course.id, decodedLessonId);
}

export async function createCourseLearningCourseQa(
  user: User,
  courseIdOrSlug: string,
  input: CreateCourseLearningQaDto
) {
  const { course } = await requireLearningCourse(user, courseIdOrSlug);
  const lessonId = readLessonId(input.lessonId);
  const text = readQaQuestionText(input);
  if (!lessonId) {
    throw new AuthError("برای ثبت سوال باید بخش دوره مشخص باشد", 400);
  }
  if (!text.trim()) {
    throw new AuthError("متن سوال الزامی است", 400);
  }

  await prisma.comment.create({
    data: {
      id: `qa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      courseId: course.id,
      authorId: user.id,
      authorName: user.fullName?.trim() || "کاربر اسپاتی‌کد",
      authorRole: "دانشجو",
      authorAvatar: "/images/student1.jpg",
      rating: null,
      content: stringifyQaPayload({
        lessonId,
        text,
        attachments: Array.isArray(input.attachments) ? input.attachments : undefined,
      }),
    },
  });

  return getCourseLearningCourseQa(user, course.id);
}
