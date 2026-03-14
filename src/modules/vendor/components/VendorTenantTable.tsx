/** @format */

"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminTenantListItem } from "@/types/api";
import {
  formatVendorDate,
  normalizeTenantStatus,
  tenantStatusBadgeClass,
} from "../utils/format";
import { VENDOR_ROUTES } from "../constants/routes";

type VendorTenantTableProps = {
  items: AdminTenantListItem[];
  canGoBack: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  loading?: boolean;
};

const columns: ColumnDef<AdminTenantListItem, unknown>[] = [
  {
    id: "tenant",
    header: "Tenant",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-foreground">
          {row.original.display_name || row.original.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.tenant_code} · {row.original.contact_email || "-"}
        </div>
      </div>
    ),
  },
  {
    id: "type",
    header: "Tipe",
    cell: ({ row }) => (
      <span className="uppercase">{row.original.business_type}</span>
    ),
  },
  {
    id: "domain",
    header: "Domain",
    cell: ({ row }) => row.original.domain || "-",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={tenantStatusBadgeClass(
          row.original.status,
          row.original.is_active,
        )}
      >
        {normalizeTenantStatus(row.original.status, row.original.is_active)}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "Dibuat",
    cell: ({ row }) => formatVendorDate(row.original.created_at),
  },
  {
    id: "actions",
    header: "Aksi",
    meta: {
      align: "right",
    },
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild size="sm" variant="outline">
          <Link href={VENDOR_ROUTES.clientOverview(row.original.id)}>
            Detail
          </Link>
        </Button>
      </div>
    ),
  },
];

export function VendorTenantTable({
  items,
  canGoBack,
  canGoNext,
  onPrevious,
  onNext,
  loading = false,
}: VendorTenantTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <TableShell
        columns={columns}
        data={items}
        getRowId={(row) => String(row.id)}
        loading={loading}
        loadingState="Memuat daftar tenant..."
        emptyState="Tidak ada tenant yang cocok dengan filter saat ini."
        surface="bare"
        footer={
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Pagination berbasis cursor admin tenant management.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!canGoBack}
                onClick={onPrevious}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Sebelumnya
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!canGoNext}
                onClick={onNext}
              >
                Berikutnya
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}
