import { prisma } from "@/server/db/prisma";

export async function countUserEnrollments(userId: string) {
  return prisma.courseEnrollment.count({ where: { userId } });
}

export async function countUserActiveOrders(userId: string) {
  return prisma.userOrder.count({
    where: {
      userId,
      status: { in: ["pending", "processing", "awaiting_payment"] },
    },
  });
}

export async function findUserRootComments(userId: string) {
  return prisma.comment.findMany({
    where: {
      authorId: userId,
      parentId: null,
      isInstructorReply: false,
    },
    select: {
      id: true,
      replies: {
        where: { isInstructorReply: true },
        select: { id: true },
        take: 1,
      },
    },
  });
}

export async function countUserRootComments(userId: string) {
  return prisma.comment.count({
    where: {
      authorId: userId,
      parentId: null,
      isInstructorReply: false,
    },
  });
}

export async function countUserAcceptedRootComments(userId: string) {
  return prisma.comment.count({
    where: {
      authorId: userId,
      parentId: null,
      isInstructorReply: false,
      replies: { some: { isInstructorReply: true } },
    },
  });
}

export async function findUserEnrollmentsWithCourses(userId: string) {
  return prisma.courseEnrollment.findMany({
    where: { userId },
    select: {
      id: true,
      courseId: true,
      progress: true,
      course: {
        select: {
          id: true,
          slug: true,
          title: true,
          thumbnail: true,
          cover: true,
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function findUserTransactions(userId: string) {
  return prisma.userOrder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findUserCommentsWithCourses(userId: string) {
  return prisma.comment.findMany({
    where: {
      authorId: userId,
      parentId: null,
      isInstructorReply: false,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
