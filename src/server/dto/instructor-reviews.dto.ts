import type { Comment, Course, Instructor } from "@prisma/client";

export type InstructorReviewReplyDto = {
  text: string;
  content: string;
  createdAt: string;
  createdAtIso: string;
  authorName: string;
};

export type InstructorReviewDto = {
  id: string;
  studentName: string;
  avatar?: string;
  rating: number;
  comment: string;
  content: string;
  createdAt: string;
  createdAtIso: string;
  courseId: string;
  courseTitle: string;
  parentId?: string;
  reply?: InstructorReviewReplyDto;
};

export type InstructorReviewsResponseDto = {
  items: InstructorReviewDto[];
  courses: Array<{
    id: string;
    title: string;
  }>;
  stats: {
    total: number;
    answered: number;
    pending: number;
  };
};

export type ReplyInstructorReviewDto = {
  content?: unknown;
  text?: unknown;
};

type ReviewComment = Comment & {
  course: Course & { instructor: Instructor };
  replies: Comment[];
};

function readString(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function isLessonQaContent(content: string) {
  try {
    const parsed = JSON.parse(content) as { kind?: unknown };
    return parsed?.kind === "lesson-qa" || parsed?.kind === "lesson-qa-reply";
  } catch {
    return false;
  }
}

function mapReply(reply: Comment): InstructorReviewReplyDto {
  return {
    text: reply.content,
    content: reply.content,
    createdAt: reply.createdAt.toLocaleDateString("fa-IR"),
    createdAtIso: reply.createdAt.toISOString(),
    authorName: reply.authorName,
  };
}

export function isInstructorReviewComment(comment: Pick<Comment, "content" | "parentId" | "rating">) {
  return comment.parentId === null && comment.rating !== null && !isLessonQaContent(comment.content);
}

export function toInstructorReviewDto(comment: ReviewComment): InstructorReviewDto | null {
  if (!isInstructorReviewComment(comment)) return null;

  const instructorReply = comment.replies.find((reply) => reply.isInstructorReply) ?? comment.replies[0];

  return {
    id: comment.id,
    studentName: comment.authorName,
    avatar: comment.authorAvatar,
    rating: Math.max(1, Math.min(5, comment.rating ?? 5)),
    comment: comment.content,
    content: comment.content,
    createdAt: comment.createdAt.toLocaleDateString("fa-IR"),
    createdAtIso: comment.createdAt.toISOString(),
    courseId: comment.courseId,
    courseTitle: comment.course.title,
    parentId: comment.parentId ?? undefined,
    reply: instructorReply ? mapReply(instructorReply) : undefined,
  };
}

export function toInstructorReviewsResponseDto(comments: ReviewComment[]): InstructorReviewsResponseDto {
  const items = comments
    .map(toInstructorReviewDto)
    .filter((item): item is InstructorReviewDto => Boolean(item))
    .sort((a, b) => Date.parse(b.createdAtIso) - Date.parse(a.createdAtIso));

  return {
    items,
    courses: Array.from(
      new Map(items.map((item) => [item.courseId, { id: item.courseId, title: item.courseTitle }])).values()
    ),
    stats: {
      total: items.length,
      answered: items.filter((item) => Boolean(item.reply)).length,
      pending: items.filter((item) => !item.reply).length,
    },
  };
}

export function readReviewReplyText(input: ReplyInstructorReviewDto) {
  return readString(input.content ?? input.text);
}
