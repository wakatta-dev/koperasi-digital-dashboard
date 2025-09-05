/** @format */

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import {
  BarChart3,
  Package,
  Calculator,
  ShoppingCart,
  FileText,
  Store,
  Users,
  CreditCard,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/umkm/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { name: 'Inventaris', href: '/umkm/inventaris', icon: <Package className="h-4 w-4" /> },
  { name: 'POS', href: '/umkm/pos', icon: <ShoppingCart className="h-4 w-4" /> },
  { name: 'Marketplace', href: '/umkm/marketplace', icon: <Store className="h-4 w-4" /> },
  { name: 'Kontak', href: '/umkm/kontak', icon: <Users className="h-4 w-4" /> },
  { name: 'Harga Bertingkat', href: '/umkm/harga-bertingkat', icon: <Calculator className="h-4 w-4" /> },
  { name: 'Laporan', href: '/umkm/laporan', icon: <FileText className="h-4 w-4" /> },
  { name: 'Billing & Langganan', href: '/umkm/billing', icon: <CreditCard className="h-4 w-4" /> },
];

const titleMap: Record<string, string> = {
  '/umkm/dashboard': 'Dashboard UMKM',
  '/umkm/inventaris': 'Manajemen Inventaris',
  '/umkm/pos': 'Point of Sale (POS)',
  '/umkm/marketplace': 'Marketplace',
  '/umkm/kontak': 'Kontak',
  '/umkm/harga-bertingkat': 'Harga Bertingkat',
  '/umkm/laporan': 'Laporan Penjualan',
  '/umkm/billing': 'Billing & Langganan',
};

export default function UmkmLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? 'UMKM';

  return (
    <ProtectedRoute requiredRole="umkm">
      <DashboardLayout title={title} navigation={navigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
