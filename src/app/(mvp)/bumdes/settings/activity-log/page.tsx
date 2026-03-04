/** @format */

"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupportActivityLogs } from "@/hooks/queries";

export default function SettingsActivityLogPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [module, setModule] = useState<string>("all");
  const [action, setAction] = useState("");
  const [actorId, setActorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const params = useMemo(
    () => ({
      cursor,
      limit: 25,
      module: module === "all" ? undefined : module,
      action: action || undefined,
      actor_id: actorId || undefined,
      from: from || undefined,
      to: to || undefined,
    }),
    [action, actorId, cursor, from, module, to]
  );

  const logsQuery = useSupportActivityLogs(params);
  const rows = logsQuery.data?.data?.items ?? [];
  const nextCursor = logsQuery.data?.meta?.pagination?.next_cursor;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Log</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Jejak aktivitas perubahan pengaturan, akses, dan komunikasi tenant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Module</Label>
            <Select value={module} onValueChange={setModule}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Module</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="operasional">Operasional</SelectItem>
                <SelectItem value="access">Akses</SelectItem>
                <SelectItem value="komunikasi">Komunikasi</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Action</Label>
            <Input
              value={action}
              onChange={(event) => setAction(event.target.value)}
              placeholder="contoh: update_tenant_config"
            />
          </div>
          <div className="space-y-2">
            <Label>Actor ID</Label>
            <Input
              value={actorId}
              onChange={(event) => setActorId(event.target.value)}
              placeholder="contoh: 12"
            />
          </div>
          <div className="space-y-2">
            <Label>Dari (RFC3339)</Label>
            <Input
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder="2026-03-03T00:00:00Z"
            />
          </div>
          <div className="space-y-2">
            <Label>Sampai (RFC3339)</Label>
            <Input
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="2026-03-03T23:59:59Z"
            />
          </div>
          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={() => setCursor(undefined)}>
              Reset Cursor
            </Button>
          </div>
        </CardContent>
      </Card>

      {logsQuery.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(logsQuery.error as Error).message}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Aktivitas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Request ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.timestamp).toLocaleString("id-ID")}</TableCell>
                    <TableCell>{log.actor_label || `user:${log.actor_id}`}</TableCell>
                    <TableCell>{log.module}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{log.action}</TableCell>
                    <TableCell>{`${log.entity_type}#${log.entity_id}`}</TableCell>
                    <TableCell className="max-w-[240px] truncate">{log.request_id || "-"}</TableCell>
                  </TableRow>
                ))}
                {!logsQuery.isLoading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      Tidak ada data activity log.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!nextCursor || logsQuery.isFetching}
              onClick={() => setCursor(nextCursor || undefined)}
            >
              {logsQuery.isFetching ? "Memuat..." : "Muat Berikutnya"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

