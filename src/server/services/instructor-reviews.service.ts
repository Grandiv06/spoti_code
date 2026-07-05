import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import {
  readReviewReplyText,
  toInstructorReviewDto,
  toInstructorReviewsResponseDto,
  type ReplyInstructorReviewDto,
} from "@/server/dto/instructor-reviews.dto";
import { prisma } from "@/server/db/prisma";
import { assertInstructor, resolveInstructorForUser } from "@/server/services/instructor-dashboard.service";

export type InstructorReviewFilterInput = {
  status?: string;
  rating?: string;
  courseId?: string;
  search?: string;
  sort?: string;
};

function canManageAllInstructorReviews(user: User) {
  // The seeded instructor login is used as an aggregate demo panel across seeded courses.
  return user.role === "ADMIN" || user.id === "USR-INST-001" || user.phone === "+989000000002";
}

async function requireInstructorRecord(user: User) {
  assertInstructor(user);

  if (canManageAllInstructorReviews(user)) {
    return null;
  }

  const instructor = await resolveInstructorForUser(user);
  if (!instructor) {
    throw new AuthError("پروفایل مدرس پیدا نشد", 404);
  }

  return instructor;
}

function normalizeStatusFilter(value?: string) {
  return value === "answered" || value === "pending" ? value : "all";
}

function normalizeSort(value?: string) {
  return value === "oldest" ? "oldest" : "newest";
}

function normalizeRating(value?: string) {
  if (!value || value === "all") return undefined;
  const rating = Number(value);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : undefined;
}

function reviewMatchesStatus(
  comment: { replies: Array<{ isInstructorReply: boolean }> },
  status: string
) {
  if (status === "all") return true;
  const answered = comment.replies.some((reply) => reply.isInstructorReply);
  return status === "answered" ? answered : !answered;
}

function reviewMatchesSearch(
  comment: {
    content: string;
    authorName: string;
    course: { title: string };
  },
  search?: string
) {
  const query = search?.trim().toLowerCase();
  if (!query) return true;
  return (
    comment.content.toLowerCase().includes(query) ||
    comment.authorName.toLowerCase().includes(query) ||
    comment.course.title.toLowerCase().includes(query)
  );
}

export async function getInstructorReviews(user: User, filters: InstructorReviewFilterInput = {}) {
  const instructor = await requireInstructorRecord(user);
  const status = normalizeStatusFilter(filters.status);
  const rating = normalizeRating(filters.rating);
  const sort = normalizeSort(filters.sort);
  const courseId = filters.courseId && filters.courseId !== "all" ? filters.courseId : undefined;

  const comments = await prisma.comment.findMany({
    where: {
      parentId: null,
      rating: rating ?? { not: null },
      courseId,
      course: instructor ? { instructorId: instructor.id } : undefined,
    },
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: sort === "oldest" ? "asc" : "desc",
    },
  });

  const filtered = comments.filter(
    (comment) =>
      reviewMatchesStatus(comment, status) &&
      reviewMatchesSearch(comment, filters.search)
  );

  const response = toInstructorReviewsResponseDto(filtered);
  const allReviews = toInstructorReviewsResponseDto(comments);

  return {
    ...response,
    courses: allReviews.courses,
    stats: allReviews.stats,
  };
}

export async function replyToInstructorReview(
  user: User,
  reviewId: string,
  input: ReplyInstructorReviewDto
) {
  const instructor = await requireInstructorRecord(user);
  const review = await prisma.comment.findUnique({
    where: { id: decodeURIComponent(reviewId) },
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!review || review.parentId !== null || review.rating === null) {
    throw new AuthError("نظر پیدا نشد", 404);
  }

  if (instructor && review.course.instructorId !== instructor.id) {
    throw new AuthError("دسترسی به نظر این دوره ندارید", 403);
  }

  const content = readReviewReplyText(input);
  if (!content) {
    throw new AuthError("متن پاسخ الزامی است", 400);
  }

  const existingInstructorReply = review.replies.find((reply) => reply.isInstructorReply);
  if (existingInstructorReply) {
    await prisma.comment.update({
      where: { id: existingInstructorReply.id },
      data: { content },
    });
  } else {
    await prisma.comment.create({
      data: {
        id: `review-reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        courseId: review.courseId,
        parentId: review.id,
        authorId: user.id,
        authorName: instructor?.name ?? user.fullName?.trim() ?? "مدرس اسپاتی‌کد",
        authorRole: "مدرس",
        authorAvatar: instructor?.avatar ?? "/images/inst1.jpg",
        isInstructorReply: true,
        rating: null,
        content,
      },
    });
  }

  await prisma.$executeRaw`
    UPDATE "Comment"
    SET "approvalStatus" = 'approved'
    WHERE "id" = ${review.id}
      AND "approvalStatus" = 'pending'
  `;

  const updated = await prisma.comment.findUnique({
    where: { id: review.id },
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!updated) {
    throw new AuthError("نظر پیدا نشد", 404);
  }

  const dto = toInstructorReviewDto(updated);
  if (!dto) {
    throw new AuthError("نظر معتبر نیست", 404);
  }

  return dto;
}

export async function deleteInstructorReviewReply(user: User, reviewId: string) {
  const instructor = await requireInstructorRecord(user);
  const review = await prisma.comment.findUnique({
    where: { id: decodeURIComponent(reviewId) },
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!review || review.parentId !== null || review.rating === null) {
    throw new AuthError("نظر پیدا نشد", 404);
  }

  if (instructor && review.course.instructorId !== instructor.id) {
    throw new AuthError("دسترسی به نظر این دوره ندارید", 403);
  }

  const existingInstructorReply = review.replies.find((reply) => reply.isInstructorReply);
  if (existingInstructorReply) {
    await prisma.comment.delete({
      where: { id: existingInstructorReply.id },
    });
  }

  const updated = await prisma.comment.findUnique({
    where: { id: review.id },
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
      replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!updated) {
    throw new AuthError("نظر پیدا نشد", 404);
  }

  const dto = toInstructorReviewDto(updated);
  if (!dto) {
    throw new AuthError("نظر معتبر نیست", 404);
  }

  return dto;
}
