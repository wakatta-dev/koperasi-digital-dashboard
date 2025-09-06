/** @format */

"use client";

import { useMemo, useState } from "react";
import { useInfiniteVendorSubscriptions } from "@/hooks/queries/billing";
import type { Subscription } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBillingActions } from "@/hooks/queries/billing";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { initialData?: Subscription[]; initialCursor?: string; limit?: number };

export function VendorSubscriptionsList({ initialData, initialCursor, limit = 20 }: Props) {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const params = useMemo(() => ({ limit, ...(status ? { status } : {}) }), [limit, status]);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteVendorSubscriptions(params, { initialData, initialCursor });
  const subs = useMemo(() => (data?.pages ?? []).flatMap((p) => p.items), [data]);
  const { updateSubscriptionStatus } = useBillingActions();
  const confirm = useConfirm();

  function exportCsv() {
    const rows = [["id","tenant_id","plan_id","status","start_date","end_date"], ...subs.map((s) => [s.id,s.tenant_id,s.plan_id,s.status,s.start_date,s.end_date ?? ""])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "subscriptions.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subscriptions</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={(v) => setStatus(v || undefined)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status (All)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="paused">paused</SelectItem>
                <SelectItem value="terminated">terminated</SelectItem>
                <SelectItem value="overdue">overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="sm" onClick={() => { setStatus(undefined); }}>
              Reset
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={exportCsv}>Export CSV</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
              {isFetchingNextPage ? "Memuat..." : hasNextPage ? "Muat lagi" : "Tidak ada data lagi"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {subs.map((s) => (
            <div key={s.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">Subscription #{s.id}</div>
                <div className="text-sm text-muted-foreground">Tenant #{s.tenant_id} • Plan #{s.plan_id}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={s.status === "active" ? "default" : s.status === "overdue" ? "destructive" : "secondary"}>{s.status}</Badge>
                <Select
                  defaultValue={s.status}
                  onValueChange={async (next) => {
                    const ok = await confirm({
                      variant: "edit",
                      title: "Ubah status subscription?",
                      description: `Status akan menjadi ${next}.`,
                      confirmText: "Simpan",
                    });
                    if (!ok) return;
                    await updateSubscriptionStatus.mutateAsync({ id: s.id, status: next });
                  }}
                >
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="paused">paused</SelectItem>
                    <SelectItem value="terminated">terminated</SelectItem>
                    <SelectItem value="overdue">overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          {!subs.length && (
            <div className="text-sm text-muted-foreground italic">No subscriptions found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
