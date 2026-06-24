"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetNoMock } from "@/lib/api";
import { Ticket, formatTicketDate } from "@/app/panel/support/data";
import { closeMyTicket } from "@/lib/panel-tickets";
import { toTicket } from "@/lib/admin-tickets";

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
        const ticket = toTicket(item, index);
        return {
          ...ticket,
          createdAt: formatTicketDate(ticket.createdAt),
          updatedAt: formatTicketDate(ticket.updatedAt),
        };
      });
    },
  });
}

export function useCloseMyTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeMyTicket,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ticketQueryKey });
    },
  });
}
