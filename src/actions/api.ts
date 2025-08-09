'use server';

import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const session = await getServerSession(authOptions);

  const res = await fetch(`${protocol}://${host}/api${endpoint}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {}),
      ...(options?.headers || {}),
    },
  });

  const json = await res.json().catch(() => null);
  return json?.data;
}
