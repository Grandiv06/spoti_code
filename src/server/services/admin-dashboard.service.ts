import type { User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";

type MonthlyPoint = {
  label: string;
  value: number;
};

const CHANNEL_COLORS = ["#22c55e", "#06b6d4", "#f59e0b", "#ef4444"];

function assertAdmin(user: User) {
  if (user.role !== "ADMIN") {
    throw new AuthError("دسترسی مدیریت لازم است", 403);
  }
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(date);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function isPaidStatus(status: string) {
  return ["success", "paid", "completed", "successful"].includes(status.toLowerCase());
}

function mapOrderStatus(status: string) {
  const normalized = status.toLowerCase();
  if (isPaidStatus(normalized)) return "paid";
  if (["refunded", "refund"].includes(normalized)) return "refunded";
  if (["failed", "error", "canceled", "cancelled"].includes(normalized)) return "failed";
  return "pending";
}

function mapTicketStatus(status: string) {
  const normalized = status.toLowerCase();
  if (["answered", "resolved", "closed"].includes(normalized)) return "closed";
  if (["investigating", "underreview", "reviewing"].includes(normalized)) return "investigating";
  return "open";
}

function buildMonthlyRevenue(orders: Array<{ amount: number; status: string; createdAt: Date }>): MonthlyPoint[] {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => addMonths(startOfMonth(now), index - 11));

  return months.map((monthStart) => {
    const nextMonth = addMonths(monthStart, 1);
    const value = orders
      .filter(
        (order) =>
          isPaidStatus(order.status) &&
          order.createdAt >= monthStart &&
          order.createdAt < nextMonth
      )
      .reduce((sum, order) => sum + order.amount, 0);

    return {
      label: monthLabel(monthStart),
      value,
    };
  });
}

export async function getAdminDashboardOverview(adminUser: User) {
  assertAdmin(adminUser);

  const now = new Date();
  const todayStart = startOfDay(now);
  const currentMonthStart = startOfMonth(now);
  const previousMonthStart = addMonths(currentMonthStart, -1);

  const [
    users,
    usersThisMonth,
    usersPreviousMonth,
    newUsersToday,
    courses,
    enrollments,
    orders,
    tickets,
  ] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, role: true, createdAt: true },
    }),
    prisma.user.count({
      where: { createdAt: { gte: currentMonthStart } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: previousMonthStart, lt: currentMonthStart } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
        categoryTitle: true,
        price: true,
        enrollments: { select: { id: true } },
      },
    }),
    prisma.courseEnrollment.findMany({
      select: {
        userId: true,
        courseId: true,
        updatedAt: true,
      },
    }),
    prisma.userOrder.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const currentMonthRevenue = orders
    .filter((order) => isPaidStatus(order.status) && order.createdAt >= currentMonthStart)
    .reduce((sum, order) => sum + order.amount, 0);
  const previousMonthRevenue = orders
    .filter(
      (order) =>
        isPaidStatus(order.status) &&
        order.createdAt >= previousMonthStart &&
        order.createdAt < currentMonthStart
    )
    .reduce((sum, order) => sum + order.amount, 0);

  const activeSince = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const activeUserIds = new Set<string>();
  for (const enrollment of enrollments) {
    if (enrollment.updatedAt >= activeSince) activeUserIds.add(enrollment.userId);
  }
  for (const order of orders) {
    if (order.updatedAt >= activeSince || order.createdAt >= activeSince) {
      activeUserIds.add(order.userId);
    }
  }
  for (const ticket of tickets) {
    if (ticket.updatedAt >= activeSince || ticket.createdAt >= activeSince) {
      activeUserIds.add(ticket.userId);
    }
  }

  const studentUsers = users.filter((user) => user.role === "USER");
  const inactiveStudents = studentUsers.filter((user) => !activeUserIds.has(user.id)).length;
  const churnRate = studentUsers.length ? Number(((inactiveStudents / studentUsers.length) * 100).toFixed(1)) : 0;

  const roleCounts = [
    { label: "دانشجو", value: users.filter((user) => user.role === "USER").length },
    { label: "مدرس", value: users.filter((user) => user.role === "INSTRUCTOR").length },
    { label: "ادمین", value: users.filter((user) => user.role === "ADMIN").length },
  ].map((item, index) => ({
    ...item,
    color: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
  }));

  const salesByCategory = courses
    .reduce<Array<{ label: string; value: number }>>((acc, course) => {
      const existing = acc.find((item) => item.label === course.categoryTitle);
      const value = course.enrollments.length;
      if (existing) existing.value += value;
      else acc.push({ label: course.categoryTitle, value });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const courseById = new Map(courses.map((course) => [course.id, course]));

  const paidOrders = orders.filter((order) => isPaidStatus(order.status));
  const todayOrders = orders.filter((order) => order.createdAt >= todayStart);
  const todayPaidOrders = todayOrders.filter((order) => isPaidStatus(order.status));

  return {
    totalUsers: users.length,
    usersGrowth: percentChange(usersThisMonth, usersPreviousMonth),
    activeUsers: activeUserIds.size,
    activeUsersGrowth: activeUserIds.size > 0 ? 0 : 0,
    revenueThisMonth: currentMonthRevenue,
    revenueGrowth: percentChange(currentMonthRevenue, previousMonthRevenue),
    churnRate,
    churnChange: 0,
    newUsersToday,
    conversionRateToday: todayOrders.length
      ? Number(((todayPaidOrders.length / todayOrders.length) * 100).toFixed(1))
      : 0,
    monthlyRevenueSeries: buildMonthlyRevenue(orders),
    channelData: roleCounts,
    salesByCategory,
    recentOrders: orders.slice(0, 8).map((order) => ({
      id: order.id,
      user: order.user.fullName || order.user.phone,
      course: order.productTitle || (order.courseId ? courseById.get(order.courseId)?.title : undefined) || "سفارش",
      amount: order.amount,
      date: formatDate(order.createdAt),
      status: mapOrderStatus(order.status),
    })),
    ticketsData: tickets.slice(0, 6).map((ticket) => ({
      id: ticket.id,
      title: ticket.title,
      owner: ticket.user.fullName || ticket.user.phone,
      updatedAt: formatDate(ticket.updatedAt),
      status: mapTicketStatus(ticket.status),
    })),
    totalPaidOrders: paidOrders.length,
    totalEnrollments: enrollments.length,
  };
}
