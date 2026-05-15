import React from "react";
import { mockTickets } from "../data";
import TicketDetailsClient from "./TicketDetailsClient";

export async function generateStaticParams() {
  return mockTickets.map((ticket) => ({
    id: ticket.id,
  }));
}

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const ticket = mockTickets.find((t) => t.id === resolvedParams.id);

  return <TicketDetailsClient ticket={ticket} />;
}
