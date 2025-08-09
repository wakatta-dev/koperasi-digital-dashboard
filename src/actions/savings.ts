'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function listSavings(params?: { limit?: number; cursor?: string }) {
  const search = new URLSearchParams();
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.cursor) search.set('cursor', params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.savings.list}?${search.toString()}`
    : API_ENDPOINTS.savings.list;
  return apiFetch(endpoint);
}

export async function createSavings(payload: {
  member_id: string;
  type: string;
  scheme: string;
  balance: number;
}) {
  return apiFetch(API_ENDPOINTS.savings.create, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getSavingsAdminSummary() {
  return apiFetch(API_ENDPOINTS.savings.adminSummary);
}

export async function approveSavingsWithdrawal(payload: { id: string }) {
  return apiFetch(API_ENDPOINTS.savings.approveWithdrawal, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function depositSavings(payload: {
  savings_id: string;
  amount: number;
}) {
  return apiFetch(API_ENDPOINTS.savings.deposit, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function distributeProfitSharing(payload: {
  savings_id: string;
  amount: number;
}) {
  return apiFetch(API_ENDPOINTS.savings.distributeProfitSharing, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getSavingsTransactions(savings_id: string) {
  return apiFetch(
    `${API_ENDPOINTS.savings.transactions}?savings_id=${encodeURIComponent(
      savings_id
    )}`
  );
}

export async function getSavingsTypes() {
  return apiFetch(API_ENDPOINTS.savings.types);
}

export async function verifySavingsDeposit(payload: { id: string }) {
  return apiFetch(API_ENDPOINTS.savings.verifyDeposit, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function requestSavingsWithdrawal(payload: {
  savings_id: string;
  amount: number;
}) {
  return apiFetch(API_ENDPOINTS.savings.withdrawal, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

