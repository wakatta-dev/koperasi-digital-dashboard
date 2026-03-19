/** @format */

import type { Metadata } from "next";

import { VendorTicketDetailPage } from "@/modules/vendor";

type VendorTicketDetailPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vendor - Tickets - Detail - Koperasi Digital",
  description: "Vendor - Tickets - Detail page.",
};

export default async function VendorTicketDetailRoute({
  params,
}: VendorTicketDetailPageProps) {
  const { ticketId } = await params;
  return <VendorTicketDetailPage ticketId={ticketId} />;
}
