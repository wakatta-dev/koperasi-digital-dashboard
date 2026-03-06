/** @format */

import { VendorFeaturePlaceholderPage } from "@/modules/vendor";

type VendorTicketDetailPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function VendorTicketDetailPage({
  params,
}: VendorTicketDetailPageProps) {
  const { ticketId } = await params;
  return (
    <VendorFeaturePlaceholderPage
      title={`Ticket ${ticketId}`}
      description="Detail ticket vendor masih menunggu kontrak assignment, reply, dan SLA dari backend admin."
    />
  );
}
