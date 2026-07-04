import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import {
  readAnswerAttachments,
  readAnswerText,
  stringifyLessonQaReplyPayload,
  toInstructorQuestionDto,
  toInstructorQuestionsResponseDto,
  type AnswerInstructorQuestionDto,
} from "@/server/dto/instructor-questions.dto";
import { prisma } from "@/server/db/prisma";
import { assertInstructor, resolveInstructorForUser } from "@/server/services/instructor-dashboard.service";

async function requireInstructorRecord(user: User) {
  assertInstructor(user);

  if (canManageAllInstructorQuestions(user)) {
    return null;
  }

  const instructor = await resolveInstructorForUser(user);
  if (!instructor) {
    throw new AuthError("پروفایل مدرس پیدا نشد", 404);
  }

  return instructor;
}

function canManageAllInstructorQuestions(user: User) {
  // The seeded instructor account is a demo aggregate panel, not a real single-instructor login.
  return user.role === "ADMIN" || user.id === "USR-INST-001" || user.phone === "+989000000002";
}

export async function getInstructorQuestions(user: User) {
  const instructor = await requireInstructorRecord(user);

  const comments = await prisma.comment.findMany({
    where: {
      parentId: null,
      rating: null,
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
      createdAt: "desc",
    },
  });

  return toInstructorQuestionsResponseDto(comments);
}

export async function answerInstructorQuestion(
  user: User,
  questionId: string,
  input: AnswerInstructorQuestionDto
) {
  const instructor = await requireInstructorRecord(user);
  const question = await prisma.comment.findUnique({
    where: { id: decodeURIComponent(questionId) },
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

  if (!question || question.parentId !== null) {
    throw new AuthError("سوال پیدا نشد", 404);
  }

  if (instructor && question.course.instructorId !== instructor.id) {
    throw new AuthError("دسترسی به سوال این دوره ندارید", 403);
  }

  const answer = readAnswerText(input);
  if (!answer) {
    throw new AuthError("متن پاسخ الزامی است", 400);
  }

  await prisma.comment.create({
    data: {
      id: `qa-reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      courseId: question.courseId,
      parentId: question.id,
      authorId: user.id,
      authorName: instructor?.name ?? user.fullName?.trim() ?? "مدرس اسپاتی‌کد",
      authorRole: "مدرس",
      authorAvatar: instructor?.avatar ?? "/images/inst1.jpg",
      isInstructorReply: true,
      rating: null,
      content: stringifyLessonQaReplyPayload({
        text: answer,
        attachments: readAnswerAttachments(input),
      }),
    },
  });

  const updated = await prisma.comment.findUnique({
    where: { id: question.id },
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
    throw new AuthError("سوال پیدا نشد", 404);
  }

  const dto = toInstructorQuestionDto(updated);
  if (!dto) {
    throw new AuthError("سوال معتبر نیست", 404);
  }

  return dto;
}
