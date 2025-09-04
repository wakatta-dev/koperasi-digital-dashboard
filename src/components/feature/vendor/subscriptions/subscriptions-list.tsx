/** @format */

"use client";

import { useMemo, useState } from "react";
import { useVendorSubscriptions } from "@/hooks/queries/billing";
import { listVendorSubscriptions } from "@/services/api";
import type { Subscription } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBillingActions } from "@/hooks/queries/billing";
import { useConfirm } from "@/hooks/use-confirm";

type Props = { initialData?: Subscription[]; limit?: number };

export function VendorSubscriptionsList({ initialData, limit = 20 }: Props) {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const params = useMemo(() => ({ limit, ...(status ? { status } : {}) }), [limit, status]);
  const { data: base = [] } = useVendorSubscriptions(params, initialData);
  const [extra, setExtra] = useState<Subscription[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const subs = useMemo(() => [...base, ...extra], [base, extra]);
  const { updateSubscriptionStatus } = useBillingActions();
  const confirm = useConfirm();

  async function loadMore() {
    const res = await listVendorSubscriptions({ ...params, cursor: nextCursor } as any).catch(() => null);
    if (res?.success) {
      const page = res.data || [];
      const next = (res.meta?.pagination as any)?.next_cursor as string | undefined;
      setNextCursor(next);
      setExtra((prev) => prev.concat(page));
    }
  }

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
            <select
              className="border rounded px-2 py-1 text-sm"
              value={status ?? ""}
              onChange={(e) => setStatus(e.target.value || undefined)}
            >
              <option value="">Status (All)</option>
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="terminated">terminated</option>
              <option value="overdue">overdue</option>
            </select>
            <Button type="button" variant="outline" size="sm" onClick={() => { setStatus(undefined); setNextCursor(undefined); setExtra([]); }}>
              Reset
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={exportCsv}>Export CSV</Button>
            <Button type="button" variant="outline" size="sm" onClick={loadMore}>Muat lagi</Button>
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
                <select
                  defaultValue={s.status}
                  className="border rounded px-2 py-1 text-sm"
                  onChange={async (e) => {
                    const next = e.target.value;
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
                  <option value="active">active</option>
                  <option value="paused">paused</option>
                  <option value="terminated">terminated</option>
                  <option value="overdue">overdue</option>
                </select>
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
