/** @format */

"use client";

import { FileText, Search, Download } from "lucide-react";
import { useClientInvoices } from "@/hooks/queries/billing";
import type { Invoice } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UploadPaymentDialog } from "./upload-payment-dialog";
import Link from "next/link";

type Props = {
  initialData?: Invoice[];
};

export function ClientInvoicesList({ initialData }: Props) {
  const { data: invoices = [] } = useClientInvoices(initialData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tagihan</h2>
          <p className="text-muted-foreground">Daftar tagihan Anda</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari tagihan..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Tagihan</CardTitle>
          <CardDescription>Tagihan dan status pembayarannya</CardDescription>
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
                        Jatuh tempo: {invoice.due_date}
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
                    <Link href={`/koperasi/billing`} className="text-sm text-muted-foreground hover:underline">
                      Detail
                    </Link>
                    {invoice.status !== "paid" && (
                      <UploadPaymentDialog invoiceId={invoice.id} />
                    )}
                    <a
                      className="text-sm text-muted-foreground hover:underline"
                      href="#"
                    >
                      <Download className="h-4 w-4" />
                    </a>
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
