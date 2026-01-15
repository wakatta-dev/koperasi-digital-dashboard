/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { bumdesNavigation, bumdesTitleMap } from "./navigation";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = bumdesTitleMap[pathname] ?? "BUMDes";

  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout title={title} navigation={bumdesNavigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
