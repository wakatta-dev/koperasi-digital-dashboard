/** @format */

"use server";

import { ensureSuccess } from "@/lib/api";
import type { Transaction } from "@/types/api";
import {
  createTransaction as createTx,
  deleteTransaction as deleteTx,
  getTransactionHistory as getTxHistory,
  listTransactions as listTx,
  updateTransaction as updateTx,
} from "@/services/api";

export async function listTransactionsAction(params?: Record<string, string | number>) {
  try {
    const res = await listTx(params);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListTransactionsActionResult = Awaited<
  ReturnType<typeof listTransactionsAction>
>;

export async function createTransactionAction(
  payload: Partial<Transaction> & {
    debit_account_code: string;
    debit_account_name: string;
    credit_account_code: string;
    credit_account_name: string;
  }
) {
  try {
    const res = await createTx(payload as any);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export async function updateTransactionAction(id: string | number, payload: Partial<Transaction>) {
  try {
    const res = await updateTx(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export async function deleteTransactionAction(id: string | number) {
  try {
    const res = await deleteTx(id);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export async function getTransactionHistoryAction(id: string | number) {
  try {
    const res = await getTxHistory(id);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}
