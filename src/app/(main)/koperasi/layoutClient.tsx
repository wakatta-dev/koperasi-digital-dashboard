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
  LifeBuoy,
  Bell,
  Palette,
  LayoutTemplate,
  IdCard,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/koperasi/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { name: 'Keanggotaan', href: '/koperasi/keanggotaan', icon: <Users className="h-4 w-4" /> },
  { name: 'Simpanan', href: '/koperasi/simpanan', icon: <PiggyBank className="h-4 w-4" /> },
  { name: 'Pinjaman & Pembiayaan', href: '/koperasi/pinjaman', icon: <CreditCard className="h-4 w-4" /> },
  { name: 'SHU', href: '/koperasi/shu', icon: <TrendingUp className="h-4 w-4" /> },
  { name: 'RAT', href: '/koperasi/rat', icon: <Calendar className="h-4 w-4" /> },
  { name: 'Aset & Penyusutan', href: '/koperasi/aset', icon: <Building className="h-4 w-4" /> },
  { name: 'Transaksi', href: '/koperasi/transaksi', icon: <Receipt className="h-4 w-4" /> },
  {
    name: 'Laporan',
    href: '/koperasi/laporan',
    icon: <FileText className="h-4 w-4" />,
    items: [
      { name: 'Neraca', href: '/koperasi/laporan/neraca' },
      { name: 'Laba Rugi', href: '/koperasi/laporan/laba-rugi' },
      { name: 'Arus Kas', href: '/koperasi/laporan/arus-kas' },
    ],
  },
  { name: 'Kartu Anggota', href: '/koperasi/kartu-anggota', icon: <IdCard className="h-4 w-4" /> },
  { name: 'Tagihan & Add-Ons', href: '/koperasi/billing', icon: <Receipt className="h-4 w-4" /> },
  { name: 'Dukungan', href: '/koperasi/dukungan', icon: <LifeBuoy className="h-4 w-4" /> },
  { name: 'Notifikasi', href: '/koperasi/notifikasi', icon: <Bell className="h-4 w-4" /> },
  { name: 'Pengaturan', href: '/koperasi/pengaturan', icon: <Settings className="h-4 w-4" /> },
  { name: 'Kustomisasi', href: '/koperasi/kustomisasi', icon: <Palette className="h-4 w-4" /> },
  { name: 'Landing Page', href: '/koperasi/landing', icon: <LayoutTemplate className="h-4 w-4" /> },
];

const titleMap: Record<string, string> = {
  '/koperasi/dashboard': 'Dashboard Koperasi',
  '/koperasi/keanggotaan': 'Manajemen Keanggotaan',
  '/koperasi/simpanan': 'Manajemen Simpanan',
  '/koperasi/pinjaman': 'Pinjaman & Pembiayaan',
  '/koperasi/shu': 'Sisa Hasil Usaha (SHU)',
  '/koperasi/rat': 'Rapat Anggota Tahunan (RAT)',
  '/koperasi/aset': 'Aset & Penyusutan',
  '/koperasi/transaksi': 'Transaksi',
  '/koperasi/laporan': 'Laporan',
  '/koperasi/kartu-anggota': 'Kartu Anggota',
  '/koperasi/billing': 'Tagihan & Add-Ons',
  '/koperasi/dukungan': 'Dukungan',
  '/koperasi/notifikasi': 'Notifikasi',
  '/koperasi/pengaturan': 'Pengaturan',
  '/koperasi/kustomisasi': 'Kustomisasi',
  '/koperasi/landing': 'Landing Page',
};

export default function KoperasiLayoutClient({ children }: { children: ReactNode }) {
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
