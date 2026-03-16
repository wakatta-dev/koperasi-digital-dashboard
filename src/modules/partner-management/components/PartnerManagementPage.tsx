/** @format */

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { usePartnerManagementSellers } from "@/hooks/queries/partner-management";
import type { PartnerManagementSellerItem } from "@/types/api/partner-management";

const columns: ColumnDef<PartnerManagementSellerItem, unknown>[] = [
  {
    id: "seller",
    header: "Seller",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-foreground">{row.original.seller_name}</div>
        <div className="text-xs text-muted-foreground">{row.original.owner_name || "-"}</div>
      </div>
    ),
  },
  {
    id: "business",
    header: "Business",
    cell: ({ row }) => row.original.business_name || "-",
  },
  {
    accessorKey: "lifecycle_state",
    header: "Lifecycle",
  },
  {
    id: "ownershipRef",
    header: "Ownership Ref",
    cell: ({ row }) => (
      <span className="text-muted-foreground">Seller #{row.original.seller_id}</span>
    ),
  },
];

export function PartnerManagementPage() {
  const sellersQuery = usePartnerManagementSellers();

  if (sellersQuery.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Memuat seller...</div>;
  }

  if (sellersQuery.isError) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Gagal memuat data seller partner management.
      </div>
    );
  }

  const items = sellersQuery.data?.items ?? [];

  return (
    <div className="space-y-6" data-testid="bumdes-partner-management-page-root">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Partner Management</h1>
        <p className="text-sm text-muted-foreground">
          Seller kanonik dengan lifecycle yang sama seperti ownership yang digunakan di surface marketplace.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <TableShell
          columns={columns}
          data={items}
          getRowId={(row) => String(row.seller_id)}
          emptyState="Belum ada seller terdaftar."
          surface="bare"
          tableClassName="w-full text-sm"
          headerClassName="bg-muted/40"
          bodyClassName="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3"
        />
      </div>
    </div>
  );
}
