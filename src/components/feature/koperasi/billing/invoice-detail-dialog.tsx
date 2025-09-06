/** @format */

"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { downloadVendorInvoicePdf, getClientInvoice, listClientInvoiceAudits } from "@/services/api";
import { toast } from "sonner";

export function InvoiceDetailDialog({ id }: { id: string | number }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [audits, setAudits] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (!open) return;
      const [detail, logs] = await Promise.all([
        getClientInvoice(id).catch(() => null),
        listClientInvoiceAudits(id, { limit: 50 }).catch(() => null),
      ]);
      if (detail && detail.success) setData(detail.data);
      if (logs && logs.success) setAudits(logs.data || []);
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
            <div>{data?.amount ?? data?.total ?? '-'}</div>
            <div className="text-muted-foreground">Jatuh Tempo</div>
            <div>{data?.due_date ?? '-'}</div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  const blob = await downloadVendorInvoicePdf(id);
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `invoice-${String(id)}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                } catch (e: any) {
                  toast.error(e?.message || 'Gagal unduh PDF (izin/vendor)');
                }
              }}
            >
              Unduh PDF
            </Button>
          </div>
          <div>
            <div className="font-medium mb-1">Audit Status</div>
            <div className="space-y-1 max-h-40 overflow-auto">
              {audits.map((a, i) => (
                <div key={i} className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <div>{a.status ?? a.action ?? '-'}</div>
                    <div className="text-xs text-muted-foreground">{a.created_at ?? '-'}</div>
                  </div>
                  {a.note && <div className="text-xs text-muted-foreground">{a.note}</div>}
                </div>
              ))}
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
