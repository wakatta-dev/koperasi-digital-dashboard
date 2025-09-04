/** @format */

import { getVendorInvoice, listVendorAudits } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PageProps { params: Promise<{ id: string }> }

export default async function VendorInvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const res = await getVendorInvoice(id).catch(() => null);
  const inv = res?.data;
  const auditsRes = await listVendorAudits({ limit: 100 }).catch(() => null);
  const audits = (auditsRes?.data ?? []).filter((a: any) => String(a.entity_id) === String(id) && a.entity?.toLowerCase?.() === "invoice");
  if (!inv) return (
    <div className="p-2 space-y-4">
      <Link href="/vendor/invoices" className="text-sm text-muted-foreground">← Back</Link>
      <div className="text-sm text-muted-foreground">Invoice tidak ditemukan</div>
    </div>
  );
  return (
    <div className="p-2 space-y-4">
      <Link href="/vendor/invoices" className="text-sm text-muted-foreground">← Back</Link>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Invoice {inv.number}</CardTitle>
          <Badge variant={inv.status === "paid" ? "default" : inv.status === "pending" ? "secondary" : "destructive"}>{inv.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>No: {inv.number}</div>
            <div>Total: Rp {inv.total}</div>
            <div>Diterbitkan: {inv.issued_at}</div>
            <div>Jatuh tempo: {inv.due_date ?? '-'}</div>
            <div>Tenant: #{inv.tenant_id}</div>
            {inv.subscription_id && <div>Subscription: #{inv.subscription_id}</div>}
          </div>
          <div className="mt-2">
            <div className="font-medium">Items</div>
            <div className="mt-1 space-y-1 text-sm">
              {(inv.items ?? []).map((it: any) => (
                <div key={it.id} className="flex items-center justify-between border rounded p-2">
                  <div>{it.description}</div>
                  <div>{it.quantity} × Rp {it.price}</div>
                </div>
              ))}
              {!inv.items?.length && (
                <div className="text-xs text-muted-foreground italic">Tidak ada item</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {audits.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between border rounded p-2">
                <div>#{a.id}</div>
                <div>{a.old_status ?? "-"} → {a.new_status}</div>
                <div className="text-muted-foreground">{a.created_at}</div>
              </div>
            ))}
            {!audits.length && (
              <div className="text-xs text-muted-foreground italic">Tidak ada audit untuk invoice ini</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
