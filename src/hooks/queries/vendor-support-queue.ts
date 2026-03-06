/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getVendorSupportAnalytics,
  getVendorSupportQueueSummary,
  getVendorSupportTicketDetail,
} from "@/services/api";
import { QK } from "./queryKeys";

export function useVendorSupportQueue() {
  return useQuery({
    queryKey: QK.vendorSupportQueue.summary(),
    queryFn: ({ signal }) => getVendorSupportQueueSummary({ signal }),
  });
}

export function useVendorSupportTicket(ticketId: string) {
  return useQuery({
    queryKey: QK.vendorSupportQueue.detail(ticketId),
    queryFn: ({ signal }) => getVendorSupportTicketDetail(ticketId, { signal }),
    enabled: Boolean(ticketId),
  });
}

export function useVendorSupportAnalytics() {
  return useQuery({
    queryKey: QK.vendorSupportQueue.analytics(),
    queryFn: ({ signal }) => getVendorSupportAnalytics({ signal }),
  });
}
