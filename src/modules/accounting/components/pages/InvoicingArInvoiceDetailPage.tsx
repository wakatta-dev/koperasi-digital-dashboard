/** @format */

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useAccountingArInvoiceDetail,
  useAccountingArInvoiceMutations,
} from "@/hooks/queries";
import {
  ensureAccountingArSuccess,
  getAccountingArInvoicePdf,
  toAccountingArApiError,
} from "@/services/api/accounting-ar";

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import {
  formatAccountingArCurrency,
  formatAccountingArDate,
  normalizeInvoiceStatus,
} from "../../utils/formatters";
import { FeatureInvoiceDetailView } from "../features/FeatureInvoiceDetailView";

type InvoicingArInvoiceDetailPageProps = {
  invoiceNumber?: string;
};

export function InvoicingArInvoiceDetailPage({
  invoiceNumber,
}: InvoicingArInvoiceDetailPageProps) {
  const normalizedInvoiceNumber = (invoiceNumber ?? "").trim();
  const router = useRouter();
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  const detailQuery = useAccountingArInvoiceDetail(normalizedInvoiceNumber, {
    enabled: normalizedInvoiceNumber.length > 0,
  });

  const invoiceMutations = useAccountingArInvoiceMutations();

  const detail = useMemo(
    () =>
      detailQuery.data
        ? {
            current_step: detailQuery.data.current_step,
            invoice_number: detailQuery.data.invoice_number,
            invoice_date: formatAccountingArDate(detailQuery.data.invoice_date),
            due_date: formatAccountingArDate(detailQuery.data.due_date),
            customer_identity: {
              name: detailQuery.data.customer.customer_name,
              address_lines: detailQuery.data.customer.address_lines ?? [],
            },
            detail_rows: detailQuery.data.line_items.map((item, index) => ({
              id: `${detailQuery.data.invoice_number}-${index}`,
              product_or_service: item.product_or_service,
              description: item.description ?? "",
              qty: item.qty,
              price: formatAccountingArCurrency(item.price),
              tax: `${item.tax_percent}%`,
              line_total: formatAccountingArCurrency(item.line_total),
            })),
            summary_totals: {
              subtotal: formatAccountingArCurrency(detailQuery.data.totals.subtotal),
              tax: formatAccountingArCurrency(detailQuery.data.totals.tax_amount),
              total: formatAccountingArCurrency(detailQuery.data.totals.grand_total),
            },
            status: normalizeInvoiceStatus(detailQuery.data.status),
            notes: detailQuery.data.notes,
          }
        : null,
    [detailQuery.data]
  );

  const handleSendViaEmail = async () => {
    if (!normalizedInvoiceNumber) return;

    setActionErrorMessage(null);

    try {
      await invoiceMutations.sendInvoice.mutateAsync({
        invoiceNumber: normalizedInvoiceNumber,
        payload: {
          channel: "email",
          recipient_email: "billing@example.com",
        },
      });
      toast.success("Invoice sent");
    } catch (err) {
      const parsed = toAccountingArApiError(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422) {
        setActionErrorMessage(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  const handleDownloadPdf = async () => {
    if (!normalizedInvoiceNumber) return;

    setActionErrorMessage(null);

    try {
      const payload = ensureAccountingArSuccess(
        await getAccountingArInvoicePdf(normalizedInvoiceNumber)
      );
      if (typeof window !== "undefined") {
        window.open(payload.download_url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      const parsed = toAccountingArApiError(err);
      if (parsed.statusCode === 409 || parsed.statusCode === 422) {
        setActionErrorMessage(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  return (
    <div className="space-y-4">
      {!normalizedInvoiceNumber ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Invoice number is required.
        </div>
      ) : null}

      {detailQuery.isPending ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          Loading invoice detail...
        </div>
      ) : null}

      {detailQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingArApiError(detailQuery.error).message}
        </div>
      ) : null}

      {!detailQuery.isPending && !detailQuery.error && !detail ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          Invoice detail is unavailable.
        </div>
      ) : null}

      {detail ? (
        <FeatureInvoiceDetailView
          detail={detail}
          onSendViaEmail={handleSendViaEmail}
          onDownloadPdf={handleDownloadPdf}
          onRegisterPayment={() => router.push(INVOICING_AR_ROUTES.createPayment)}
          actionErrorMessage={actionErrorMessage}
          actionLoading={invoiceMutations.sendInvoice.isPending}
        />
      ) : null}
    </div>
  );
}
