/** @format */

import Link from "next/link";
import { Archive, ArchiveRestore, MoreVertical } from "lucide-react";
import type { ReactNode } from "react";
import { TableCell } from "@/components/shared/data-display/TableCell";
import { TableHeader } from "@/components/shared/data-display/TableHeader";
import { TableRow } from "@/components/shared/data-display/TableRow";
import { TableShell } from "@/components/shared/data-display/TableShell";
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

type TableColumn<Row> = {
  id: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  width?: string | number;
};

const columns: TableColumn<InventoryItem>[] = [
  { id: "product", header: "Produk" },
  { id: "status", header: "Status" },
  { id: "stock", header: "Stok" },
  { id: "price", header: "Harga Jual" },
  { id: "marketplace", header: "Marketplace" },
  { id: "actions", header: "", align: "right", width: 80 },
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
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <TableShell className="min-w-full divide-y divide-border" containerClassName="overflow-x-auto">
        <TableHeader className="bg-muted/40">
          <TableRow className="border-0">
            {columns.map((col) => (
              <TableCell
                key={col.id}
                as="th"
                scope="col"
                align={col.align ?? "left"}
                width={col.width}
                className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <tbody className="divide-y divide-border">
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-6 py-6 text-sm text-muted-foreground text-center"
              >
                Memuat data inventaris...
              </TableCell>
            </TableRow>
          ) : null}
          {!loading && items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-6 py-6 text-sm text-muted-foreground text-center"
              >
                Belum ada produk.
              </TableCell>
            </TableRow>
          ) : null}
          {items.map((row) => (
            <TableRow
              key={`${row.id}-${row.sku}`}
              hoverable
              className="hover:bg-muted/40"
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              <TableCell className="px-6 py-4">
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
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <Badge variant={row.status === "ACTIVE" ? "default" : "outline"}>
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {row.trackStock ? row.stock : "Tidak dilacak"}
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {formatCurrency(row.price)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
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
              </TableCell>
              <TableCell align="right" width={120}>
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
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </TableShell>
      {footer ? (
        <div className="border-t border-border px-6 py-4">{footer}</div>
      ) : null}
    </div>
  );
}
