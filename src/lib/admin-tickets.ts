import type { Attachment, Message, Ticket, TimelineEvent } from "@/app/panel/support/data";
import { getTicketCategoryLabel, isTicketClosed } from "@/app/panel/support/data";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function unwrapResponse(value: unknown): unknown {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    if (!isRecord(current) || !("data" in current) || current.data == null) {
      break;
    }
    current = current.data;
  }
  return current;
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findByKeys(source: unknown, keys: string[]): unknown {
  if (!isRecord(source)) return undefined;
  const normalizedKeys = keys.map(normalizeKey);
  for (const [key, value] of Object.entries(source)) {
    if (normalizedKeys.includes(normalizeKey(key))) return value;
  }
  return undefined;
}

function findNestedArray(source: unknown, keys: string[]): unknown[] {
  if (!isRecord(source)) return [];
  for (const key of keys) {
    const direct = source[key];
    if (Array.isArray(direct)) return direct;
  }
  for (const value of Object.values(source)) {
    if (Array.isArray(value)) return value;
    const nested = findNestedArray(value, keys);
    if (nested.length > 0) return nested;
  }
  return [];
}

function normalizeString(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function normalizeStatus(value: unknown): string {
  const raw = String(value ?? "").trim();
  return raw || "open";
}

function normalizePriority(value: unknown): Ticket["priority"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["high", "زیاد", "urgent", "critical"].includes(raw)) return "high";
  if (["medium", "متوسط", "normal"].includes(raw)) return "medium";
  if (["low", "کم"].includes(raw)) return "low";
  return "low";
}

function normalizeSender(value: unknown): Message["sender"] {
  const raw = String(value ?? "").trim().toLowerCase();
  if (["support", "admin", "agent", "staff", "administrator"].includes(raw)) return "support";
  return "user";
}

function mapMessages(source: unknown): Message[] {
  const items = findNestedArray(source, ["messages", "replies", "comments", "conversation"]);
  return items.map((item, index) => {
    const row = isRecord(item) ? item : {};
    const sender = normalizeSender(
      findByKeys(row, ["senderType", "sender", "from", "author", "createdBy", "role"])
    );
    return {
      id: normalizeString(findByKeys(row, ["id", "messageId", "code"]), `m-${index + 1}`),
      sender,
      senderName: normalizeString(
        findByKeys(row, ["senderName", "authorName", "createdByName", "name"]),
        sender === "support" ? "پشتیبانی" : "کاربر"
      ),
      text: normalizeString(findByKeys(row, ["text", "message", "body", "content"]), ""),
      timestamp: normalizeString(findByKeys(row, ["timestamp", "createdAt", "date", "time"]), "—"),
      avatar: typeof findByKeys(row, ["avatar", "photo", "image"]) === "string" ? String(findByKeys(row, ["avatar", "photo", "image"])) : undefined,
    };
  });
}

function mapAttachments(source: unknown): Attachment[] {
  const items = findNestedArray(source, ["attachments", "files", "documents"]);
  return items.map((item, index) => {
    const row = isRecord(item) ? item : {};
    return {
      id: normalizeString(findByKeys(row, ["id", "fileId", "code"]), `a-${index + 1}`),
      name: normalizeString(findByKeys(row, ["name", "filename", "title"]), `فایل ${index + 1}`),
      size: normalizeString(findByKeys(row, ["size", "fileSize", "weight"]), "—"),
      type: normalizeString(findByKeys(row, ["type", "fileType", "mimeType"]), "file"),
    };
  });
}

function mapTimeline(source: unknown): TimelineEvent[] {
  const items = findNestedArray(source, ["timeline", "events", "history"]);
  return items.map((item, index) => {
    const row = isRecord(item) ? item : {};
    const status = String(findByKeys(row, ["status", "state"]) ?? "").trim().toLowerCase() === "pending" ? "pending" : "completed";
    return {
      id: normalizeString(findByKeys(row, ["id", "eventId", "code"]), `t-${index + 1}`),
      title: normalizeString(findByKeys(row, ["title", "name", "label"]), `رویداد ${index + 1}`),
      time: normalizeString(findByKeys(row, ["time", "timestamp", "createdAt", "date"]), "—"),
      icon: normalizeString(findByKeys(row, ["icon", "type", "kind"]), "circle"),
      status,
    };
  });
}

export function toTicket(source: unknown, index: number): Ticket {
  const row = isRecord(source) ? source : {};
  const closedAt = findByKeys(row, ["closedAt", "closed_at", "closedDate"]);
  const normalizedStatus = normalizeStatus(findByKeys(row, ["status", "state", "ticketStatus"]));
  const status =
    closedAt != null &&
    String(closedAt).trim() &&
    String(closedAt).toLowerCase() !== "null" &&
    !isTicketClosed(normalizedStatus)
      ? "closed"
      : normalizedStatus;
  const createdAt = normalizeString(findByKeys(row, ["createdAt", "created", "date", "openedAt"]), "—");
  const updatedAt = normalizeString(findByKeys(row, ["updatedAt", "updated", "lastUpdated", "timeAgo"]), createdAt);
  const messages = mapMessages(row);
  const attachments = mapAttachments(row);
  const timeline = mapTimeline(row);

  return {
    id: normalizeString(findByKeys(row, ["id", "ticketId", "code"]), `TIC-${index + 1}`),
    title: normalizeString(findByKeys(row, ["title", "subject", "summary", "message"]), "تیکت پشتیبانی"),
    status,
    priority: normalizePriority(findByKeys(row, ["priority", "urgency", "severity"])),
    category: getTicketCategoryLabel(normalizeString(findByKeys(row, ["category", "type", "department"]), "")),
    createdAt,
    updatedAt,
    messages,
    attachments,
    timeline,
  };
}

export function normalizeAdminTicketsResponse(response: unknown): Ticket[] {
  const payload = unwrapResponse(response);
  const items = Array.isArray(payload)
    ? payload
    : findNestedArray(payload, ["items", "tickets", "results", "data", "list", "rows", "records"]);

  if (!Array.isArray(items)) return [];

  return items.map((item, index) => toTicket(item, index));
}

export function normalizeAdminTicketResponse(response: unknown): Ticket {
  return toTicket(unwrapResponse(response), 0);
}

export function normalizeAdminTicketMessage(response: unknown): Message {
  const row = isRecord(unwrapResponse(response)) ? unwrapResponse(response) : {};
  const sender = normalizeSender(
    findByKeys(row, ["senderType", "sender", "from", "author", "createdBy", "role"])
  );

  return {
    id: normalizeString(findByKeys(row, ["id", "messageId", "code"]), `m-${Date.now()}`),
    sender,
    senderName: normalizeString(
      findByKeys(row, ["senderName", "authorName", "createdByName", "name"]),
      sender === "support" ? "پشتیبانی ادمین" : "کاربر"
    ),
    text: normalizeString(findByKeys(row, ["text", "message", "body", "content"]), ""),
    timestamp: normalizeString(findByKeys(row, ["timestamp", "createdAt", "date", "time"]), "—"),
    avatar:
      typeof findByKeys(row, ["avatar", "photo", "image"]) === "string"
        ? String(findByKeys(row, ["avatar", "photo", "image"]))
        : undefined,
  };
}
