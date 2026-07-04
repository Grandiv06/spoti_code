export type ReviewApprovalStatus = "pending" | "approved" | "rejected";

export type AdminReviewRequestDto = {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  content: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  approvalStatus: ReviewApprovalStatus;
  createdAt: string;
  createdAtIso: string;
};

export type AdminReviewRequestsResponseDto = {
  items: AdminReviewRequestDto[];
  courses: Array<{
    id: string;
    title: string;
  }>;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
};

type ReviewCommentWithCourse = {
  id: string;
  courseId: string;
  parentId: string | null;
  content: string;
  rating: number | null;
  authorName: string;
  authorAvatar: string;
  approvalStatus?: string | null;
  createdAt: Date | string;
  course: {
    title: string;
    instructor: {
      name: string;
    };
  };
};

export function normalizeReviewApprovalStatus(value: string | null | undefined): ReviewApprovalStatus {
  if (value === "pending" || value === "rejected" || value === "approved") return value;
  return "approved";
}

export function toAdminReviewRequestDto(comment: ReviewCommentWithCourse): AdminReviewRequestDto | null {
  if (comment.parentId !== null || comment.rating === null) return null;
  const createdAt = comment.createdAt instanceof Date ? comment.createdAt : new Date(comment.createdAt);

  return {
    id: comment.id,
    studentName: comment.authorName,
    studentAvatar: comment.authorAvatar,
    rating: Math.max(1, Math.min(5, comment.rating)),
    content: comment.content,
    courseId: comment.courseId,
    courseTitle: comment.course.title,
    instructorName: comment.course.instructor.name,
    approvalStatus: normalizeReviewApprovalStatus(comment.approvalStatus),
    createdAt: createdAt.toLocaleDateString("fa-IR"),
    createdAtIso: createdAt.toISOString(),
  };
}

export function toAdminReviewRequestsResponseDto(
  comments: ReviewCommentWithCourse[]
): AdminReviewRequestsResponseDto {
  const items = comments
    .map(toAdminReviewRequestDto)
    .filter((item): item is AdminReviewRequestDto => Boolean(item));

  return {
    items,
    courses: Array.from(
      new Map(items.map((item) => [item.courseId, { id: item.courseId, title: item.courseTitle }])).values()
    ),
    stats: {
      total: items.length,
      pending: items.filter((item) => item.approvalStatus === "pending").length,
      approved: items.filter((item) => item.approvalStatus === "approved").length,
      rejected: items.filter((item) => item.approvalStatus === "rejected").length,
    },
  };
}
