/** @format */

"use client";

import { useClientInvoice, useClientInvoiceAudits } from "@/hooks/queries/billing";
import type { Invoice } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadPaymentDialog } from "./upload-payment-dialog";

type Props = { id: string | number; initialInvoice?: Invoice; initialAudits?: any[] };

export function ClientInvoiceDetail({ id, initialInvoice, initialAudits }: Props) {
  const { data: invoice } = useClientInvoice(id, initialInvoice);
  const { data: audits = [] } = useClientInvoiceAudits(id, { limit: 50 }, initialAudits);

  if (!invoice) return <div className="text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice #{invoice.number}</h2>
          <p className="text-muted-foreground">{invoice.issued_at}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={invoice.status === "paid" ? "default" : invoice.status === "pending" ? "secondary" : "destructive"}>
            {invoice.status}
          </Badge>
          {invoice.status !== "paid" && <UploadPaymentDialog invoiceId={invoice.id} />}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rincian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <div>Total: Rp {invoice.total}</div>
            {invoice.due_date && <div>Jatuh Tempo: {invoice.due_date}</div>}
            <div>Items: {invoice.items?.length ?? 0}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {audits.length === 0 && (
              <div className="text-muted-foreground italic">Tidak ada riwayat</div>
            )}
            {audits.map((a: any) => (
              <div key={a.id} className="flex justify-between">
                <span>{a.created_at}</span>
                <span>
                  {a.old_status ? `${a.old_status} → ` : ""}
                  {a.new_status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

