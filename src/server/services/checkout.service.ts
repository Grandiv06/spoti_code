import type { Prisma, User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";
import { invalidatePanelMyCoursesCache } from "@/server/services/dashboard.service";
import { resolveCheckoutDiscount, buildCheckoutLineItems } from "@/server/services/discount.service";
import {
  requestZibalPayment,
  verifyZibalPayment,
  inquiryZibalPayment,
  getZibalStatusMessage,
  getZibalVerifyResultMessage,
  resolvePublicBaseUrl,
} from "@/server/services/zibal.service";

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

function createTrackingCode(prefix = "SPOT") {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export type CheckoutResponse =
  | {
      free: true;
      trackingCode: string;
      subtotal: number;
      discountAmount: number;
      total: number;
      appliedCode: string | null;
      enrolledCourseIds: string[];
      orders: {
        id: string;
        courseId: string | null;
        amount: number;
        status: string;
        productTitle: string | null;
        trackingCode: string | null;
        discountCode: string | null;
        discountAmount: number;
      }[];
    }
  | {
      free: false;
      paymentUrl: string;
      trackId: number;
      orderId: string;
      total: number;
      subtotal: number;
      discountAmount: number;
    };

/**
 * ایجاد تراکنش خرید و هدایت به درگاه پرداخت زیبال (یا تکمیل مستقیم در صورت رایگان بودن)
 */
export async function initiateCheckout(
  user: User,
  rawInput: unknown,
  origin = resolvePublicBaseUrl()
): Promise<CheckoutResponse> {
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
    throw new AuthError("برخی دوره‌های انتخاب‌شده یافت نشدند یا هنوز منتشر نشده‌اند", 400);
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
    throw new AuthError("شما قبلاً در تمامی دوره‌های انتخاب‌شده ثبت‌نام کرده‌اید", 400);
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

  const now = Date.now();
  const trackingCode = createTrackingCode();

  // در صورتی که مبلغ نهایی صفر باشد (دوره رایگان یا تخفیف ۱۰۰ درصدی)
  if (payableTotal <= 0) {
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
            description: `خرید دوره «${course.title}» (رایگان)`,
            paymentMethod: "رایگان / کد تخفیف",
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
            ...(order.amount > 0 ? { revenue: { increment: BigInt(order.amount) } } : {}),
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

    invalidatePanelMyCoursesCache(user.id);

    return {
      free: true,
      trackingCode,
      subtotal,
      discountAmount,
      total: 0,
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

  // مبلغ غیر صفر: اتصال به درگاه زیبال
  // مبالغ در زیبال به ریال است (تومان * ۱۰)
  const amountRials = BigInt(payableTotal) * BigInt(10);
  const paymentTxId = `TX-${now}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const orderSessionId = `ORD-${now}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const courseTitles = purchasableCourses.map((c) => c.title).join("، ");
  const description = `خرید دوره(های) «${courseTitles}» در اسپاتی‌کد`;

  // ثبت تراکنش و سفارش‌ها در وضعیت انتظار پرداخت (pending)
  await prisma.$transaction(async (tx) => {
    await tx.paymentTransaction.create({
      data: {
        id: paymentTxId,
        userId: user.id,
        orderId: orderSessionId,
        amount: payableTotal,
        amountRials,
        gateway: "zibal",
        status: "pending",
        description,
        courseIds: purchasableCourses.map((c) => c.id),
        discountCode: appliedCode,
        discountAmount,
      },
    });

    for (const [index, course] of purchasableCourses.entries()) {
      const lineItem = cartItems.find((item) => item.courseId === course.id);
      const linePrice = lineItem?.price ?? course.price;
      const courseDiscount = lineDiscounts[course.id] ?? 0;
      const amount = Math.max(linePrice - courseDiscount, 0);
      const subOrderId = `${orderSessionId}-${index + 1}`;

      await tx.userOrder.create({
        data: {
          id: subOrderId,
          userId: user.id,
          type: "payment",
          status: "pending",
          amount,
          description: `خرید دوره «${course.title}»`,
          paymentMethod: "درگاه پرداخت زیبال",
          trackingCode: "در انتظار پرداخت",
          productTitle: course.title,
          courseId: course.id,
          discountCode: appliedCode,
          discountAmount: courseDiscount,
          paymentTransactionId: paymentTxId,
        },
      });
    }
  });

  // آدرس بازگشت (Callback)
  const cleanOrigin = origin.replace(/\/$/, "");
  const callbackUrl = `${cleanOrigin}/api/payment/zibal/callback`;

  // درخواست به زیبال
  let zibalResponse;
  try {
    zibalResponse = await requestZibalPayment({
      amountRials,
      callbackUrl,
      description,
      orderId: orderSessionId,
      mobile: user.phone,
      nationalCode: user.nationalCode || undefined,
    });
  } catch (error) {
    // در صورت بروز خطا در ثبت زیبال، وضعیت سفارش‌ها را به لغو شده تغییر می‌دهیم
    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: paymentTxId },
        data: {
          status: "failed",
          resultMessage: error instanceof Error ? error.message : "خطا در اتصال به درگاه",
        },
      });
      await tx.userOrder.updateMany({
        where: { paymentTransactionId: paymentTxId },
        data: { status: "canceled" },
      });
    });
    throw error;
  }

  // ذخیره trackId دریافت شده از زیبال
  await prisma.$transaction(async (tx) => {
    await tx.paymentTransaction.update({
      where: { id: paymentTxId },
      data: {
        trackId: String(zibalResponse.trackId),
        resultCode: zibalResponse.result,
        resultMessage: zibalResponse.message,
      },
    });
    await tx.userOrder.updateMany({
      where: { paymentTransactionId: paymentTxId },
      data: {
        trackingCode: String(zibalResponse.trackId),
      },
    });
  });

  return {
    free: false,
    paymentUrl: zibalResponse.paymentUrl,
    trackId: zibalResponse.trackId,
    orderId: orderSessionId,
    total: payableTotal,
    subtotal,
    discountAmount,
  };
}

export type ZibalCallbackResult = {
  status: "success" | "canceled" | "failed";
  trackId: string;
  orderId?: string;
  refNumber?: string;
  amount?: number;
  message: string;
};

/**
 * پردازش بازگشت از درگاه پرداخت زیبال (Callback)
 */
export async function handleZibalCallback(query: {
  trackId?: string | null;
  success?: string | null;
  status?: string | null;
  orderId?: string | null;
}): Promise<ZibalCallbackResult> {
  const trackId = query.trackId ? String(query.trackId).trim() : "";
  const success = query.success ? String(query.success).trim() : "0";
  const statusParam = query.status ? Number(query.status) : null;
  const orderId = query.orderId ? String(query.orderId).trim() : "";

  if (!trackId) {
    return {
      status: "failed",
      trackId: "",
      message: "شناسه تراکنش (trackId) در بازگشت از درگاه یافت نشد.",
    };
  }

  // یافتن تراکنش در دیتابیس بر اساس trackId یا orderId
  const transaction = await prisma.paymentTransaction.findFirst({
    where: {
      OR: [{ trackId }, ...(orderId ? [{ orderId }] : [])],
    },
    include: {
      user: true,
      orders: true,
    },
  });

  if (!transaction) {
    return {
      status: "failed",
      trackId,
      message: "اطلاعات سفارش مربوط به این تراکنش در سیستم ثبت نشده است.",
    };
  }

  // اگر قبلاً تایید و تسویه شده باشد
  if (transaction.status === "paid") {
    return {
      status: "success",
      trackId,
      orderId: transaction.orderId,
      refNumber: transaction.refNumber || trackId,
      amount: transaction.amount,
      message: "تراکنش قبلاً با موفقیت تایید و تکمیل شده است.",
    };
  }

  // اگر کاربر پرداخت را لغو کرده یا ناموفق بوده است
  if (success !== "1") {
    const errorMsg = getZibalStatusMessage(statusParam);

    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: statusParam === 3 ? "canceled" : "failed",
          resultCode: statusParam,
          resultMessage: errorMsg,
          rawCallback: query as unknown as Prisma.InputJsonValue,
        },
      });
      await tx.userOrder.updateMany({
        where: { paymentTransactionId: transaction.id },
        data: {
          status: statusParam === 3 ? "canceled" : "failed",
        },
      });
    });

    return {
      status: statusParam === 3 ? "canceled" : "failed",
      trackId,
      orderId: transaction.orderId,
      amount: transaction.amount,
      message: errorMsg,
    };
  }

  // پرداخت در ظاهر موفق بوده؛ اکنون استعلام تایید نهایی (Verify) از زیبال
  let verifyResult;
  try {
    verifyResult = await verifyZibalPayment(trackId);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "خطای ارتباط در تایید پرداخت";
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: "failed",
        resultMessage: errorMsg,
      },
    });

    return {
      status: "failed",
      trackId,
      orderId: transaction.orderId,
      amount: transaction.amount,
      message: errorMsg,
    };
  }

  // بررسی نتیجه تایید زیبال (100 = موفق، 201 = قبلاً تایید شده)
  const isVerified = verifyResult.result === 100 || verifyResult.result === 201;

  if (!isVerified) {
    const errorMsg = getZibalVerifyResultMessage(verifyResult.result);

    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "failed",
          resultCode: verifyResult.result,
          resultMessage: errorMsg,
          rawVerify: verifyResult as unknown as Prisma.InputJsonValue,
        },
      });
      await tx.userOrder.updateMany({
        where: { paymentTransactionId: transaction.id },
        data: {
          status: "failed",
        },
      });
    });

    return {
      status: "failed",
      trackId,
      orderId: transaction.orderId,
      amount: transaction.amount,
      message: errorMsg,
    };
  }

  // اعتبارسنجی دقیق مبلغ پرداختی در مقایسه با مبلغ فاکتور در دیتابیس (Zero Trust)
  const expectedAmountRials =
    transaction.amountRials != null ? Number(transaction.amountRials) : transaction.amount * 10;

  if (verifyResult.amount == null || verifyResult.amount < expectedAmountRials) {
    const mismatchMsg = `مبلغ واریزی (${verifyResult.amount ?? 0} ریال) کمتر از مبلغ فاکتور (${expectedAmountRials} ریال) است.`;
    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "failed",
          resultCode: verifyResult.result,
          resultMessage: mismatchMsg,
          rawCallback: query as unknown as Prisma.InputJsonValue,
          rawVerify: verifyResult as unknown as Prisma.InputJsonValue,
        },
      });
      await tx.userOrder.updateMany({
        where: { paymentTransactionId: transaction.id },
        data: {
          status: "failed",
        },
      });
    });

    return {
      status: "failed",
      trackId,
      orderId: transaction.orderId,
      amount: transaction.amount,
      message:
        "مبلغ پرداخت شده با مبلغ سفارش تطابق ندارد. در صورت کسر وجه، مبلغ طی ۷۲ ساعت برگشت داده می‌شود.",
    };
  }

  // تایید موفقیت‌آمیز تراکنش
  const refNumber = verifyResult.refNumber || trackId;
  const cardNumber = verifyResult.cardNumber || undefined;
  const paidAtDate = verifyResult.paidAt ? new Date(verifyResult.paidAt) : new Date();
  const courseIds = (
    Array.isArray(transaction.courseIds)
      ? transaction.courseIds.map((c) => String(c).trim()).filter(Boolean)
      : []
  ) as string[];

  let alreadyProcessed = false;

  await prisma.$transaction(async (tx) => {
    // ۱. به‌روزرسانی اتمیک وضعیت تراکنش (محافظت در برابر Race Condition / Double Spending)
    const updateResult = await tx.paymentTransaction.updateMany({
      where: {
        id: transaction.id,
        status: { not: "paid" },
      },
      data: {
        status: "paid",
        refNumber,
        cardNumber,
        paidAt: paidAtDate,
        resultCode: verifyResult.result,
        resultMessage: "پرداخت تایید شد",
        rawCallback: query as unknown as Prisma.InputJsonValue,
        rawVerify: verifyResult as unknown as Prisma.InputJsonValue,
      },
    });

    if (updateResult.count === 0) {
      // این تراکنش همزمان توسط یک فراخوانی دیگر تایید و اعمال شده است
      alreadyProcessed = true;
      return;
    }

    // ۲. به‌روزرسانی سفارش‌های متصل
    await tx.userOrder.updateMany({
      where: { paymentTransactionId: transaction.id },
      data: {
        status: "completed",
        trackingCode: refNumber,
        paymentMethod: "درگاه پرداخت زیبال",
      },
    });

    // ۳. ثبت‌نام دانشجو در دوره‌ها و افزایش آمار دانشجویان
    for (const courseId of courseIds) {
      await tx.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: transaction.userId,
            courseId,
          },
        },
        update: {},
        create: {
          id: `ENR-${transaction.userId}-${courseId}`,
          userId: transaction.userId,
          courseId,
          progress: 0,
        },
      });

      const matchedOrder = transaction.orders.find((o) => o.courseId === courseId);
      const orderAmount = matchedOrder?.amount ?? 0;

      await tx.course.update({
        where: { id: courseId },
        data: {
          studentsCount: { increment: 1 },
          ...(orderAmount > 0 ? { revenue: { increment: BigInt(orderAmount) } } : {}),
        },
      });
    }

    // ۴. ثبت استفاده از کد تخفیف در صورت وجود (با بررسی عدم ثبت تکراری)
    if (transaction.discountCode) {
      const discount = await tx.discountCode.findUnique({
        where: { code: transaction.discountCode },
      });

      if (discount) {
        const existingUsage = await tx.discountCodeUsage.findFirst({
          where: {
            discountCodeId: discount.id,
            userId: transaction.userId,
            orderId: transaction.orderId,
          },
        });

        if (!existingUsage) {
          await tx.discountCodeUsage.create({
            data: {
              id: `DCU-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              discountCodeId: discount.id,
              userId: transaction.userId,
              orderId: transaction.orderId,
            },
          });

          await tx.discountCode.update({
            where: { id: discount.id },
            data: {
              usedCount: { increment: 1 },
            },
          });
        }
      }
    }
  });

  if (alreadyProcessed) {
    return {
      status: "success",
      trackId,
      orderId: transaction.orderId,
      refNumber,
      amount: transaction.amount,
      message: "تراکنش قبلاً با موفقیت تایید و تکمیل شده است.",
    };
  }

  // پاک کردن کش دوره‌های کاربر در پنل
  invalidatePanelMyCoursesCache(transaction.userId);

  return {
    status: "success",
    trackId,
    orderId: transaction.orderId,
    refNumber,
    amount: transaction.amount,
    message: "پرداخت شما با موفقیت انجام شد و دوره‌ها به پنل کاربری اضافه شدند.",
  };
}

/**
 * دریافت جزئیات یک تراکنش پرداخت برای نمایش رسید
 */
export async function getPaymentStatus(trackId: string, userId?: string) {
  const transaction = await prisma.paymentTransaction.findFirst({
    where: {
      OR: [{ trackId }, { orderId: trackId }],
      ...(userId ? { userId } : {}),
    },
    include: {
      orders: true,
    },
  });

  if (!transaction) return null;

  return {
    id: transaction.id,
    orderId: transaction.orderId,
    trackId: transaction.trackId,
    status: transaction.status,
    amount: transaction.amount,
    refNumber: transaction.refNumber,
    cardNumber: transaction.cardNumber,
    description: transaction.description,
    paidAt: transaction.paidAt?.toISOString() || null,
    createdAt: transaction.createdAt.toISOString(),
    discountAmount: transaction.discountAmount,
    discountCode: transaction.discountCode,
    orders: transaction.orders.map((o) => ({
      id: o.id,
      productTitle: o.productTitle,
      amount: o.amount,
      trackingCode: o.trackingCode,
      status: o.status,
    })),
  };
}

/**
 * استعلام و همگام‌سازی تراکنش از طریق متد Inquiry زیبال
 */
export async function inquireAndSyncPayment(trackId: string) {
  const inquiry = await inquiryZibalPayment(trackId);

  const transaction = await prisma.paymentTransaction.findFirst({
    where: { trackId: String(trackId) },
  });

  if (!transaction) {
    throw new Error("تراکنش در سیستم یافت نشد");
  }

  // اگر در زیبال پرداخت شده و تایید شده باشد اما در دیتابیس هنوز pending باشد:
  if (inquiry.status === 1 && transaction.status !== "paid") {
    // از handleZibalCallback برای تکمیل و نهایی‌سازی استفاده می‌کنیم
    return handleZibalCallback({
      trackId: String(trackId),
      success: "1",
      status: "1",
      orderId: transaction.orderId,
    });
  }

  return {
    transactionStatus: transaction.status,
    zibalStatus: inquiry.status,
    zibalMessage: inquiry.message,
    amount: inquiry.amount,
    refNumber: inquiry.refNumber,
    paidAt: inquiry.paidAt,
  };
}

/**
 * سازگاری با متد قدیمی completeCheckout (در صورت استفاده در جاهای دیگر)
 */
export async function completeCheckout(user: User, rawInput: unknown) {
  return initiateCheckout(user, rawInput);
}
