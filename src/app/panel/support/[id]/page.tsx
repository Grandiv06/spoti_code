import TicketDetailsClient from "./TicketDetailsClient";
import { mockTickets, Ticket } from "../data";
export function generateStaticParams() {
  return mockTickets.map((ticket) => ({
    id: ticket.id,
  }));
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function TicketDetailsPage({ params }: PageProps) {
  const ticket = mockTickets.find((item) => item.id === params.id);
  return <TicketDetailsClient ticket={ticket} />;
}
