/** @format */

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import {
  BarChart3,
  Users,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Calendar,
  Building,
  Receipt,
  FileText,
  Settings,
  MessageCircle,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/koperasi/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { name: 'Keanggotaan', href: '/koperasi/keanggotaan', icon: <Users className="h-4 w-4" /> },
  { name: 'Simpanan', href: '/koperasi/simpanan', icon: <PiggyBank className="h-4 w-4" /> },
  { name: 'Pinjaman', href: '/koperasi/pinjaman', icon: <CreditCard className="h-4 w-4" /> },
  { name: 'SHU', href: '/koperasi/shu', icon: <TrendingUp className="h-4 w-4" /> },
  { name: 'RAT', href: '/koperasi/rat', icon: <Calendar className="h-4 w-4" /> },
  { name: 'Aset', href: '/koperasi/aset', icon: <Building className="h-4 w-4" /> },
  { name: 'Transaksi', href: '/koperasi/transaksi', icon: <Receipt className="h-4 w-4" /> },
  { name: 'Laporan', href: '/koperasi/laporan', icon: <FileText className="h-4 w-4" /> },
  { name: 'Pengaturan', href: '/koperasi/pengaturan', icon: <Settings className="h-4 w-4" /> },
  { name: 'Tagihan', href: '/koperasi/tagihan', icon: <Receipt className="h-4 w-4" /> },
  { name: 'Chat Support', href: '/koperasi/chat-support', icon: <MessageCircle className="h-4 w-4" /> },
];

const titleMap: Record<string, string> = {
  '/koperasi/dashboard': 'Dashboard Koperasi',
  '/koperasi/keanggotaan': 'Manajemen Keanggotaan',
  '/koperasi/simpanan': 'Manajemen Simpanan',
  '/koperasi/pinjaman': 'Manajemen Pinjaman',
  '/koperasi/shu': 'Sisa Hasil Usaha (SHU)',
  '/koperasi/rat': 'Rapat Anggota Tahunan (RAT)',
};

export default function KoperasiLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? 'Koperasi';

  return (
    <ProtectedRoute requiredRole="koperasi">
      <DashboardLayout title={title} navigation={navigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
