'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function listLoans(params?: { limit?: number; cursor?: string }) {
  const search = new URLSearchParams();
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.cursor) search.set('cursor', params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.loans.list}?${search.toString()}`
    : API_ENDPOINTS.loans.list;
  return apiFetch(endpoint);
}

export async function applyLoan(payload: {
  member_id: string;
  principal: number;
  margin: number;
  tenor: number;
  scheme: string;
}) {
  return apiFetch(API_ENDPOINTS.loans.apply, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getLoanDetail(id: string | number) {
  return apiFetch(API_ENDPOINTS.loans.detail(id));
}

export async function approveLoan(id: string | number) {
  return apiFetch(API_ENDPOINTS.loans.approve(id), { method: 'PATCH' });
}

export async function rejectLoan(id: string | number) {
  return apiFetch(API_ENDPOINTS.loans.reject(id), { method: 'PATCH' });
}

export async function getLoanSchedule(id: string | number) {
  return apiFetch(API_ENDPOINTS.loans.schedule(id));
}

export async function recordLoanRepayment(
  id: string | number,
  payload: { amount: number }
) {
  return apiFetch(API_ENDPOINTS.loans.repayment(id), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function signLoanAgreement(payload: { loan_id: string }) {
  return apiFetch(API_ENDPOINTS.loans.signAgreement, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getLoanAdminSummary() {
  return apiFetch(API_ENDPOINTS.loans.adminSummary);
}

