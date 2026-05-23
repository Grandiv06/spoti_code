import React from "react";
import { mockTickets } from "../data";
import TicketDetailsClient from "./TicketDetailsClient";
import { apiGet } from "@/lib/api";

export async function generateStaticParams() {
  try {
    const tickets = await apiGet<{ id: string }[]>("/api/tickets");
    return tickets.map((ticket) => ({ id: ticket.id }));
  } catch {
    return mockTickets.map((ticket) => ({ id: ticket.id }));
  }
}

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let ticket = mockTickets.find((t) => t.id === resolvedParams.id);

  try {
    ticket = await apiGet(`/api/tickets/${resolvedParams.id}`);
  } catch {
    ticket = mockTickets.find((t) => t.id === resolvedParams.id);
  }

  return <TicketDetailsClient ticket={ticket} />;
}
