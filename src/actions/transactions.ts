/** @format */

"use server";

import { ensureSuccess } from "@/lib/api";
import type {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  ListTransactionsQuery,
} from "@/types/api";
import {
  createTransaction as createTx,
  deleteTransaction as deleteTx,
  getTransactionHistory as getTxHistory,
  listTransactions as listTx,
  updateTransaction as updateTx,
} from "@/services/api";

export async function listTransactionsAction(
  params?: ListTransactionsQuery,
) {
  try {
    const res = await listTx(params as any);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListTransactionsActionResult = Awaited<
  ReturnType<typeof listTransactionsAction>
>;

export async function createTransactionAction(
  payload: CreateTransactionRequest,
) {
  try {
    const res = await createTx(payload as any);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export async function updateTransactionAction(
  id: string | number,
  payload: UpdateTransactionRequest,
) {
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

export async function getTransactionHistoryAction(
  id: string | number,
) {
  try {
    const res = await getTxHistory(id);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}
