/** @format */

"use client";

import { useMemo, useState } from "react";
import { useVendorSubscriptions } from "@/hooks/queries/billing";
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
  const { data: subs = [] } = useVendorSubscriptions(params, initialData);
  const { updateSubscriptionStatus } = useBillingActions();
  const confirm = useConfirm();

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
            <Button type="button" variant="outline" size="sm" onClick={() => setStatus(undefined)}>
              Reset
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

