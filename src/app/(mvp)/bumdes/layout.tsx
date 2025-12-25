/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { BarChart3, Package, FileText, ShoppingBag } from "lucide-react";
import { IconUsersGroup } from "@tabler/icons-react";

// Sidebar navigation for BUMDes MVP section
const navigation = [
  {
    name: "Dashboard",
    href: "/bumdes/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Manajemen Aset",
    href: "/bumdes/asset/manajemen",
    icon: <Package className="h-4 w-4" />,
  },
  {
    name: "Marketplace",
    href: "/bumdes/marketplace",
    icon: <ShoppingBag className="h-4 w-4" />,
    items: [
      { name: "Inventaris", href: "/bumdes/marketplace/inventory" },
      { name: "Pesanan", href: "/bumdes/marketplace/order" },
    ],
  },
  // {
  //   name: "POS",
  //   href: "/bumdes/pos",
  //   icon: <CreditCard className="h-4 w-4" />,
  // },
  // {
  //   name: "Rent",
  //   href: "/bumdes/rent",
  //   icon: <Key className="h-4 w-4" />,
  // },
  {
    name: "Team",
    href: "/bumdes/team",
    icon: <IconUsersGroup className="h-4 w-4" />,
  },
  {
    name: "Laporan Keuangan",
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
  "/bumdes/marketplace": "Marketplace",
  "/bumdes/marketplace/inventory": "Marketplace - Inventaris",
  "/bumdes/marketplace/order": "Marketplace - Pesanan",
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
  const isMarketplaceOrder = pathname.startsWith("/bumdes/marketplace/order");

  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout
        title={title}
        navigation={navigation}
        showHeader={!isMarketplaceOrder}
        contentClassName={isMarketplaceOrder ? "flex-1 overflow-hidden" : undefined}
      >
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
