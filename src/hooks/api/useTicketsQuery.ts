"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetNoMock } from "@/lib/api";
import { Ticket, formatTicketDate, type TicketUrgency } from "@/app/panel/support/data";

export const ticketQueryKey = ["tickets"] as const;

export function useTicketsQuery() {
  return useQuery<Ticket[]>({
    queryKey: ticketQueryKey,
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const result = await apiGetNoMock<{ data?: unknown }>(
        "/api/dashboard/my-tickets",
        token ? { Authorization: `Bearer ${token}` } : undefined
      );

      const rawList = Array.isArray(result?.data)
        ? result.data
        : Array.isArray((result?.data as { items?: unknown[] } | undefined)?.items)
          ? ((result?.data as { items?: unknown[] }).items as unknown[])
          : [];

      return rawList.map((item, index) => {
        const row = (item ?? {}) as Record<string, unknown>;
        const rawStatus = String(row.status ?? "").toLowerCase();
        const status: Ticket["status"] =
          rawStatus === "underreview" || rawStatus === "investigating"
            ? "investigating"
            : rawStatus === "answered"
              ? "answered"
              : rawStatus === "closed"
                ? "closed"
                : "open";
        const rawPriority = String(row.urgency ?? row.priority ?? "").toLowerCase();
        const priority: TicketUrgency =
          rawPriority === "high" ? "high" : rawPriority === "medium" ? "medium" : "low";

        return {
          id: String(row.id ?? row.ticketId ?? `TKT-${index + 1}`),
          title: String(row.title ?? row.subject ?? "تیکت پشتیبانی"),
          category: String(row.category ?? "عمومی"),
          status,
          priority,
          createdAt: formatTicketDate(row.createdAt),
          updatedAt: formatTicketDate(row.updatedAt ?? row.createdAt),
          messages: [],
          attachments: [],
          timeline: [],
        };
      });
    },
  });
}
