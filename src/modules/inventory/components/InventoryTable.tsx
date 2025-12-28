/** @format */

import Link from "next/link";
import { Archive, ArchiveRestore, MoreVertical } from "lucide-react";
import type { ReactNode } from "react";
import {
  GenericTable,
  type GenericTableColumn,
} from "@/components/shared/data-display/GenericTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { InventoryItem } from "../types";

type InventoryTableProps = {
  items: InventoryItem[];
  loading?: boolean;
  onEdit: (item: InventoryItem) => void;
  onToggleMarketplace: (item: InventoryItem, nextValue: boolean) => void;
  onArchive: (item: InventoryItem) => void;
  onUnarchive: (item: InventoryItem) => void;
  onRowClick?: (item: InventoryItem) => void;
  footer?: ReactNode;
};

const buildColumns = ({
  onEdit,
  onToggleMarketplace,
  onArchive,
  onUnarchive,
}: Pick<
  InventoryTableProps,
  "onEdit" | "onToggleMarketplace" | "onArchive" | "onUnarchive"
>): GenericTableColumn<InventoryItem>[] => [
  {
    id: "product",
    header: "Produk",
    render: (row) => (
      <div className="flex items-center">
        <div className="h-10 w-10 flex-shrink-0">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="h-10 w-10 rounded object-cover bg-muted"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <div className="ml-4">
          <Link
            href={`/bumdes/marketplace/inventory/${row.id}`}
            className="text-sm font-medium text-foreground transition-colors hover:underline"
          >
            {row.name}
          </Link>
          <p className="text-xs text-muted-foreground">SKU: {row.sku}</p>
        </div>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    cellClassName: "text-sm text-muted-foreground",
    render: (row) => (
      <Badge variant={row.status === "ACTIVE" ? "default" : "outline"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "stock",
    header: "Stok",
    cellClassName: "text-sm text-muted-foreground",
    render: (row) => (row.trackStock ? row.stock : "Tidak dilacak"),
  },
  {
    id: "price",
    header: "Harga Jual",
    cellClassName: "text-sm text-foreground",
    render: (row) =>
      row.product?.has_variants ? "Harga berbasis varian" : formatCurrency(row.price),
  },
  {
    id: "marketplace",
    header: "Marketplace",
    cellClassName: "text-sm text-muted-foreground",
    render: (row) => (
      <div className="flex items-start gap-3">
        <Switch
          checked={row.showInMarketplace}
          onCheckedChange={(val) => onToggleMarketplace(row, val)}
          disabled={row.status !== "ACTIVE"}
          aria-label="Toggle marketplace visibility"
        />
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground">
            {row.showInMarketplace ? "Tampil di marketplace" : "Disembunyikan"}
          </p>
          {row.marketplaceEligible ? (
            <p className="text-xs text-emerald-600">Eligible</p>
          ) : (
            <p className="text-xs text-amber-600">
              Tidak memenuhi: {row.ineligibleReasons.join(", ")}
            </p>
          )}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    align: "right",
    width: 120,
    render: (row) => (
      <>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit produk"
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
        {row.status !== "ARCHIVED" ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Arsipkan produk"
            className="text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(row);
            }}
          >
            <Archive className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Aktifkan kembali produk"
            className="text-emerald-600 hover:text-emerald-600"
            onClick={(e) => {
              e.stopPropagation();
              onUnarchive(row);
            }}
          >
            <ArchiveRestore className="h-5 w-5" />
          </Button>
        )}
      </>
    ),
  },
];

export function InventoryTable({
  items,
  loading = false,
  onEdit,
  onRowClick,
  onToggleMarketplace,
  onArchive,
  onUnarchive,
  footer,
}: InventoryTableProps) {
  const columns = buildColumns({
    onEdit,
    onToggleMarketplace,
    onArchive,
    onUnarchive,
  });

  return (
    <GenericTable
      columns={columns}
      rows={items}
      loading={loading}
      loadingState="Memuat data inventaris..."
      emptyState="Belum ada produk."
      getRowKey={(row) => `${row.id}-${row.sku}`}
      onRowClick={onRowClick}
      footer={footer}
    />
  );
}
