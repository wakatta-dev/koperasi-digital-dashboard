'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function getBillingSummary() {
  return apiFetch(API_ENDPOINTS.billing.summary);
}

export async function getBillingUsage() {
  return apiFetch(API_ENDPOINTS.billing.usage);
}
