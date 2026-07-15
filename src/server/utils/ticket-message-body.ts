export type TicketMessageAttachment = {
  name: string;
  url: string;
  size: number;
  type: string;
};

const ATTACHMENT_MARKER = "\n\n---ticket-attachments---\n";

export function serializeTicketMessageBody(text: string, attachments?: TicketMessageAttachment[]) {
  const trimmed = text.trim();
  if (!attachments?.length) return trimmed;
  return `${trimmed}${ATTACHMENT_MARKER}${JSON.stringify(attachments)}`;
}

export function parseTicketMessageBody(body: string): {
  text: string;
  attachments: TicketMessageAttachment[];
} {
  const markerIndex = body.indexOf(ATTACHMENT_MARKER);
  if (markerIndex === -1) {
    return { text: body, attachments: [] };
  }

  const text = body.slice(0, markerIndex).trim();
  const raw = body.slice(markerIndex + ATTACHMENT_MARKER.length);

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return { text, attachments: [] };

    const attachments = parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        const name = typeof row.name === "string" ? row.name.trim() : "";
        const url = typeof row.url === "string" ? row.url.trim() : "";
        if (!name || !url) return null;
        return {
          name,
          url,
          size: typeof row.size === "number" ? row.size : Number(row.size ?? 0),
          type: typeof row.type === "string" ? row.type : "application/octet-stream",
        } satisfies TicketMessageAttachment;
      })
      .filter(Boolean) as TicketMessageAttachment[];

    return { text, attachments };
  } catch {
    return { text: body, attachments: [] };
  }
}
