/** @format */

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import {
  BarChart3,
  Package,
  Users,
  FileText,
  Bell,
  Ticket,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { name: 'Products', href: '/vendor/products', icon: <Package className="h-4 w-4" /> },
  { name: 'Clients', href: '/vendor/clients', icon: <Users className="h-4 w-4" /> },
  { name: 'Invoices', href: '/vendor/invoices', icon: <FileText className="h-4 w-4" /> },
  { name: 'Users', href: '/vendor/users', icon: <Users className="h-4 w-4" /> },
  { name: 'Notifications', href: '/vendor/notifications', icon: <Bell className="h-4 w-4" /> },
  { name: 'Tickets', href: '/vendor/tickets', icon: <Ticket className="h-4 w-4" /> },
];

const titleMap: Record<string, string> = {
  '/vendor/dashboard': 'Vendor Dashboard',
  '/vendor/products': 'Products Management',
  '/vendor/clients': 'Clients Management',
  '/vendor/invoices': 'Invoices Management',
  '/vendor/users': 'Users Management',
  '/vendor/notifications': 'Notifications',
  '/vendor/tickets': 'Support Tickets',
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? 'Vendor';

  return (
    <ProtectedRoute requiredRole="vendor">
      <DashboardLayout title={title} navigation={navigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
