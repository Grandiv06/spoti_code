import { prisma } from "@/server/db/prisma";

export async function findUserTickets(userId: string) {
  return prisma.supportTicket.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function findUserTicketById(userId: string, ticketId: string) {
  return prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createUserTicket(input: {
  id: string;
  userId: string;
  title: string;
  category: string;
  priority?: string;
  firstMessage: string;
  senderName: string;
}) {
  return prisma.supportTicket.create({
    data: {
      id: input.id,
      userId: input.userId,
      title: input.title,
      category: input.category,
      priority: input.priority ?? "medium",
      status: "open",
      messages: {
        create: {
          id: `${input.id}-msg-1`,
          senderType: "user",
          senderName: input.senderName,
          body: input.firstMessage,
        },
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function addTicketMessage(input: {
  id: string;
  ticketId: string;
  senderType: string;
  senderName: string;
  body: string;
}) {
  const message = await prisma.supportTicketMessage.create({
    data: {
      id: input.id,
      ticketId: input.ticketId,
      senderType: input.senderType,
      senderName: input.senderName,
      body: input.body,
    },
  });

  await prisma.supportTicket.update({
    where: { id: input.ticketId },
    data: {
      status: input.senderType === "user" ? "open" : "answered",
      updatedAt: new Date(),
    },
  });

  return message;
}

export async function closeUserTicket(userId: string, ticketId: string) {
  const existing = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
  });
  if (!existing) return null;

  return prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: "closed" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
