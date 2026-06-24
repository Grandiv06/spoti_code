import { formatTicketDate, Message, Ticket } from "@/app/panel/support/data";
import { toTicket, unwrapResponse } from "@/lib/admin-tickets";
import { apiGetNoMock, apiPatchNoMock, apiPostNoMock } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-tokens";

function beautifyTicketDates(ticket: Ticket): Ticket {
  return {
    ...ticket,
    createdAt: formatTicketDate(ticket.createdAt),
    updatedAt: formatTicketDate(ticket.updatedAt),
    messages: ticket.messages.map((message) => ({
      ...message,
      timestamp: formatTicketDate(message.timestamp),
    })),
  };
}

function normalizeMessageSender(value: unknown): Message["sender"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["support", "admin", "agent", "staff"].includes(raw)) return "support";
  return "user";
}

function mapMessagesResponse(response: unknown): Message[] {
  const payload = unwrapResponse(response);
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { items?: unknown[] } | undefined)?.items)
      ? ((payload as { items?: unknown[] }).items as unknown[])
      : [];

  return rawList.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const createdAt = row.createdAt ? new Date(String(row.createdAt)) : null;
    const sender = normalizeMessageSender(row.senderType ?? row.sender ?? row.role);

    return {
      id: String(row.id ?? `msg-${index + 1}`),
      sender,
      senderName: String(
        row.senderName ??
          row.authorName ??
          (sender === "support" ? "پشتیبانی" : "کاربر")
      ),
      text: String(row.message ?? row.text ?? row.body ?? ""),
      timestamp:
        createdAt && !Number.isNaN(createdAt.getTime())
          ? formatTicketDate(createdAt.toISOString())
          : formatTicketDate(row.timestamp ?? row.createdAt),
    };
  });
}

export async function fetchMyTicketById(ticketId: string): Promise<Ticket> {
  const response = await apiGetNoMock<unknown>(
    `/api/tickets/my/${encodeURIComponent(ticketId)}`,
    getAuthHeaders()
  );
  return beautifyTicketDates(toTicket(unwrapResponse(response), 0));
}

export async function fetchMyTicketMessages(ticketId: string): Promise<Message[]> {
  const response = await apiGetNoMock<unknown>(
    `/api/tickets/my/${encodeURIComponent(ticketId)}/messages`,
    getAuthHeaders()
  );
  return mapMessagesResponse(response);
}

export async function closeMyTicket(ticketId: string): Promise<Ticket> {
  const response = await apiPatchNoMock<unknown>(
    `/api/tickets/my/${encodeURIComponent(ticketId)}/close`,
    undefined,
    getAuthHeaders()
  );
  return beautifyTicketDates(toTicket(unwrapResponse(response), 0));
}

export async function sendMyTicketMessage(ticketId: string, body: string): Promise<Message> {
  const response = await apiPostNoMock<unknown>(
    `/api/tickets/my/${encodeURIComponent(ticketId)}/messages`,
    { body },
    getAuthHeaders()
  );

  const row = (unwrapResponse(response) ?? {}) as Record<string, unknown>;
  const createdAt = row.createdAt ? new Date(String(row.createdAt)) : null;
  const sender = normalizeMessageSender(row.senderType ?? row.sender ?? row.role);

  return {
    id: String(row.id ?? `msg-${Date.now()}`),
    sender,
    senderName: String(row.senderName ?? row.authorName ?? (sender === "support" ? "پشتیبانی" : "کاربر")),
    text: String(row.body ?? row.message ?? row.text ?? body),
    timestamp:
      createdAt && !Number.isNaN(createdAt.getTime())
        ? formatTicketDate(createdAt.toISOString())
        : formatTicketDate(new Date().toISOString()),
  };
}
