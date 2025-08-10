'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function getDashboardSummary() {
  return apiFetch(API_ENDPOINTS.dashboard.summary);
}

export async function getRevenueExpense() {
  const data = await apiFetch(API_ENDPOINTS.dashboard.revenueExpense);
  return data?.finance_chart ?? [];
}

export async function getTopProducts() {
  return apiFetch(API_ENDPOINTS.dashboard.topProducts);
}

export async function getDashboardNotifications() {
  return apiFetch(API_ENDPOINTS.dashboard.notifications);
}

