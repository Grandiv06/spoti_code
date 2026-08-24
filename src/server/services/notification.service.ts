import { prisma } from "@/server/db/prisma";
import type { User } from "@prisma/client";

export interface UserNotificationDto {
  id: string;
  type: "COURSE" | "SUPPORT" | "ORDER" | "SYSTEM";
  title: string;
  message: string;
  link: string;
  createdAt: string;
  actor: {
    displayName: string;
    avatarUrl?: string;
  };
}

export async function getUserNotifications(user: User): Promise<UserNotificationDto[]> {
  const notifs: UserNotificationDto[] = [];

  // 1. Welcome system notification
  notifs.push({
    id: `notif-welcome-${user.id}`,
    type: "SYSTEM",
    title: "خوش‌آمدید به اسپاتی‌کد",
    message: "به خانواده برنامه‌نویسان اسپاتی‌کد خوش آمدید! یادگیری تخصصی خود را آغاز کنید.",
    link: "/panel/courses",
    createdAt: user.createdAt.toISOString(),
    actor: {
      displayName: "اسپاتی‌کد",
      avatarUrl: "/favicon.svg",
    },
  });

  try {
    // 2. Fetch real User Enrollments
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    for (const enrollment of enrollments) {
      if (enrollment.course) {
        notifs.push({
          id: `notif-enroll-${enrollment.id}`,
          type: "COURSE",
          title: "ثبت‌نام دوره",
          message: `ثبت‌نام شما در دوره «${enrollment.course.title}» تایید شد و هم‌اکنون آماده مشاهده است.`,
          link: `/panel/courses/learn?courseId=${enrollment.courseId}`,
          createdAt: enrollment.createdAt.toISOString(),
          actor: {
            displayName: enrollment.course.instructor?.name || "مدرس دوره",
            avatarUrl: enrollment.course.instructor?.avatar || "/images/inst1.jpg",
          },
        });
      }
    }
  } catch (error) {
    console.error("[getUserNotifications] enrollments error:", error);
  }

  try {
    // 3. Fetch User Support Tickets with recent messages
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          where: { senderType: { in: ["admin", "operator", "support"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    });

    for (const ticket of tickets) {
      const lastMsg = ticket.messages[0];
      if (lastMsg) {
        notifs.push({
          id: `notif-ticket-${ticket.id}-${lastMsg.id}`,
          type: "SUPPORT",
          title: "پاسخ تیکت پشتیبانی",
          message: `پاسخ جدیدی برای تیکت «${ticket.title}» ثبت شد.`,
          link: `/panel/support/details?id=${ticket.id}`,
          createdAt: lastMsg.createdAt.toISOString(),
          actor: {
            displayName: lastMsg.senderName || "پشتیبانی اسپاتی‌کد",
            avatarUrl: "/favicon.svg",
          },
        });
      }
    }
  } catch (error) {
    console.error("[getUserNotifications] tickets error:", error);
  }

  try {
    // 4. Fetch User Orders
    const orders = await prisma.userOrder.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    for (const order of orders) {
      const isPaid = order.status === "completed" || order.status === "paid" || order.status === "approved";
      notifs.push({
        id: `notif-order-${order.id}`,
        type: "ORDER",
        title: isPaid ? "تراکنش موفق" : "سفارش ثبت‌شده",
        message: isPaid
          ? `تراکنش سفارش «${order.productTitle || "خرید دوره"}» با موفقیت نهایی شد.`
          : `سفارش جدید شما برای «${order.productTitle || "خرید دوره"}» با موفقیت ثبت گردید.`,
        link: `/panel/transactions`,
        createdAt: order.createdAt.toISOString(),
        actor: {
          displayName: "امور مالی",
          avatarUrl: "/favicon.svg",
        },
      });
    }
  } catch (error) {
    console.error("[getUserNotifications] orders error:", error);
  }

  // Sort by date descending
  return notifs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
