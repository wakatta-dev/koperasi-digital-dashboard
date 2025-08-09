'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function getBusinessProfile() {
  return apiFetch(API_ENDPOINTS.businessProfile.root);
}

export async function updateBusinessProfile(payload: {
  name: string;
  address: string;
  phone: string;
}) {
  return apiFetch(API_ENDPOINTS.businessProfile.root, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
