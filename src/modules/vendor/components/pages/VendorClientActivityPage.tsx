/** @format */

"use client";

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
    cell: ({ row }) => formatVendorDateTime(row.original.timestamp),
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

export function VendorClientActivityPage({
  tenantId,
}: VendorClientActivityPageProps) {
  const detailQuery = useAdminTenantDetail(tenantId);
  const logs = detailQuery.data?.data?.audit_logs ?? [];
  const errorText = detailQuery.data?.data?.audit_logs_error;

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
          data={logs}
          getRowId={(row) => String(row.id)}
          emptyState="Belum ada audit trail tenant."
          surface="bare"
        />
      </CardContent>
    </Card>
  );
}
