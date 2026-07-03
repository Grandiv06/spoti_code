import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";

type AdminOrdersQuery = {
  search?: string;
  status?: string;
  userId?: string;
  courseId?: string;
  page?: number;
  limit?: number;
};

const PAID_STATUSES = ["paid", "success", "successful", "completed"];
const PENDING_STATUSES = ["pending", "redirected", "waiting", "awaiting_payment", "processing"];
const CANCELED_STATUSES = ["canceled", "cancelled", "expired", "failed", "error", "refunded"];

function assertAdmin(user: User) {
  if (user.role !== "ADMIN") {
    throw new AuthError("دسترسی مدیریت لازم است", 403);
  }
}

function mapStatusFilter(status?: string): string[] | undefined {
  if (!status) return undefined;
  const normalized = status.toLowerCase();
  if (normalized === "paid") return PAID_STATUSES;
  if (normalized === "pending" || normalized === "redirected") return PENDING_STATUSES;
  if (normalized === "canceled" || normalized === "failed" || normalized === "expired") {
    return CANCELED_STATUSES;
  }
  return [status];
}

function normalizeStatus(status: string): string {
  const normalized = status.toLowerCase();
  if (PAID_STATUSES.includes(normalized)) return "paid";
  if (CANCELED_STATUSES.includes(normalized)) return "canceled";
  return "pending";
}

function formatDate(value: Date): string {
  return value.toISOString();
}

export async function getAdminOrders(adminUser: User, query: AdminOrdersQuery = {}) {
  assertAdmin(adminUser);

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 50));
  const statusFilter = mapStatusFilter(query.status);

  const orders = await prisma.userOrder.findMany({
    where: {
      userId: query.userId?.trim() || undefined,
      courseId: query.courseId?.trim() || undefined,
      status: statusFilter ? { in: statusFilter } : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const courseIds = Array.from(
    new Set(orders.map((order) => order.courseId).filter((courseId): courseId is string => Boolean(courseId)))
  );
  const courses = courseIds.length
    ? await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true },
      })
    : [];
  const courseById = new Map(courses.map((course) => [course.id, course.title]));

  const mappedOrders = orders.map((order) => {
    const userName = order.user.fullName?.trim() || order.user.phone;
    const courseTitle =
      order.productTitle?.trim() ||
      (order.courseId ? courseById.get(order.courseId) : undefined) ||
      order.description?.trim() ||
      "سفارش";

    return {
      id: order.id,
      orderId: order.id,
      userId: order.userId,
      user: {
        id: order.user.id,
        fullName: userName,
        phone: order.user.phone,
      },
      courseId: order.courseId || "",
      course: {
        id: order.courseId || "",
        title: courseTitle,
      },
      courseTitle,
      productTitle: courseTitle,
      amount: order.amount,
      totalAmount: order.amount,
      status: normalizeStatus(order.status),
      paymentStatus: normalizeStatus(order.status),
      type: order.type,
      paymentMethod: order.paymentMethod || "",
      trackingCode: order.trackingCode || "",
      description: order.description || "",
      createdAt: formatDate(order.createdAt),
      updatedAt: formatDate(order.updatedAt),
    };
  });

  const search = query.search?.trim().toLowerCase();
  const filteredOrders = search
    ? mappedOrders.filter((order) =>
        [
          order.id,
          order.user.fullName,
          order.user.phone,
          order.course.title,
          order.productTitle,
          order.trackingCode,
          order.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
      )
    : mappedOrders;

  const start = (page - 1) * limit;

  return {
    items: filteredOrders.slice(start, start + limit),
    orders: filteredOrders.slice(start, start + limit),
    total: filteredOrders.length,
    meta: {
      total: filteredOrders.length,
      page,
      limit,
    },
  };
}
