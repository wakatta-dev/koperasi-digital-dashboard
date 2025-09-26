/** @format */

"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import {
  useInfiniteVendorInvoices,
  useBillingActions,
} from "@/hooks/queries/billing";
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
import { WebhookSimulatorSheet } from "@/components/feature/vendor/payments/webhook-simulator-sheet";
import { useTenants } from "@/hooks/queries/tenants";
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
import { useEffect } from "react";
import { getVendorInvoice } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounce";

type Props = {
  initialData?: Invoice[];
  initialCursor?: string;
};

export function VendorInvoicesList({ initialData, initialCursor }: Props) {
  const [preview, setPreview] = useState<Invoice | null>(null);
  const [previewDetail, setPreviewDetail] = useState<Invoice | null>(null);
  const [status, setStatus] = useState<"draft" | "issued" | "paid" | "overdue" | undefined>(
    undefined
  );
  const [year, setYear] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const debounced = useDebouncedValue(search, 300);
  const params = useMemo(
    () => ({
      limit: 10,
      ...(status ? { status } : {}),
      ...(year ? { year } : {}),
      ...(debounced ? { term: debounced } : {}),
    }),
    [status, year, debounced]
  );
  const {
    data: invoices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVendorInvoices(params, { initialData, initialCursor }, { refetchInterval: 300000 });
  const {
    deleteVendorInv,
    updateVendorInvStatus,
    sendInvoiceEmail,
    downloadInvoicePdf,
  } = useBillingActions();
  const { data: tenants = [] } = useTenants({ limit: 200 });
  const tenantName = (id?: number) => {
    const t = (tenants as any[]).find((x) => x.id === id);
    return t?.name || `#${id}`;
  };
  const getInvoiceBadgeVariant = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "default" as const;
      case "overdue":
        return "destructive" as const;
      case "draft":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };
  const confirm = useConfirm();

  useEffect(() => {
    (async () => {
      if (!preview) {
        setPreviewDetail(null);
        return;
      }
      try {
        const res = await getVendorInvoice(preview.id).catch(() => null);
        setPreviewDetail(res?.data ?? null);
      } catch {
        setPreviewDetail(null);
      }
    })();
  }, [preview]);

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
          <WebhookSimulatorSheet />
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
                    <Input
                      id="search"
                      placeholder="Cari nomor/tenant (opsional)"
                      className="pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(v) =>
                      setStatus((v as typeof status) || undefined)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">draft</SelectItem>
                      <SelectItem value="issued">issued</SelectItem>
                      <SelectItem value="paid">paid</SelectItem>
                      <SelectItem value="overdue">overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Tahun</Label>
                  <Input
                    id="year"
                    type="number"
                    min={2000}
                    max={9999}
                    value={year ?? ""}
                    onChange={(e) => setYear(e.target.value || undefined)}
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setStatus(undefined);
                      setYear(undefined);
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
                    <p className="text-xs text-muted-foreground">
                      Tenant: {tenantName(invoice.tenant_id)}
                      {((invoice as any)?.subscription?.plan?.name || (invoice as any)?.plan?.name) && (
                        <> • Plan: {((invoice as any)?.subscription?.plan?.name || (invoice as any)?.plan?.name) as string}</>
                      )}
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

                  <Badge variant={getInvoiceBadgeVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                  <Select
                    defaultValue={invoice.status}
                    onValueChange={async (next) => {
                      const ok = await confirm({
                        variant: "edit",
                        title: "Ubah status invoice?",
                        description: `Status akan menjadi ${next}.`,
                        confirmText: "Simpan",
                      });
                      if (!ok) return;
                      await updateVendorInvStatus.mutateAsync({
                        id: invoice.id,
                        status: next as "issued" | "paid" | "overdue",
                      });
                    }}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="issued">issued</SelectItem>
                      <SelectItem value="paid">paid</SelectItem>
                      <SelectItem value="overdue">overdue</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setPreview(invoice)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      title="Download PDF"
                      onClick={() => downloadInvoicePdf.mutate(invoice.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => sendInvoiceEmail.mutate(invoice.id)}
                    >
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
                <Badge variant={getInvoiceBadgeVariant(preview.status)}>
                  {preview.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>Issued: {preview.issued_at}</div>
                <div>Due: {preview.due_date ?? "-"}</div>
                <div>Tenant: {tenantName(preview.tenant_id)}</div>
                {preview.subscription_id && (
                  <div>Subscription: #{preview.subscription_id}</div>
                )}
                <div className="col-span-2 font-medium">
                  Total: Rp {preview.total}
                </div>
              </div>
              {/* Items */}
              <div className="space-y-2">
                <div className="font-medium">Items</div>
                {((previewDetail?.items ?? preview.items) || []).map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between border rounded p-2"
                  >
                    <div>{it.description}</div>
                    <div className="text-muted-foreground">
                      {it.quantity} ×{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(it.price)}
                    </div>
                  </div>
                ))}
                {!((previewDetail?.items ?? preview.items) || []).length && (
                  <div className="text-xs text-muted-foreground italic">
                    Tidak ada item
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => downloadInvoicePdf.mutate(preview.id)}
                >
                  Download PDF
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="default"
                  onClick={() => sendInvoiceEmail.mutate(preview.id)}
                >
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
