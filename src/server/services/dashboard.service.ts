import type { User } from "@prisma/client";
import { isProfileReviewComment } from "@/server/utils/course-comment-classifier";
import type { PanelDashboardOverviewDto } from "@/server/dto/panel-dashboard.dto";
import type { PanelMyCourseDto } from "@/server/dto/panel-dashboard.dto";
import type { PanelTransactionDto } from "@/server/dto/panel-dashboard.dto";
import type { PanelMyCommentDto } from "@/server/dto/panel-dashboard.dto";
import {
  countUserActiveOrders,
  countUserAcceptedRootComments,
  countUserEnrollments,
  countUserRootComments,
  findUserCommentsWithCourses,
  findUserEnrollmentsWithCourses,
  findUserTransactions,
} from "@/server/repositories/dashboard.repository";
import { findUserProfileByUserId } from "@/server/repositories/profile.repository";
import { resolveUserDisplayName } from "@/server/utils/user-display-name";

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
  const profile = await findUserProfileByUserId(user.id);
  const displayName = resolveUserDisplayName({
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    profile,
  });

  const [enrolledCoursesCount, activeOrdersCount, myCommentsCount, acceptedCommentsCount] =
    await Promise.all([
      countUserEnrollments(user.id),
      countUserActiveOrders(user.id),
      countUserRootComments(user.id),
      countUserAcceptedRootComments(user.id),
    ]);

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

const MY_COURSES_CACHE_TTL_MS = 45_000;
const myCoursesCache = new Map<string, { expiresAt: number; value: PanelMyCourseDto[] }>();
const inflightMyCourses = new Map<string, Promise<PanelMyCourseDto[]>>();

export function invalidatePanelMyCoursesCache(userId?: string) {
  if (userId) {
    myCoursesCache.delete(userId);
    inflightMyCourses.delete(userId);
    return;
  }
  myCoursesCache.clear();
  inflightMyCourses.clear();
}

function mapEnrollmentsToMyCourses(
  enrollments: Awaited<ReturnType<typeof findUserEnrollmentsWithCourses>>
): PanelMyCourseDto[] {
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

export async function getPanelMyCourses(user: User): Promise<PanelMyCourseDto[]> {
  const cached = myCoursesCache.get(user.id);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const inflight = inflightMyCourses.get(user.id);
  if (inflight) {
    return inflight;
  }

  const load = findUserEnrollmentsWithCourses(user.id)
    .then((enrollments) => {
      const value = mapEnrollmentsToMyCourses(enrollments);
      myCoursesCache.set(user.id, {
        value,
        expiresAt: Date.now() + MY_COURSES_CACHE_TTL_MS,
      });
      return value;
    })
    .finally(() => {
      inflightMyCourses.delete(user.id);
    });

  inflightMyCourses.set(user.id, load);
  return load;
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

  return comments
    .filter((comment) => isProfileReviewComment(comment))
    .map((comment) => ({
      id: comment.id,
      content: comment.content,
      project: comment.course.title,
      courseId: comment.course.id,
      courseTitle: comment.course.title,
      createdAt: comment.createdAt.toISOString(),
    }));
}
