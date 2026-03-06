/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendorSupportQueueSummary } from "@/services/api";
import { QK } from "./queryKeys";

export function useVendorSupportQueue() {
  return useQuery({
    queryKey: QK.vendorSupportQueue.summary(),
    queryFn: getVendorSupportQueueSummary,
  });
}
