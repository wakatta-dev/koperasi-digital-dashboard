'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function listModules(params?: { limit?: number; cursor?: string }) {
  const search = new URLSearchParams();
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.cursor) search.set('cursor', params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.modules.list}?${search.toString()}`
    : API_ENDPOINTS.modules.list;
  return apiFetch(endpoint);
}

export async function activateModule(id: string | number) {
  return apiFetch(API_ENDPOINTS.modules.activate(id), { method: 'POST' });
}

export async function deactivateModule(id: string | number) {
  return apiFetch(API_ENDPOINTS.modules.deactivate(id), { method: 'POST' });
}

