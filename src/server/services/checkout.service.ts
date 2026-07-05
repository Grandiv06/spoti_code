import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import { resolveCheckoutDiscount, buildCheckoutLineItems } from "@/server/services/discount.service";

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
  if (user.role !== "USER") {
    throw new AuthError("مدرس و ادمین امکان خرید دوره برای خود ندارند", 403);
  }

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

  const cartItems = await buildCheckoutLineItems(
    purchasableCourses.map((course) => ({ id: course.id, price: course.price }))
  );

  const discountResult = await resolveCheckoutDiscount(user, cartItems, input.discountCode);
  const subtotal = discountResult.subtotal;
  const discountAmount = discountResult.discountAmount;
  const payableTotal = discountResult.total;
  const lineDiscounts = discountResult.lineDiscounts;
  const appliedCode = discountResult.applied?.code ?? null;

  const trackingCode = createTrackingCode();
  const now = Date.now();

  const createdOrders = await prisma.$transaction(async (tx) => {
    const orders = [];

    for (const [index, course] of purchasableCourses.entries()) {
      const lineItem = cartItems.find((item) => item.courseId === course.id);
      const linePrice = lineItem?.price ?? course.price;
      const courseDiscount = lineDiscounts[course.id] ?? 0;
      const amount = Math.max(linePrice - courseDiscount, 0);
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
          discountCode: appliedCode,
          discountAmount: courseDiscount,
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

    if (discountResult.discountId) {
      await tx.discountCodeUsage.create({
        data: {
          id: `DCU-${now}-${Math.random().toString(36).slice(2, 7)}`,
          discountCodeId: discountResult.discountId,
          userId: user.id,
          orderId: orders[0]?.id ?? null,
        },
      });
      await tx.discountCode.update({
        where: { id: discountResult.discountId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return orders;
  });

  return {
    trackingCode,
    subtotal,
    discountAmount,
    total: payableTotal,
    appliedCode,
    enrolledCourseIds: purchasableCourses.map((course) => course.id),
    orders: createdOrders.map((order) => ({
      id: order.id,
      courseId: order.courseId,
      amount: order.amount,
      status: order.status,
      productTitle: order.productTitle,
      trackingCode: order.trackingCode,
      discountCode: order.discountCode,
      discountAmount: order.discountAmount,
    })),
  };
}
