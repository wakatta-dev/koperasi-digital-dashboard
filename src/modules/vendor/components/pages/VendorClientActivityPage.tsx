/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTenantDetail } from "@/hooks/queries";
import { formatVendorDateTime } from "../../utils/format";

type VendorClientActivityPageProps = {
  tenantId: string;
};

type TenantAuditLogRow = {
  id: string | number;
  timestamp: string | number;
  actor?: string | null;
  changed_by?: string | number | null;
  action?: string | null;
  old_status?: string | null;
  new_status?: string | null;
  reason?: string | null;
};

const columns: ColumnDef<TenantAuditLogRow, unknown>[] = [
  {
    id: "time",
    header: "Waktu",
    cell: ({ row }) => formatVendorDateTime(String(row.original.timestamp)),
  },
  {
    id: "actor",
    header: "Actor",
    cell: ({ row }) => row.original.actor || `User #${row.original.changed_by}`,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => row.original.action || "-",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) =>
      [row.original.old_status, row.original.new_status]
        .filter(Boolean)
        .join(" → ") || "-",
  },
  {
    id: "reason",
    header: "Reason",
    cell: ({ row }) => row.original.reason || "-",
  },
];

const PAGE_SIZE = 10;

export function VendorClientActivityPage({
  tenantId,
}: VendorClientActivityPageProps) {
  const detailQuery = useAdminTenantDetail(tenantId);
  const logs = detailQuery.data?.data?.audit_logs ?? [];
  const errorText = detailQuery.data?.data?.audit_logs_error;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const visibleLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, page]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorText ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Audit log parsial: {errorText}
          </div>
        ) : null}

        <TableShell
          columns={columns}
          data={visibleLogs}
          getRowId={(row) => String(row.id)}
          loading={detailQuery.isPending}
          loadingState="Memuat audit trail..."
          emptyState="Belum ada audit trail tenant."
          surface="bare"
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            totalItems: logs.length,
            totalPages,
          }}
          onPrevPage={() => setPage((current) => Math.max(1, current - 1))}
          onNextPage={() =>
            setPage((current) => Math.min(totalPages, current + 1))
          }
          paginationInfo={`Menampilkan ${visibleLogs.length} dari ${logs.length} aktivitas`}
        />
      </CardContent>
    </Card>
  );
}
