'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function listShu(params?: { limit?: number; cursor?: string }) {
  const search = new URLSearchParams();
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.cursor) search.set('cursor', params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.shu.list}?${search.toString()}`
    : API_ENDPOINTS.shu.list;
  return apiFetch(endpoint);
}

export async function getShuAdminPreview() {
  return apiFetch(API_ENDPOINTS.shu.adminPreview);
}

export async function allocateShu(payload: {
  year: number;
  total_amount: number;
}) {
  return apiFetch(API_ENDPOINTS.shu.allocate, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function distributeShu(payload: {
  allocation_id: string;
  member_id: string;
  amount: number;
}) {
  return apiFetch(API_ENDPOINTS.shu.distribute, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getShuHistory(params?: { limit?: number; cursor?: string }) {
  const search = new URLSearchParams();
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.cursor) search.set('cursor', params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.shu.history}?${search.toString()}`
    : API_ENDPOINTS.shu.history;
  return apiFetch(endpoint);
}

