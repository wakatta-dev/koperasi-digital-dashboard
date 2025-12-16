/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { QK } from "@/hooks/queries/queryKeys";
import { getSalesSummary } from "@/services/api";
import type { FinanceQuery, SalesSummaryResponse } from "../types";

export function useFinanceSummary(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.summary(params ?? {}),
    queryFn: async (): Promise<SalesSummaryResponse> =>
      ensureSuccess(await getSalesSummary(params)),
    enabled: options?.enabled ?? true,
  });
}
