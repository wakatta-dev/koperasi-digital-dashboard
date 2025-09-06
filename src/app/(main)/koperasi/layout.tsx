/** @format */

import type { ReactNode } from 'react';

// Force all routes under this segment to be server-side rendered
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import KoperasiLayoutClient from './layoutClient';

export default function KoperasiLayout({ children }: { children: ReactNode }) {
  return <KoperasiLayoutClient>{children}</KoperasiLayoutClient>;
}
