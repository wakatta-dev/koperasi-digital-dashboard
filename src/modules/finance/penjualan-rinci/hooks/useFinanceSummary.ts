/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { QK } from "@/hooks/queries/queryKeys";
import { getSalesSummary } from "@/services/api";
import type { FinanceQuery, SalesSummaryResponse } from "../types";
import { sampleSummaryResponse } from "@/modules/finance/fixtures";

export function useFinanceSummary(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.summary(params ?? {}),
    queryFn: async (): Promise<SalesSummaryResponse> => {
      try {
        return ensureSuccess(await getSalesSummary(params));
      } catch (err) {
        console.warn("finance summary fallback to sample data", err);
        return sampleSummaryResponse;
      }
    },
    enabled: options?.enabled ?? true,
  });
}
