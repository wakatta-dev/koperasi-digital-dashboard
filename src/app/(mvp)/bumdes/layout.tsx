/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { getBumdesNavigation } from "./navigation";
import { resolveBumdesTitle } from "./title-resolver";
import { useSupportTenantConfig } from "@/hooks/queries/support-config";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = resolveBumdesTitle(pathname);
  const tenantConfigQuery = useSupportTenantConfig();
  const navigation = getBumdesNavigation(
    tenantConfigQuery.data?.feature_flags ?? undefined
  );

  return (
    <ProtectedRoute requiredRole="bumdes">
      <DashboardLayout title={title} navigation={navigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
