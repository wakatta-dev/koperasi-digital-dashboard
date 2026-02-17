/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { bumdesNavigation, bumdesTitleMap } from "./navigation";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title =
    bumdesTitleMap[pathname] ??
    (pathname.startsWith("/bumdes/asset/manajemen/")
      ? "Asset & Rental - Detail Aset"
      : pathname.startsWith("/bumdes/asset/penyewaan/")
        ? "Asset & Rental - Detail Penyewaan"
      : pathname.startsWith("/bumdes/asset/pengajuan-sewa/")
        ? "Asset & Rental - Detail Pengajuan Sewa"
      : pathname.startsWith("/bumdes/asset/pengembalian/")
        ? "Asset & Rental - Detail Pengembalian"
      : pathname.startsWith("/bumdes/accounting/vendor-bills-ap/")
        ? "Accounting - Vendor Bills (AP) - Bill Detail"
      : "BUMDes");

  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout title={title} navigation={bumdesNavigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
