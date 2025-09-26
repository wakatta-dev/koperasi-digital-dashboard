/** @format */

"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getClientInvoice, listClientInvoiceAudits } from "@/services/api";
import type { Invoice, StatusAudit } from "@/types/api";

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function InvoiceDetailDialog({ id }: { id: string | number }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Invoice | null>(null);
  const [audits, setAudits] = useState<StatusAudit[]>([]);

  useEffect(() => {
    (async () => {
      if (!open) return;
      const [detail, logs] = await Promise.all([
        getClientInvoice(id).catch(() => null),
        listClientInvoiceAudits(id, { limit: 50 }).catch(() => null),
      ]);
      if (detail && detail.success) setData(detail.data as Invoice);
      if (logs && logs.success) setAudits((logs.data as StatusAudit[]) || []);
    })();
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Lihat</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detail Invoice #{String(id)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">Nomor</div>
            <div>{data?.number ?? '-'}</div>
            <div className="text-muted-foreground">Status</div>
            <div className="capitalize">{data?.status ?? '-'}</div>
            <div className="text-muted-foreground">Jumlah</div>
            <div>{data ? idr.format(data.total) : '-'}</div>
            <div className="text-muted-foreground">Jatuh Tempo</div>
            <div>{data?.due_date ?? '-'}</div>
          </div>
          <div>
            <div className="font-medium mb-1">Audit Status</div>
            <div className="space-y-1 max-h-40 overflow-auto">
              {audits.map((a, i) => {
                const fromStatus = a.from_status ?? (a as any)?.old_status ?? null;
                const toStatus = a.to_status ?? (a as any)?.new_status ?? null;
                const statusText = fromStatus && toStatus
                  ? `${fromStatus} → ${toStatus}`
                  : toStatus ?? fromStatus ?? '-';
                return (
                  <div key={i} className="p-2 border rounded">
                    <div className="flex items-center justify-between">
                      <div>{statusText}</div>
                      <div className="text-xs text-muted-foreground">{a.created_at ?? '-'}</div>
                    </div>
                    {a.note && <div className="text-xs text-muted-foreground">{a.note}</div>}
                  </div>
                );
              })}
              {!audits.length && (
                <div className="text-xs text-muted-foreground italic">Belum ada audit</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
