import { randomBytes } from "crypto";
import type { User } from "@prisma/client";
import type { PanelTicketDto, PanelTicketMessageDto } from "@/server/dto/panel-ticket.dto";
import {
  addTicketMessage,
  closeUserTicket,
  createUserTicket,
  findUserTicketById,
  findUserTickets,
} from "@/server/repositories/ticket.repository";

type TicketWithMessages = Awaited<ReturnType<typeof findUserTickets>>[number];

type TicketMessageRecord = {
  id: string;
  senderType: string;
  senderName: string;
  body: string;
  createdAt: Date;
};

function mapMessage(message: TicketMessageRecord): PanelTicketMessageDto {
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

function mapTicket(ticket: TicketWithMessages): PanelTicketDto {
  return {
    id: ticket.id,
    title: ticket.title,
    subject: ticket.title,
    category: ticket.category,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    messages: ticket.messages.map(mapMessage),
    attachments: [],
    timeline: [],
  };
}

export async function getMyTickets(user: User): Promise<PanelTicketDto[]> {
  const tickets = await findUserTickets(user.id);
  return tickets.map(mapTicket);
}

export async function getMyTicketById(user: User, ticketId: string): Promise<PanelTicketDto | null> {
  const ticket = await findUserTicketById(user.id, ticketId);
  return ticket ? mapTicket(ticket) : null;
}

export async function getMyTicketMessages(user: User, ticketId: string): Promise<PanelTicketMessageDto[] | null> {
  const ticket = await findUserTicketById(user.id, ticketId);
  if (!ticket) return null;
  return ticket.messages.map(mapMessage);
}

export async function createMyTicket(
  user: User,
  input: {
    subject?: string;
    title?: string;
    description?: string;
    firstMessage?: string;
    category?: string;
    priority?: string;
  }
): Promise<PanelTicketDto> {
  const title = (input.subject ?? input.title ?? "").trim();
  const firstMessage = (input.firstMessage ?? input.description ?? "").trim();
  const category = (input.category ?? "other").trim() || "other";

  if (!title) throw new Error("عنوان تیکت الزامی است");
  if (!firstMessage) throw new Error("توضیحات تیکت الزامی است");

  const ticket = await createUserTicket({
    id: `TIC-${randomBytes(4).toString("hex").toUpperCase()}`,
    userId: user.id,
    title,
    category,
    priority: input.priority,
    firstMessage,
    senderName: user.fullName?.trim() || "کاربر",
  });

  return mapTicket(ticket);
}

export async function sendMyTicketReply(
  user: User,
  ticketId: string,
  body: string
): Promise<PanelTicketMessageDto | null> {
  const text = body.trim();
  if (!text) throw new Error("متن پیام الزامی است");

  const ticket = await findUserTicketById(user.id, ticketId);
  if (!ticket) return null;
  if (ticket.status === "closed") throw new Error("این تیکت بسته شده است");

  const message = await addTicketMessage({
    id: `msg-${randomBytes(4).toString("hex")}`,
    ticketId,
    senderType: "user",
    senderName: user.fullName?.trim() || "کاربر",
    body: text,
  });

  return mapMessage(message);
}

export async function closeMyTicket(user: User, ticketId: string): Promise<PanelTicketDto | null> {
  const ticket = await closeUserTicket(user.id, ticketId);
  return ticket ? mapTicket(ticket) : null;
}
