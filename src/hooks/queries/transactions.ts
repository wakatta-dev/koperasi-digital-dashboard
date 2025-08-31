/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Transaction, TransactionHistory } from "@/types/api";
import {
  createTransaction,
  deleteTransaction,
  getTransactionHistory,
  listTransactions,
  updateTransaction,
} from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";

export function useTransactions(
  params?: Record<string, string | number>,
  initialData?: Transaction[]
) {
  return useQuery({
    queryKey: QK.transactions.list(params),
    queryFn: async () => ensureSuccess(await listTransactions(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTransactionHistory(
  id?: string | number,
  initialData?: TransactionHistory[]
) {
  return useQuery({
    queryKey: QK.transactions.history(id ?? ""),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await getTransactionHistory(id as any)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTransactionActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (
      payload: Partial<Transaction> & {
        debit_account_code: string;
        debit_account_name: string;
        credit_account_code: string;
        credit_account_name: string;
      }
    ) => ensureSuccess(await createTransaction(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.transactions.list() });
    },
  });

  const update = useMutation({
    mutationFn: async (vars: { id: string | number; payload: Partial<Transaction> }) =>
      ensureSuccess(await updateTransaction(vars.id, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.transactions.list() });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string | number) => ensureSuccess(await deleteTransaction(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.transactions.list() });
    },
  });

  return { create, update, remove } as const;
}

