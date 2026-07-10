import type { Comment } from "@prisma/client";

export const COURSE_QUESTION_APPROVAL_STATUS = "question" as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Detects lesson Q&A payloads stored in Comment.content (including legacy shapes). */
export function isLessonQaCommentContent(content: string): boolean {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!isRecord(parsed)) return false;

    if (parsed.kind === "lesson-qa" || parsed.kind === "lesson-qa-reply") {
      return true;
    }

    // Malformed / legacy Q&A rows may omit kind but still carry lessonId + text fields.
    if (typeof parsed.lessonId === "string" && parsed.lessonId.trim()) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function isCourseQuestionComment(
  comment: Pick<Comment, "content" | "id" | "parentId" | "rating" | "approvalStatus">
): boolean {
  if (comment.approvalStatus === COURSE_QUESTION_APPROVAL_STATUS) return true;
  if (comment.id.startsWith("qa-")) return true;
  if (isLessonQaCommentContent(comment.content)) return true;
  // Root comments without a star rating are course questions, not public reviews.
  if (comment.parentId === null && comment.rating == null) return true;
  return false;
}

/** True only for standalone star-rated course reviews shown in profile "دیدگاه‌ها". */
export function isProfileReviewComment(
  comment: Pick<
    Comment,
    "content" | "id" | "parentId" | "rating" | "approvalStatus" | "isInstructorReply"
  >
): boolean {
  if (comment.parentId !== null) return false;
  if (comment.isInstructorReply) return false;
  if (isCourseQuestionComment(comment)) return false;
  return comment.rating !== null && comment.rating > 0;
}
