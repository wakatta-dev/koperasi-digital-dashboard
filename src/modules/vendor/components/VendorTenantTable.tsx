/** @format */

"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminTenantListItem } from "@/types/api";
import { formatVendorDate, normalizeTenantStatus, tenantStatusBadgeClass } from "../utils/format";
import { VENDOR_ROUTES } from "../constants/routes";

type VendorTenantTableProps = {
  items: AdminTenantListItem[];
  canGoBack: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  loading?: boolean;
};

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-foreground">{item.display_name || item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.tenant_code} · {item.contact_email || "-"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="uppercase">{item.business_type}</TableCell>
              <TableCell>{item.domain || "-"}</TableCell>
              <TableCell>
                <Badge className={tenantStatusBadgeClass(item.status, item.is_active)}>
                  {normalizeTenantStatus(item.status, item.is_active)}
                </Badge>
              </TableCell>
              <TableCell>{formatVendorDate(item.created_at)}</TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                  <Link href={VENDOR_ROUTES.clientOverview(item.id)}>Detail</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {!loading && items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                Tidak ada tenant yang cocok dengan filter saat ini.
              </TableCell>
            </TableRow>
          ) : null}

          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                Memuat daftar tenant...
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Pagination berbasis cursor admin tenant management.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={!canGoBack} onClick={onPrevious}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Sebelumnya
          </Button>
          <Button size="sm" variant="outline" disabled={!canGoNext} onClick={onNext}>
            Berikutnya
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
