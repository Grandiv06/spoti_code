import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";

const DISCOUNT_CODES: Record<string, number> = {
  SPOTI10: 0.1,
  NEWUSER15: 0.15,
  WELCOME20: 0.2,
};

type CheckoutInput = {
  courseIds: string[];
  discountCode?: string | null;
};

function normalizeCheckoutInput(rawInput: unknown): CheckoutInput {
  const body = rawInput && typeof rawInput === "object" ? (rawInput as Record<string, unknown>) : {};
  const courseIds = Array.isArray(body.courseIds)
    ? body.courseIds.map((id) => String(id).trim()).filter(Boolean)
    : [];

  return {
    courseIds: [...new Set(courseIds)],
    discountCode: typeof body.discountCode === "string" ? body.discountCode.trim().toUpperCase() : null,
  };
}

function createTrackingCode() {
  return `SPOT-${Date.now().toString(36).toUpperCase()}`;
}

export async function completeCheckout(user: User, rawInput: unknown) {
  const input = normalizeCheckoutInput(rawInput);

  if (input.courseIds.length === 0) {
    throw new AuthError("سبد خرید خالی است", 400);
  }

  const courses = await prisma.course.findMany({
    where: {
      id: { in: input.courseIds },
      status: "published",
    },
    select: {
      id: true,
      title: true,
      price: true,
    },
  });

  if (courses.length !== input.courseIds.length) {
    throw new AuthError("برخی دوره‌های انتخاب‌شده قابل خرید نیستند", 400);
  }

  const existingEnrollments = await prisma.courseEnrollment.findMany({
    where: {
      userId: user.id,
      courseId: { in: input.courseIds },
    },
    select: { courseId: true },
  });

  const enrolledIds = new Set(existingEnrollments.map((row) => row.courseId));
  const purchasableCourses = courses.filter((course) => !enrolledIds.has(course.id));

  if (purchasableCourses.length === 0) {
    throw new AuthError("شما قبلاً در دوره‌های انتخاب‌شده ثبت‌نام کرده‌اید", 400);
  }

  const subtotal = purchasableCourses.reduce((sum, course) => sum + course.price, 0);
  const discountRate = input.discountCode ? DISCOUNT_CODES[input.discountCode] ?? 0 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const payableTotal = Math.max(subtotal - discountAmount, 0);
  const perCourseDiscount =
    purchasableCourses.length > 0 ? Math.floor(discountAmount / purchasableCourses.length) : 0;

  const trackingCode = createTrackingCode();
  const now = Date.now();

  const createdOrders = await prisma.$transaction(async (tx) => {
    const orders = [];

    for (const [index, course] of purchasableCourses.entries()) {
      const courseDiscount =
        index === purchasableCourses.length - 1
          ? discountAmount - perCourseDiscount * (purchasableCourses.length - 1)
          : perCourseDiscount;
      const amount = Math.max(course.price - courseDiscount, 0);
      const orderId = `ORD-${now}-${index + 1}`;

      const order = await tx.userOrder.create({
        data: {
          id: orderId,
          userId: user.id,
          type: "payment",
          status: "completed",
          amount,
          description: `خرید دوره «${course.title}»`,
          paymentMethod: "درگاه آزمایشی",
          trackingCode,
          productTitle: course.title,
          courseId: course.id,
        },
      });

      await tx.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          id: `ENR-${user.id}-${course.id}`,
          userId: user.id,
          courseId: course.id,
          progress: 0,
        },
      });

      await tx.course.update({
        where: { id: course.id },
        data: {
          studentsCount: { increment: 1 },
        },
      });

      orders.push(order);
    }

    return orders;
  });

  return {
    trackingCode,
    subtotal,
    discountAmount,
    total: payableTotal,
    enrolledCourseIds: purchasableCourses.map((course) => course.id),
    orders: createdOrders.map((order) => ({
      id: order.id,
      courseId: order.courseId,
      amount: order.amount,
      status: order.status,
      productTitle: order.productTitle,
      trackingCode: order.trackingCode,
    })),
  };
}
