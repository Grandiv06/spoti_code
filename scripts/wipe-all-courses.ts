/**
 * Destructive: removes every course and all course-linked rows.
 * Keeps users, instructors, tickets, and non-course discount codes.
 */
import { rm } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const before = {
    courses: await prisma.course.count(),
    enrollments: await prisma.courseEnrollment.count(),
    comments: await prisma.comment.count(),
    discountLinks: await prisma.discountCodeCourse.count(),
    courseOrders: await prisma.userOrder.count({ where: { courseId: { not: null } } }),
  };

  console.log("Before wipe:", before);

  const result = await prisma.$transaction(async (tx) => {
    // Child comments first (self-relation), then roots / anything left.
    const replyComments = await tx.comment.deleteMany({ where: { parentId: { not: null } } });
    const rootComments = await tx.comment.deleteMany();
    const enrollments = await tx.courseEnrollment.deleteMany();
    const discountLinks = await tx.discountCodeCourse.deleteMany();
    const courseOrders = await tx.userOrder.deleteMany({ where: { courseId: { not: null } } });
    const courses = await tx.course.deleteMany();

    return {
      replyComments: replyComments.count,
      rootComments: rootComments.count,
      enrollments: enrollments.count,
      discountLinks: discountLinks.count,
      courseOrders: courseOrders.count,
      courses: courses.count,
    };
  });

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "courses");
  try {
    await rm(uploadsDir, { recursive: true, force: true });
    console.log("Removed upload dir:", uploadsDir);
  } catch (error) {
    console.warn("Could not remove course uploads:", error);
  }

  const after = {
    courses: await prisma.course.count(),
    enrollments: await prisma.courseEnrollment.count(),
    comments: await prisma.comment.count(),
    discountLinks: await prisma.discountCodeCourse.count(),
    courseOrders: await prisma.userOrder.count({ where: { courseId: { not: null } } }),
  };

  console.log("Deleted:", result);
  console.log("After wipe:", after);

  if (after.courses !== 0 || after.enrollments !== 0 || after.comments !== 0) {
    throw new Error("Wipe incomplete — some course-related rows remain");
  }

  console.log("All courses and related data wiped successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
