/** @format */

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import {
  BarChart3,
  Building,
  MapPin,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/bumdes/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { name: 'Unit Usaha', href: '/bumdes/unit-usaha', icon: <Building className="h-4 w-4" /> },
  { name: 'Aset Sewa', href: '/bumdes/aset-sewa', icon: <MapPin className="h-4 w-4" /> },
  { name: 'Jadwal Sewa', href: '/bumdes/jadwal-sewa', icon: <Calendar className="h-4 w-4" /> },
  { name: 'Laporan', href: '/bumdes/laporan', icon: <FileText className="h-4 w-4" /> },
  { name: 'Pengaturan', href: '/bumdes/pengaturan', icon: <Settings className="h-4 w-4" /> },
];

const titleMap: Record<string, string> = {
  '/bumdes/dashboard': 'Dashboard BUMDes',
  '/bumdes/unit-usaha': 'Manajemen Unit Usaha',
  '/bumdes/aset-sewa': 'Manajemen Aset Sewa',
  '/bumdes/jadwal-sewa': 'Jadwal Sewa Aset',
  '/bumdes/laporan': 'Laporan BUMDes',
  '/bumdes/pengaturan': 'Pengaturan BUMDes',
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
