import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import { assertInstructor, resolveInstructorForUser } from "@/server/services/instructor-dashboard.service";

export const INSTRUCTOR_REVENUE_SHARE_PERCENT = 70;
export const INSTRUCTOR_REVENUE_SHARE_RATE = 0.7;

export type InstructorEarningsSummary = {
  totalGrossRevenue: number;
  totalInstructorEarnings: number;
  totalPlatformShare: number;
  totalSalesCount: number;
  totalStudentsCount: number;
  revenueSharePercent: number;
  averageOrderValue: number;
  thisMonthGrossRevenue: number;
  thisMonthInstructorEarnings: number;
  thisMonthSalesCount: number;
};

export type InstructorCourseEarningsRow = {
  courseId: string;
  title: string;
  slug: string;
  cover: string;
  price: number;
  salesCount: number;
  studentsCount: number;
  grossRevenue: number;
  instructorEarnings: number;
};

export type InstructorTransactionItem = {
  orderId: string;
  courseId: string | null;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentPhone: string | null;
  studentMaskedPhone: string | null;
  studentAvatar: string;
  amount: number;
  instructorShare: number;
  platformFee: number;
  trackingCode: string;
  refNumber: string | null;
  trackId: string | null;
  cardNumber: string | null;
  paymentMethod: string;
  gateway: string;
  status: "completed" | "pending" | "canceled" | "failed";
  statusLabel: string;
  paidAt: string | null;
  createdAt: string;
};

export type MonthlyEarningsPoint = {
  monthKey: string;
  monthName: string;
  grossRevenue: number;
  instructorEarnings: number;
  salesCount: number;
};

export type InstructorEarningsResponse = {
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  summary: InstructorEarningsSummary;
  coursesBreakdown: InstructorCourseEarningsRow[];
  recentTransactions: InstructorTransactionItem[];
  monthlyChart: MonthlyEarningsPoint[];
};

function maskPhoneNumber(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("98") ? "0" + digits.slice(2) : digits;
  if (normalized.length >= 7) {
    return normalized.slice(0, 4) + "***" + normalized.slice(-4);
  }
  return normalized;
}

function resolveMonthLabel(date: Date): { monthKey: string; monthName: string } {
  try {
    const full = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long" }).format(date);
    const monthOnly = new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(date);
    return { monthKey: full, monthName: monthOnly };
  } catch {
    return {
      monthKey: `${date.getFullYear()}/${date.getMonth() + 1}`,
      monthName: `ماه ${date.getMonth() + 1}`,
    };
  }
}

export async function getInstructorEarningsData(user: User): Promise<InstructorEarningsResponse> {
  assertInstructor(user);

  const instructor = await resolveInstructorForUser(user);
  if (!instructor) {
    throw new AuthError("پروفایل مدرس یافت نشد", 404);
  }

  // ۱. دریافت تمام دوره‌های مدرس
  const courses = await prisma.course.findMany({
    where: { instructorId: instructor.id },
    select: {
      id: true,
      title: true,
      slug: true,
      cover: true,
      thumbnail: true,
      price: true,
      status: true,
      studentsCount: true,
      revenue: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const courseIds = courses.map((c) => c.id);
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  if (courseIds.length === 0) {
    return {
      instructor: {
        id: instructor.id,
        name: instructor.name,
        avatar: instructor.avatar || "/images/inst1.jpg",
      },
      summary: {
        totalGrossRevenue: 0,
        totalInstructorEarnings: 0,
        totalPlatformShare: 0,
        totalSalesCount: 0,
        totalStudentsCount: 0,
        revenueSharePercent: INSTRUCTOR_REVENUE_SHARE_PERCENT,
        averageOrderValue: 0,
        thisMonthGrossRevenue: 0,
        thisMonthInstructorEarnings: 0,
        thisMonthSalesCount: 0,
      },
      coursesBreakdown: [],
      recentTransactions: [],
      monthlyChart: [],
    };
  }

  // ۲. دریافت تمام سفارش‌های موفق دوره‌های این مدرس
  const orders = await prisma.userOrder.findMany({
    where: {
      courseId: { in: courseIds },
      status: "completed",
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          profile: {
            select: {
              image: true,
            },
          },
        },
      },
      paymentTransaction: {
        select: {
          id: true,
          trackId: true,
          orderId: true,
          amount: true,
          gateway: true,
          status: true,
          refNumber: true,
          cardNumber: true,
          paidAt: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // ۳. محاسبه خلاصه‌های مالی
  let totalGrossRevenue = 0;
  let totalInstructorEarnings = 0;
  const uniqueStudents = new Set<string>();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  let thisMonthGrossRevenue = 0;
  let thisMonthInstructorEarnings = 0;
  let thisMonthSalesCount = 0;

  // نگاشت تفکیک بر اساس دوره
  const courseStats = new Map<
    string,
    {
      salesCount: number;
      students: Set<string>;
      grossRevenue: number;
      instructorEarnings: number;
    }
  >();

  for (const course of courses) {
    courseStats.set(course.id, {
      salesCount: 0,
      students: new Set<string>(),
      grossRevenue: 0,
      instructorEarnings: 0,
    });
  }

  // نگاشت ماهانه
  const monthlyMap = new Map<string, MonthlyEarningsPoint>();

  const recentTransactions: InstructorTransactionItem[] = [];

  for (const order of orders) {
    const amount = Number(order.amount) || 0;
    const instructorShare = Math.round(amount * INSTRUCTOR_REVENUE_SHARE_RATE);
    const platformFee = amount - instructorShare;

    totalGrossRevenue += amount;
    totalInstructorEarnings += instructorShare;
    if (order.userId) {
      uniqueStudents.add(order.userId);
    }

    const orderDate = order.paymentTransaction?.paidAt
      ? new Date(order.paymentTransaction.paidAt)
      : new Date(order.createdAt);

    if (orderDate >= thirtyDaysAgo) {
      thisMonthGrossRevenue += amount;
      thisMonthInstructorEarnings += instructorShare;
      thisMonthSalesCount += 1;
    }

    // آمار دوره
    if (order.courseId && courseStats.has(order.courseId)) {
      const cStat = courseStats.get(order.courseId)!;
      cStat.salesCount += 1;
      if (order.userId) cStat.students.add(order.userId);
      cStat.grossRevenue += amount;
      cStat.instructorEarnings += instructorShare;
    }

    // آمار ماهانه
    const { monthKey, monthName } = resolveMonthLabel(orderDate);
    const monthEntry = monthlyMap.get(monthKey) ?? {
      monthKey,
      monthName,
      grossRevenue: 0,
      instructorEarnings: 0,
      salesCount: 0,
    };
    monthEntry.grossRevenue += amount;
    monthEntry.instructorEarnings += instructorShare;
    monthEntry.salesCount += 1;
    monthlyMap.set(monthKey, monthEntry);

    // سطر تراکنش
    const matchedCourse = order.courseId ? courseMap.get(order.courseId) : null;
    const courseTitle = matchedCourse?.title || order.productTitle || "دوره آموزشی";
    const studentName = order.user?.fullName?.trim() || "دانشجوی اسپاتی‌کد";
    const studentAvatar = order.user?.profile?.image || "/images/student1.jpg";
    const studentPhone = order.user?.phone || null;
    const studentMaskedPhone = maskPhoneNumber(studentPhone);

    const tx = order.paymentTransaction;
    const trackingCode = tx?.refNumber || order.trackingCode || tx?.trackId || order.id;

    recentTransactions.push({
      orderId: order.id,
      courseId: order.courseId,
      courseTitle,
      studentId: order.userId,
      studentName,
      studentPhone,
      studentMaskedPhone,
      studentAvatar,
      amount,
      instructorShare,
      platformFee,
      trackingCode,
      refNumber: tx?.refNumber || null,
      trackId: tx?.trackId || null,
      cardNumber: tx?.cardNumber || null,
      paymentMethod: tx?.gateway === "zibal" ? "درگاه پرداخت زیبال" : (order.paymentMethod || "درگاه آنلاین"),
      gateway: tx?.gateway || "zibal",
      status: "completed",
      statusLabel: "موفق",
      paidAt: tx?.paidAt ? tx.paidAt.toISOString() : null,
      createdAt: order.createdAt.toISOString(),
    });
  }

  const totalSalesCount = orders.length;
  const totalStudentsCount = uniqueStudents.size;
  const totalPlatformShare = totalGrossRevenue - totalInstructorEarnings;
  const averageOrderValue = totalSalesCount > 0 ? Math.round(totalGrossRevenue / totalSalesCount) : 0;

  // آماده‌سازی تفکیک دوره‌ها
  const coursesBreakdown: InstructorCourseEarningsRow[] = courses.map((course) => {
    const stats = courseStats.get(course.id);
    return {
      courseId: course.id,
      title: course.title,
      slug: course.slug,
      cover: course.cover || course.thumbnail || "/images/course1.jpg",
      price: course.price,
      salesCount: stats?.salesCount ?? 0,
      studentsCount: stats?.students.size ?? course.studentsCount ?? 0,
      grossRevenue: stats?.grossRevenue ?? 0,
      instructorEarnings: stats?.instructorEarnings ?? 0,
    };
  });

  // مرتب‌سازی تفکیک دوره‌ها بر اساس بیشترین درآمد
  coursesBreakdown.sort((a, b) => b.grossRevenue - a.grossRevenue);

  // آماده‌سازی داده‌های ماهانه
  const monthlyChart = Array.from(monthlyMap.values());

  return {
    instructor: {
      id: instructor.id,
      name: instructor.name,
      avatar: instructor.avatar || "/images/inst1.jpg",
    },
    summary: {
      totalGrossRevenue,
      totalInstructorEarnings,
      totalPlatformShare,
      totalSalesCount,
      totalStudentsCount,
      revenueSharePercent: INSTRUCTOR_REVENUE_SHARE_PERCENT,
      averageOrderValue,
      thisMonthGrossRevenue,
      thisMonthInstructorEarnings,
      thisMonthSalesCount,
    },
    coursesBreakdown,
    recentTransactions,
    monthlyChart,
  };
}
