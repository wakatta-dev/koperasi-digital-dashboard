/** @format */

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminTenantDetail } from "@/hooks/queries";
import { VENDOR_ROUTES } from "../constants/routes";
import { formatVendorDateTime, normalizeTenantStatus, tenantStatusBadgeClass } from "../utils/format";

const tabs = [
  { label: "Overview", getHref: VENDOR_ROUTES.clientOverview },
  { label: "Accounts", getHref: VENDOR_ROUTES.clientAccounts },
  { label: "Activity", getHref: VENDOR_ROUTES.clientActivity },
  { label: "Subscription", getHref: VENDOR_ROUTES.clientSubscription },
];

type VendorClientDetailShellProps = {
  tenantId: string;
  children: ReactNode;
};

export function VendorClientDetailShell({
  tenantId,
  children,
}: VendorClientDetailShellProps) {
  const pathname = usePathname();
  const detailQuery = useAdminTenantDetail(tenantId);
  const tenant = detailQuery.data?.data?.tenant;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {tenant?.display_name || tenant?.name || `Tenant #${tenantId}`}
              </h1>
              <Badge className={tenantStatusBadgeClass(tenant?.status, tenant?.is_active)}>
                {normalizeTenantStatus(tenant?.status, tenant?.is_active)}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{tenant?.tenant_code || "-"}</span>
              <span>{tenant?.contact_email || "-"}</span>
              <span>{tenant?.domain || "-"}</span>
              <span>Diperbarui {formatVendorDateTime(tenant?.updated_at)}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const href = tab.getHref(tenantId);
              const active = pathname === href;
              return (
                <Link
                  key={tab.label}
                  href={href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {children}
    </div>
  );
}
