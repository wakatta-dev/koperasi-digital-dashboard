/** @format */

import { VendorTicketDetailPage } from "@/modules/vendor";

type VendorTicketDetailPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function VendorTicketDetailRoute({
  params,
}: VendorTicketDetailPageProps) {
  const { ticketId } = await params;
  return <VendorTicketDetailPage ticketId={ticketId} />;
}
