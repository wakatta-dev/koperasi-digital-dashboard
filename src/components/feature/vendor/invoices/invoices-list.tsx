/** @format */

"use client";

import { FileText, Search, Download, Eye, Edit, Trash2 } from "lucide-react";
import { useVendorInvoices } from "@/hooks/queries/billing";
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

type Props = {
  initialData?: Invoice[];
};

export function VendorInvoicesList({ initialData }: Props) {
  const { data: invoices = [] } = useVendorInvoices(initialData);
  const { deleteVendorInv } = useBillingActions();
  const confirm = useConfirm();

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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>All your invoices and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
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

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  );
}
