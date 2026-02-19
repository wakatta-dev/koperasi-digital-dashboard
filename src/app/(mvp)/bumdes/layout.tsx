/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { bumdesNavigation } from "./navigation";
import { resolveBumdesTitle } from "./title-resolver";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = resolveBumdesTitle(pathname);

  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout title={title} navigation={bumdesNavigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
