/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { QK } from "@/hooks/queries/queryKeys";
import {
  getBalanceSheet,
  getCashFlow,
  getChannels,
  getOverview,
  getProfitLoss,
  getTopProducts,
} from "@/services/api";
import type {
  BalanceSheetResponse,
  CashFlowResponse,
  ChannelsResponse,
  FinanceQuery,
  OverviewResponse,
  ProfitLossResponse,
  TopProductsResponse,
} from "../types";
import {
  sampleBalanceSheetResponse,
  sampleCashFlowResponse,
  sampleChannelsResponse,
  sampleOverviewResponse,
  sampleProfitLossResponse,
  sampleTopProductsResponse,
} from "../fixtures";

export function useFinanceOverview(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.overview(params ?? {}),
    queryFn: async (): Promise<OverviewResponse> => {
      try {
        return ensureSuccess(await getOverview(params));
      } catch (err) {
        console.warn("finance overview fallback to sample data", err);
        return sampleOverviewResponse;
      }
    },
    enabled: options?.enabled ?? true,
  });
}

export function useProfitLoss(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.profitLoss(params ?? {}),
    queryFn: async (): Promise<ProfitLossResponse> => {
      try {
        return ensureSuccess(await getProfitLoss(params));
      } catch (err) {
        console.warn("finance profit-loss fallback to sample data", err);
        return sampleProfitLossResponse;
      }
    },
    enabled: options?.enabled ?? true,
  });
}

export function useCashFlow(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.cashFlow(params ?? {}),
    queryFn: async (): Promise<CashFlowResponse> => {
      try {
        return ensureSuccess(await getCashFlow(params));
      } catch (err) {
        console.warn("finance cash-flow fallback to sample data", err);
        return sampleCashFlowResponse;
      }
    },
    enabled: options?.enabled ?? true,
  });
}

export function useBalanceSheet(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.balanceSheet(params ?? {}),
    queryFn: async (): Promise<BalanceSheetResponse> => {
      try {
        return ensureSuccess(await getBalanceSheet(params));
      } catch (err) {
        console.warn("finance balance-sheet fallback to sample data", err);
        return sampleBalanceSheetResponse;
      }
    },
    enabled: options?.enabled ?? true,
  });
}

export function useFinanceTopProducts(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.topProducts(params ?? {}),
    queryFn: async (): Promise<TopProductsResponse> => {
      try {
        const res = ensureSuccess(await getTopProducts(params));
        // Backend may return an array directly; normalize to { items }.
        if (Array.isArray(res)) {
          return { items: res };
        }
        return res;
      } catch (err) {
        console.warn("finance top-products fallback to sample data", err);
        return sampleTopProductsResponse;
      }
    },
    enabled: options?.enabled ?? true,
  });
}

export function useFinanceChannels(
  params?: FinanceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.finance.channels(params ?? {}),
    queryFn: async (): Promise<ChannelsResponse> => {
      try {
        const res = ensureSuccess(await getChannels(params));
        // Backend may return an array directly; normalize to { items }.
        if (Array.isArray(res)) {
          return { items: res };
        }
        return res;
      } catch (err) {
        console.warn("finance channels fallback to sample data", err);
        return sampleChannelsResponse;
      }
    },
    enabled: options?.enabled ?? true,
  });
}
