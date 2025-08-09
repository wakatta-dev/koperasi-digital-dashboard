'use server';

import { headers } from 'next/headers';

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const res = await fetch(`${protocol}://${host}/api${endpoint}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const json = await res.json().catch(() => null);
  return json?.data;
}
