'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function getMe() {
  return apiFetch(API_ENDPOINTS.users.me);
}

export async function listUsers(params?: { limit?: number; cursor?: string }) {
  const search = new URLSearchParams();
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.cursor) search.set('cursor', params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.users.list}?${search.toString()}`
    : API_ENDPOINTS.users.list;
  return apiFetch(endpoint);
}

export async function inviteUser(payload: { email: string }) {
  return apiFetch(API_ENDPOINTS.users.invite, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateUserRole(id: string | number, payload: { role: string }) {
  return apiFetch(API_ENDPOINTS.users.updateRole(id), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deactivateUser(id: string | number) {
  return apiFetch(API_ENDPOINTS.users.deactivate(id), {
    method: 'PATCH',
  });
}
