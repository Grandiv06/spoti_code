import { Suspense } from "react";
import TicketDetailsClient from "./TicketDetailsClient";
import TicketDetailsSkeleton from "./TicketDetailsSkeleton";

export default function TicketDetailsPage() {
  return (
    <Suspense fallback={<TicketDetailsSkeleton />}>
      <TicketDetailsClient />
    </Suspense>
  );
}
