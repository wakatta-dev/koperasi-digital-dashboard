'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function register(payload: {
  email: string;
  full_name: string;
  password: string;
  role: string;
}) {
  return apiFetch(API_ENDPOINTS.auth.register, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(payload: {
  email: string;
  password: string;
}) {
  return apiFetch(API_ENDPOINTS.auth.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload: { email: string }) {
  return apiFetch(API_ENDPOINTS.auth.forgotPassword, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: {
  token: string;
  password: string;
}) {
  return apiFetch(API_ENDPOINTS.auth.resetPassword, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
