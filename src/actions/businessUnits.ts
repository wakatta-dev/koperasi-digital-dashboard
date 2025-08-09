'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function getBusinessUnits() {
  return apiFetch(API_ENDPOINTS.businessUnits.list);
}

export async function createBusinessUnit(payload: { name: string }) {
  return apiFetch(API_ENDPOINTS.businessUnits.create, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateBusinessUnit(
  id: string | number,
  payload: { name: string }
) {
  return apiFetch(API_ENDPOINTS.businessUnits.update(id), {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteBusinessUnit(id: string | number) {
  return apiFetch(API_ENDPOINTS.businessUnits.delete(id), {
    method: 'DELETE',
  });
}

export async function assignUserToUnit(
  id: string | number,
  payload: { unit_id: string }
) {
  return apiFetch(API_ENDPOINTS.businessUnits.assignUser(id), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function getReportsByUnit(unit_id: string) {
  return apiFetch(
    `${API_ENDPOINTS.businessUnits.reports}?unit_id=${encodeURIComponent(unit_id)}`
  );
}
