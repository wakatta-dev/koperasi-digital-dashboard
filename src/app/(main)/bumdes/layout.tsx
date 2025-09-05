/** @format */

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import {
  BarChart3,
  Building,
  Boxes,
  Receipt,
  FileText,
  CalendarDays,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/bumdes/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { name: 'Unit Usaha', href: '/bumdes/units', icon: <Building className="h-4 w-4" /> },
  { name: 'Inventaris', href: '/bumdes/inventaris', icon: <Boxes className="h-4 w-4" /> },
  { name: 'Transaksi', href: '/bumdes/transaksi', icon: <Receipt className="h-4 w-4" /> },
  { name: 'Laporan', href: '/bumdes/laporan', icon: <FileText className="h-4 w-4" /> },
  { name: 'Aset & Jadwal Sewa', href: '/bumdes/aset', icon: <CalendarDays className="h-4 w-4" /> },
];

const titleMap: Record<string, string> = {
  '/bumdes/dashboard': 'Dashboard BUMDes',
  '/bumdes/units': 'Manajemen Unit Usaha',
  '/bumdes/inventaris': 'Inventaris Unit Usaha',
  '/bumdes/transaksi': 'Transaksi BUMDes',
  '/bumdes/laporan': 'Laporan BUMDes',
  '/bumdes/aset': 'Aset & Jadwal Sewa',
};

export default function BumdesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? 'BUMDes';

  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout title={title} navigation={navigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
