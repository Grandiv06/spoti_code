"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Ticket, mockTickets } from "@/app/panel/support/data";

export const ticketQueryKey = ["tickets"] as const;

export function useTicketsQuery() {
  return useQuery<Ticket[]>({
    queryKey: ticketQueryKey,
    queryFn: () => apiGet("/api/tickets"),
    placeholderData: mockTickets,
  });
}
