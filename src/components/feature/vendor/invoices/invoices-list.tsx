/** @format */

"use client";

import { useMemo, useState } from "react";
import { FileText, Search, Download, Eye, Edit, Trash2, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useInfiniteVendorInvoices } from "@/hooks/queries/billing";
import type { Invoice } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InvoiceUpsertDialog } from "@/components/feature/vendor/invoices/invoice-upsert-dialog";
import { PaymentVerifyDialog } from "@/components/feature/vendor/payments/payment-verify-dialog";
import { useBillingActions } from "@/hooks/queries/billing";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

type Props = {
  initialData?: Invoice[];
  initialCursor?: string;
};

export function VendorInvoicesList({ initialData, initialCursor }: Props) {
  const [preview, setPreview] = useState<Invoice | null>(null);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [periode, setPeriode] = useState<string | undefined>(undefined);
  const params = useMemo(
    () => ({
      limit: 10,
      ...(status ? { status } : {}),
      ...(periode ? { periode } : {}),
    }),
    [status, periode]
  );
  const {
    data: invoices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVendorInvoices(params, { initialData, initialCursor });
  const { deleteVendorInv, updateVendorInvStatus } = useBillingActions();
  const confirm = useConfirm();

  function exportCsv() {
    const rows = [
      ["id", "number", "issued_at", "due_date", "total", "status"],
      ...(invoices ?? []).map((i) => [
        i.id,
        i.number,
        i.issued_at,
        i.due_date ?? "",
        i.total,
        i.status,
      ]),
    ];
    const csv = rows
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "invoices.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoices</h2>
          <p className="text-muted-foreground">
            Track and manage your invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PaymentVerifyDialog />
          <InvoiceUpsertDialog />
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/* Placeholder for quick info if needed */}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" type="button" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-2" /> CSV
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" type="button">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <SheetHeader>
                <SheetTitle>Filter Invoices</SheetTitle>
                <SheetDescription>
                  Atur pencarian dan filter untuk daftar invoice
                </SheetDescription>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Pencarian</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="search" placeholder="Cari nomor/tenant (opsional)" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="border rounded px-2 py-2 text-sm w-full"
                    value={status ?? ""}
                    onChange={(e) => setStatus(e.target.value || undefined)}
                  >
                    <option value="">Semua</option>
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="overdue">overdue</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periode">Periode</Label>
                  <Input
                    id="periode"
                    type="month"
                    value={periode ?? ""}
                    onChange={(e) => setPeriode(e.target.value || undefined)}
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setStatus(undefined);
                      setPeriode(undefined);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>All your invoices and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(invoices ?? []).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{invoice.number}</h3>
                    <p className="text-sm text-muted-foreground">
                      {invoice.issued_at}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">Rp {invoice.total}</p>
                    {invoice.due_date && (
                      <p className="text-sm text-muted-foreground">
                        Due: {invoice.due_date}
                      </p>
                    )}
                  </div>

                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "default"
                        : invoice.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {invoice.status}
                  </Badge>
                  <select
                    defaultValue={invoice.status}
                    className="border rounded px-2 py-1 text-sm"
                    onChange={async (e) => {
                      const next = e.target.value;
                      const ok = await confirm({
                        variant: "edit",
                        title: "Ubah status invoice?",
                        description: `Status akan menjadi ${next}.`,
                        confirmText: "Simpan",
                      });
                      if (!ok) return;
                      await updateVendorInvStatus.mutateAsync({
                        id: invoice.id,
                        status: next,
                      });
                    }}
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="overdue">overdue</option>
                    <option value="cancelled">cancelled</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setPreview(invoice)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    {/* TODO integrate API: send invoice via email */}
                    <Button variant="ghost" size="sm" type="button">
                      Email
                    </Button>
                    <InvoiceUpsertDialog
                      invoice={invoice}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        const ok = await confirm({
                          variant: "delete",
                          title: "Hapus invoice?",
                          description: `Invoice ${invoice.number} akan dihapus.`,
                          confirmText: "Hapus",
                        });
                        if (!ok) return;
                        deleteVendorInv.mutate(invoice.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={!hasNextPage || isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage
                ? "Memuat..."
                : hasNextPage
                ? "Muat lagi"
                : "Tidak ada data lagi"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Invoice Preview */}
      <Sheet open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Invoice Preview</SheetTitle>
            <SheetDescription>Detail ringkas invoice</SheetDescription>
          </SheetHeader>
          {preview && (
            <div className="p-4 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">{preview.number}</div>
                <Badge
                  variant={
                    preview.status === "paid"
                      ? "default"
                      : preview.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {preview.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Issued: {preview.issued_at}</div>
                <div>Due: {preview.due_date ?? '-'}</div>
                <div>Tenant: #{preview.tenant_id}</div>
                {preview.subscription_id && (
                  <div>Subscription: #{preview.subscription_id}</div>
                )}
                <div className="col-span-2 font-medium">Total: Rp {preview.total}</div>
              </div>
              {/* TODO integrate API: fetch full invoice details/items for preview */}
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" type="button" variant="outline">
                  Download PDF
                </Button>
                <Button size="sm" type="button" variant="default">
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
