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
        className="space-y-0"
        columns={columns}
        data={items}
        getRowId={(row) => String(row.id)}
        loading={loading}
        loadingState="Memuat daftar tenant..."
        emptyState="Tidak ada tenant yang cocok dengan filter saat ini."
        surface="bare"
        pagination={{
          mode: "cursor",
          hasPrev: canGoBack,
          hasNext: canGoNext,
          itemCount: items.length,
        }}
        onPrevPage={canGoBack ? onPrevious : undefined}
        onNextPage={canGoNext ? onNext : undefined}
        paginationInfo="Pagination berbasis cursor admin tenant management."
        paginationClassName="rounded-none border-x-0 border-b-0 bg-transparent px-4 py-3"
        paginationInfoClassName="text-xs"
        previousPageLabel={
          <>
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </>
        }
        nextPageLabel={
          <>
            Berikutnya
            <ChevronRight className="h-4 w-4" />
          </>
        }
      />
    </div>
  );
}
