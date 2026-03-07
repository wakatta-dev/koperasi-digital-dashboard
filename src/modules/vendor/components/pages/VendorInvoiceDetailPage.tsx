/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FeatureInvoiceDetailView } from "@/modules/accounting";
import {
  useAccountingArInvoiceDetail,
  useAccountingArInvoiceMutations,
} from "@/hooks/queries";
import {
  ensureAccountingArSuccess,
  getAccountingArInvoicePdf,
  toAccountingArApiError,
} from "@/services/api/accounting-ar";
import { VENDOR_ROUTES } from "../../constants/routes";
import { formatVendorCurrency, formatVendorDate } from "../../utils/format";

type VendorInvoiceDetailPageProps = {
  invoiceNumber: string;
};

export function VendorInvoiceDetailPage({
  invoiceNumber,
}: VendorInvoiceDetailPageProps) {
  const router = useRouter();
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
  const detailQuery = useAccountingArInvoiceDetail(invoiceNumber, {
    enabled: Boolean(invoiceNumber),
  });
  const invoiceMutations = useAccountingArInvoiceMutations();

  const detail = useMemo(() => {
    if (!detailQuery.data) return null;
    return {
      current_step: detailQuery.data.current_step,
      invoice_number: detailQuery.data.invoice_number,
      invoice_date: formatVendorDate(detailQuery.data.invoice_date),
      due_date: formatVendorDate(detailQuery.data.due_date),
      customer_identity: {
        name: detailQuery.data.customer.customer_name,
        address_lines: detailQuery.data.customer.address_lines ?? [],
      },
      detail_rows: detailQuery.data.line_items.map((item, index) => ({
        id: `${detailQuery.data.invoice_number}-${index}`,
        product_or_service: item.product_or_service,
        description: item.description ?? "",
        qty: item.qty,
        price: formatVendorCurrency(item.price),
        tax: `${item.tax_percent}%`,
        line_total: formatVendorCurrency(item.line_total),
      })),
      summary_totals: {
        subtotal: formatVendorCurrency(detailQuery.data.totals.subtotal),
        tax: formatVendorCurrency(detailQuery.data.totals.tax_amount),
        total: formatVendorCurrency(detailQuery.data.totals.grand_total),
      },
      status: detailQuery.data.status,
      notes: detailQuery.data.notes,
    };
  }, [detailQuery.data]);

  const handleSendViaEmail = async () => {
    setActionErrorMessage(null);
    try {
      await invoiceMutations.sendInvoice.mutateAsync({
        invoiceNumber,
        payload: {
          channel: "email",
          recipient_email: detailQuery.data?.customer.recipient_email || "billing@example.com",
        },
      });
      toast.success("Invoice sent");
    } catch (error) {
      setActionErrorMessage(toAccountingArApiError(error).message);
    }
  };

  const handleDownloadPdf = async () => {
    setActionErrorMessage(null);
    try {
      const payload = ensureAccountingArSuccess(
        await getAccountingArInvoicePdf(invoiceNumber)
      );
      if (typeof window !== "undefined") {
        window.open(payload.download_url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setActionErrorMessage(toAccountingArApiError(error).message);
    }
  };

  return (
    <div className="space-y-4">
      {detailQuery.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {(detailQuery.error as Error).message}
        </div>
      ) : null}

      {detailQuery.isPending ? (
        <div className="rounded-xl border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          Memuat detail invoice...
        </div>
      ) : null}

      {detail ? (
        <FeatureInvoiceDetailView
          detail={detail}
          onSendViaEmail={handleSendViaEmail}
          onDownloadPdf={handleDownloadPdf}
          onRegisterPayment={() => {
            toast.info("Pencatatan pembayaran belum dipisah untuk vendor console.");
            router.push(VENDOR_ROUTES.invoices);
          }}
          actionErrorMessage={actionErrorMessage}
          actionLoading={invoiceMutations.sendInvoice.isPending}
        />
      ) : null}
    </div>
  );
}
