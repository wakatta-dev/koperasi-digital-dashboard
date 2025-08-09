'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function getProfitLossReport() {
  return apiFetch(API_ENDPOINTS.reports.profitLoss);
}

export async function getCashflowReport() {
  return apiFetch(API_ENDPOINTS.reports.cashflow);
}

export async function getBalanceSheetReport() {
  return apiFetch(API_ENDPOINTS.reports.balanceSheet);
}

export async function getSalesReport() {
  return apiFetch(API_ENDPOINTS.reports.sales);
}

export async function getSalesProductsReport() {
  return apiFetch(API_ENDPOINTS.reports.salesProducts);
}

export async function exportReport(type: string) {
  return apiFetch(
    `${API_ENDPOINTS.reports.export}?type=${encodeURIComponent(type)}`
  );
}

