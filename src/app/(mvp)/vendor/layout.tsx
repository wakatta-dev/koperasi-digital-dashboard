/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { getVendorNavigation } from "@/modules/vendor";

const navigation = getVendorNavigation();

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = pathname.startsWith("/vendor") ? "Vendor Console" : "Vendor";

  return (
    <ProtectedRoute requiredRole="vendor">
      <DashboardLayout title={title} navigation={navigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
