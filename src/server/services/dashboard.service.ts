import type { User } from "@prisma/client";
import type { PanelDashboardOverviewDto } from "@/server/dto/panel-dashboard.dto";
import type { PanelMyCourseDto } from "@/server/dto/panel-dashboard.dto";
import type { PanelTransactionDto } from "@/server/dto/panel-dashboard.dto";
import type { PanelMyCommentDto } from "@/server/dto/panel-dashboard.dto";
import {
  countUserActiveOrders,
  countUserEnrollments,
  findUserCommentsWithCourses,
  findUserEnrollmentsWithCourses,
  findUserRootComments,
  findUserTransactions,
} from "@/server/repositories/dashboard.repository";

function buildLabels(displayName: string): PanelDashboardOverviewDto["labels"] {
  return {
    welcomeTitle: `خوش اومدی، ${displayName}! 👋`,
    welcomeSubtitle: "از داشبورد خودت می‌تونی به دوره‌ها و وضعیت یادگیریت دسترسی داشته باشی.",
    enrolledCourses: "دوره‌های ثبت‌نامی",
    myComments: "کامنت‌های من",
    acceptedComments: "کامنت‌های تاییدشده",
    waitingComments: "در انتظار بررسی",
    activeOrder: "سفارش فعال",
    activeOrderYes: "دارد",
    activeOrderNo: "ندارد",
  };
}

export async function getPanelDashboardOverview(user: User): Promise<PanelDashboardOverviewDto> {
  const displayName = user.fullName?.trim() || "کاربر عزیز";

  const [enrolledCoursesCount, activeOrdersCount, rootComments] = await Promise.all([
    countUserEnrollments(user.id),
    countUserActiveOrders(user.id),
    findUserRootComments(user.id),
  ]);

  const myCommentsCount = rootComments.length;
  const acceptedCommentsCount = rootComments.filter((comment) => comment.replies.length > 0).length;
  const waitingCommentsCount = myCommentsCount - acceptedCommentsCount;

  return {
    user: {
      id: user.id,
      fullName: displayName,
      phone: user.phone,
    },
    enrolledCoursesCount,
    myCommentsCount,
    acceptedCommentsCount,
    waitingCommentsCount,
    hasActiveOrder: activeOrdersCount > 0,
    labels: buildLabels(displayName),
  };
}

export async function getPanelMyCourses(user: User): Promise<PanelMyCourseDto[]> {
  const enrollments = await findUserEnrollmentsWithCourses(user.id);

  return enrollments.map((enrollment) => ({
    id: enrollment.id,
    courseId: enrollment.courseId,
    progress: enrollment.progress,
    progressPercent: enrollment.progress,
    course: {
      id: enrollment.course.id,
      slug: enrollment.course.slug,
      title: enrollment.course.title,
      name: enrollment.course.title,
      thumbnail: enrollment.course.thumbnail,
      cover: enrollment.course.cover,
      teacher: {
        id: enrollment.course.instructor.id,
        fullName: enrollment.course.instructor.name,
        name: enrollment.course.instructor.name,
        avatar: enrollment.course.instructor.avatar,
      },
    },
  }));
}

function mapTransactionStatus(status: string): string {
  const normalized = status.toLowerCase();
  if (["success", "paid", "completed"].includes(normalized)) return "success";
  if (["failed", "error", "canceled", "cancelled"].includes(normalized)) return "failed";
  if (["refunded", "refund"].includes(normalized)) return "refunded";
  return "pending";
}

export async function getPanelMyTransactions(user: User): Promise<PanelTransactionDto[]> {
  const transactions = await findUserTransactions(user.id);

  return transactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type || "payment",
    description: transaction.description?.trim() || "تراکنش",
    amount: transaction.amount,
    status: mapTransactionStatus(transaction.status),
    createdAt: transaction.createdAt.toISOString(),
    paymentMethod: transaction.paymentMethod?.trim() || "نامشخص",
    trackingCode: transaction.trackingCode?.trim() || "---",
    productTitle: transaction.productTitle?.trim() || "-",
  }));
}

export async function getPanelMyComments(user: User): Promise<PanelMyCommentDto[]> {
  const comments = await findUserCommentsWithCourses(user.id);

  return comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    project: comment.course.title,
    courseId: comment.course.id,
    courseTitle: comment.course.title,
    createdAt: comment.createdAt.toISOString(),
  }));
}
