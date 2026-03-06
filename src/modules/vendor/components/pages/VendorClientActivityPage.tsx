/** @format */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminTenantDetail } from "@/hooks/queries";
import { formatVendorDateTime } from "../../utils/format";

type VendorClientActivityPageProps = {
  tenantId: string;
};

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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatVendorDateTime(log.timestamp)}</TableCell>
                <TableCell>{log.actor || `User #${log.changed_by}`}</TableCell>
                <TableCell>{log.action || "-"}</TableCell>
                <TableCell>
                  {[log.old_status, log.new_status].filter(Boolean).join(" → ") || "-"}
                </TableCell>
                <TableCell>{log.reason || "-"}</TableCell>
              </TableRow>
            ))}
            {!logs.length ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  Belum ada audit trail tenant.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
