/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import {
  BarChart3,
  Package,
  ClipboardList,
  ShoppingBag,
  CreditCard,
  Key,
  FileText,
} from "lucide-react";

// Sidebar navigation for BUMDes MVP section
const navigation = [
  {
    name: "Dashboard",
    href: "/bumdes/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Asset",
    href: "/bumdes/asset",
    icon: <Package className="h-4 w-4" />,
  },
  {
    name: "Inventaris",
    href: "/bumdes/inventaris",
    icon: <ClipboardList className="h-4 w-4" />,
  },
  {
    name: "Marketplace",
    href: "/bumdes/marketplace",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    name: "POS",
    href: "/bumdes/pos",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    name: "Rent",
    href: "/bumdes/rent",
    icon: <Key className="h-4 w-4" />,
  },
  {
    name: "Report",
    href: "/bumdes/report/ringkasan",
    icon: <FileText className="h-4 w-4" />,
    items: [
      { name: "Ringkasan", href: "/bumdes/report/ringkasan" },
      { name: "Laba/Rugi", href: "/bumdes/report/laba-rugi" },
      { name: "Arus Kas", href: "/bumdes/report/arus-kas" },
      { name: "Neraca", href: "/bumdes/report/neraca" },
      { name: "Penjualan Rinci", href: "/bumdes/report/penjualan-rinci" },
    ],
  },
];

const titleMap: Record<string, string> = {
  "/bumdes/dashboard": "Dashboard",
  "/bumdes/asset": "Asset",
  "/bumdes/inventaris": "Inventaris",
  "/bumdes/marketplace": "Marketplace",
  "/bumdes/pos": "Point of Sales",
  "/bumdes/rent": "Rent",
  "/bumdes/report": "Report",
  "/bumdes/report/ringkasan": "Report - Ringkasan",
  "/bumdes/report/laba-rugi": "Report - Laba/Rugi",
  "/bumdes/report/arus-kas": "Report - Arus Kas",
  "/bumdes/report/neraca": "Report - Neraca",
  "/bumdes/report/penjualan-rinci": "Report - Penjualan Rinci",
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "BUMDes";

  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout title={title} navigation={navigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
