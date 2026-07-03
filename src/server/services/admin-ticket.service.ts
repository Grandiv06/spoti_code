import { randomBytes } from "crypto";
import type { SupportTicket, SupportTicketMessage, User } from "@prisma/client";
import { AuthError } from "@/server/auth/request-auth";
import { prisma } from "@/server/db/prisma";

type AdminTicketsQuery = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
};

type TicketWithRelations = SupportTicket & {
  user: Pick<User, "id" | "fullName" | "phone">;
  messages: SupportTicketMessage[];
};

function assertAdmin(user: User) {
  if (user.role !== "ADMIN") {
    throw new AuthError("دسترسی مدیریت لازم است", 403);
  }
}

function mapStatusFilter(status?: string): string[] | undefined {
  if (!status) return undefined;
  const normalized = status.toLowerCase();
  if (normalized === "open" || normalized === "investigating" || normalized === "underreview") {
    return ["open", "investigating", "underReview", "pending"];
  }
  if (normalized === "answered") return ["answered", "replied", "waitingForUser"];
  if (normalized === "closed") return ["closed", "closedByAdmin", "closedByUser", "resolved"];
  return [status];
}

function normalizeNextStatus(status: unknown): string {
  const normalized = String(status ?? "").trim().toLowerCase();
  if (["closed", "closedbyadmin", "resolved", "بسته"].includes(normalized)) return "closedByAdmin";
  if (["closedbyuser"].includes(normalized)) return "closedByUser";
  if (["answered", "replied", "پاسخ داده شده"].includes(normalized)) return "answered";
  if (["investigating", "underreview", "under_review", "open", "در حال بررسی"].includes(normalized)) {
    return "investigating";
  }
  return "open";
}

function mapMessage(message: SupportTicketMessage) {
  const sender = message.senderType === "support" || message.senderType === "admin" ? "support" : "user";
  const createdAt = message.createdAt.toISOString();

  return {
    id: message.id,
    sender,
    senderType: sender,
    senderName: message.senderName,
    message: message.body,
    text: message.body,
    body: message.body,
    timestamp: createdAt,
    createdAt,
  };
}

function normalizeStoredStatus(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "closed" || normalized === "resolved") return "closedByAdmin";
  return status;
}

function buildTimeline(ticket: TicketWithRelations) {
  const events = [
    {
      id: `${ticket.id}-created`,
      title: "ثبت تیکت",
      time: ticket.createdAt.toISOString(),
      icon: "message-square",
      status: "completed",
    },
  ];

  if (ticket.messages.some((message) => message.senderType === "support" || message.senderType === "admin")) {
    events.push({
      id: `${ticket.id}-answered`,
      title: "پاسخ پشتیبانی",
      time: ticket.updatedAt.toISOString(),
      icon: "headphones",
      status: "completed",
    });
  }

  if (ticket.status.toLowerCase().includes("closed") || ticket.status === "resolved") {
    events.push({
      id: `${ticket.id}-closed`,
      title: "بستن تیکت",
      time: ticket.updatedAt.toISOString(),
      icon: "check-circle",
      status: "completed",
    });
  }

  return events;
}

function mapTicket(ticket: TicketWithRelations) {
  const status = normalizeStoredStatus(ticket.status);

  return {
    id: ticket.id,
    title: ticket.title,
    subject: ticket.title,
    category: ticket.category,
    status,
    priority: ticket.priority || "low",
    userId: ticket.userId,
    user: {
      id: ticket.user.id,
      fullName: ticket.user.fullName || ticket.user.phone,
      phone: ticket.user.phone,
    },
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    messages: ticket.messages.map(mapMessage),
    attachments: [],
    timeline: buildTimeline(ticket),
  };
}

async function findTicketById(ticketId: string) {
  return prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getAdminTickets(adminUser: User, query: AdminTicketsQuery = {}) {
  assertAdmin(adminUser);

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 50));
  const statusFilter = mapStatusFilter(query.status);

  const tickets = await prisma.supportTicket.findMany({
    where: {
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
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const search = query.search?.trim().toLowerCase();
  const mappedTickets = tickets.map(mapTicket);
  const filteredTickets = search
    ? mappedTickets.filter((ticket) =>
        [
          ticket.id,
          ticket.title,
          ticket.category,
          ticket.status,
          ticket.user.fullName,
          ticket.user.phone,
          ...ticket.messages.map((message) => message.text),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)
      )
    : mappedTickets;
  const start = (page - 1) * limit;

  return {
    items: filteredTickets.slice(start, start + limit),
    tickets: filteredTickets.slice(start, start + limit),
    total: filteredTickets.length,
    meta: {
      total: filteredTickets.length,
      page,
      limit,
    },
  };
}

export async function getAdminTicketById(adminUser: User, ticketId: string) {
  assertAdmin(adminUser);
  const ticket = await findTicketById(ticketId);
  return ticket ? mapTicket(ticket) : null;
}

export async function updateAdminTicketStatus(adminUser: User, ticketId: string, status: unknown) {
  assertAdmin(adminUser);
  const nextStatus = normalizeNextStatus(status);

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      status: nextStatus,
      updatedAt: new Date(),
    },
  });

  return getAdminTicketById(adminUser, ticketId);
}

export async function closeAdminTicket(adminUser: User, ticketId: string) {
  return updateAdminTicketStatus(adminUser, ticketId, "closed");
}

export async function sendAdminTicketMessage(adminUser: User, ticketId: string, body: unknown) {
  assertAdmin(adminUser);
  const text = String(body ?? "").trim();
  if (!text) {
    throw new AuthError("متن پاسخ الزامی است", 400);
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    select: { id: true, status: true },
  });
  if (!ticket) return null;
  if (ticket.status.toLowerCase().includes("closed") || ticket.status === "resolved") {
    throw new AuthError("این تیکت بسته شده است", 400);
  }

  const message = await prisma.supportTicketMessage.create({
    data: {
      id: `msg-admin-${randomBytes(4).toString("hex")}`,
      ticketId,
      senderType: "support",
      senderName: adminUser.fullName?.trim() || "پشتیبانی اسپاتی‌کد",
      body: text,
    },
  });

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      status: "answered",
      updatedAt: new Date(),
    },
  });

  return mapMessage(message);
}
