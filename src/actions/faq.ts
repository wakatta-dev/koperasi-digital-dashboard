'use server';

import { apiFetch } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export async function getFaq(search?: string) {
  const endpoint = search
    ? `${API_ENDPOINTS.faq.list}?search=${encodeURIComponent(search)}`
    : API_ENDPOINTS.faq.list;
  return apiFetch(endpoint);
}

export async function getFaqCategories() {
  return apiFetch(API_ENDPOINTS.faq.categories);
}

export async function submitFaqFeedback(
  id: string | number,
  payload: { helpful: boolean }
) {
  return apiFetch(API_ENDPOINTS.faq.feedback(id), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createFaq(payload: {
  question: string;
  answer: string;
  category_id: string;
}) {
  return apiFetch(API_ENDPOINTS.faq.create, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateFaq(
  id: string | number,
  payload: { question: string; answer: string; category_id: string }
) {
  return apiFetch(API_ENDPOINTS.faq.update(id), {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteFaq(id: string | number) {
  return apiFetch(API_ENDPOINTS.faq.delete(id), {
    method: 'DELETE',
  });
}

export async function createFaqCategory(payload: { name: string }) {
  return apiFetch(API_ENDPOINTS.faq.categoryCreate, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateFaqCategory(
  id: string | number,
  payload: { name: string }
) {
  return apiFetch(API_ENDPOINTS.faq.categoryUpdate(id), {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteFaqCategory(id: string | number) {
  return apiFetch(API_ENDPOINTS.faq.categoryDelete(id), {
    method: 'DELETE',
  });
}
