/** @format */

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { VendorDashboardFilterProvider } from "@/components/feature/vendor/dashboard/vendor-dashboard-filter-context";

const detailNavigation = [
  { href: "/vendor/dashboard/tenant-activity", label: "Aktivitas Tenant" },
  { href: "/vendor/dashboard/revenue-trend", label: "Tren Pendapatan" },
  { href: "/vendor/dashboard/support-health", label: "Kesehatan Dukungan" },
] as const;

export default function VendorDashboardSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isDetail = detailNavigation.some((item) =>
    pathname ? pathname.startsWith(item.href) : false,
  );

  return (
    <VendorDashboardFilterProvider>
      <div className="space-y-6">
        {isDetail ? (
          <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/vendor/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke dashboard utama
            </Link>
            <nav className="flex flex-wrap gap-2">
              {detailNavigation.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}

        {children}
      </div>
    </VendorDashboardFilterProvider>
  );
}
