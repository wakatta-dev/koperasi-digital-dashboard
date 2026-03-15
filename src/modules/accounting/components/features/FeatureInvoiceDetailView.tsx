/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { Check, Mail, FileText, Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableShell } from "@/components/shared/data-display/TableShell";

import type {
  InvoiceDetailModel,
  InvoiceStepperStatus,
} from "../../types/invoicing-ar";

type FeatureInvoiceDetailViewProps = {
  detail: InvoiceDetailModel;
  onSendViaEmail?: () => void;
  onDownloadPdf?: () => void;
  onRegisterPayment?: () => void;
  actionErrorMessage?: string | null;
  actionLoading?: boolean;
};

const STEPS: InvoiceStepperStatus[] = ["Draft", "Sent", "Paid"];

export function FeatureInvoiceDetailView({
  detail,
  onSendViaEmail,
  onDownloadPdf,
  onRegisterPayment,
  actionErrorMessage,
  actionLoading = false,
}: FeatureInvoiceDetailViewProps) {
  const activeIndex = STEPS.indexOf(detail.current_step);

  const columns: ColumnDef<InvoiceDetailModel["detail_rows"][number], unknown>[] =
    [
      {
        id: "description",
        header: "Description",
        meta: {
          headerClassName: "px-8 py-4",
          cellClassName: "px-8 py-6",
        },
        cell: ({ row }) => (
          <>
            <div className="font-semibold text-gray-900 dark:text-white">
              {row.original.product_or_service}
            </div>
            <p className="mt-1 text-xs italic text-gray-500">
              {row.original.description}
            </p>
          </>
        ),
      },
      {
        id: "qty",
        header: "Qty",
        meta: {
          align: "center",
          headerClassName: "px-6 py-4 text-center",
          cellClassName: "px-6 py-6 text-center text-sm font-medium",
        },
        cell: ({ row }) => row.original.qty,
      },
      {
        id: "price",
        header: "Price",
        meta: {
          align: "right",
          headerClassName: "px-6 py-4 text-right",
          cellClassName: "px-6 py-6 text-right text-sm font-medium",
        },
        cell: ({ row }) => row.original.price,
      },
      {
        id: "amount",
        header: "Amount",
        meta: {
          align: "right",
          headerClassName: "px-8 py-4 text-right",
          cellClassName:
            "px-8 py-6 text-right text-sm font-bold text-gray-900 dark:text-white",
        },
        cell: ({ row }) => row.original.line_total,
      },
    ];

  return (
    <section className="space-y-6">
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="relative flex items-center justify-between">
            {STEPS.map((step, index) => {
              const active = index <= activeIndex;
              return (
                <div
                  key={step}
                  className="relative z-10 flex flex-1 flex-col items-center"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ring-4 ${
                      active
                        ? "bg-indigo-600 text-white ring-indigo-50 dark:ring-indigo-900/30"
                        : "border-2 border-dashed border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span
                    className={`mt-2 text-sm font-semibold ${
                      active ? "text-indigo-600" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
            <div className="absolute top-5 left-[16.6%] right-[16.6%] h-0.5 bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-indigo-600"
                style={{
                  width:
                    activeIndex <= 0
                      ? "0%"
                      : activeIndex === 1
                        ? "50%"
                        : "100%",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-gray-200 dark:border-gray-700"
            disabled={actionLoading}
            onClick={onSendViaEmail}
          >
            <Mail className="h-4 w-4" />
            Send via Email
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-gray-200 dark:border-gray-700"
            disabled={actionLoading}
            onClick={onDownloadPdf}
          >
            <FileText className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
        <Button
          type="button"
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={onRegisterPayment}
        >
          <Coins className="h-4 w-4" />
          Register Payment
        </Button>
      </div>

      {actionErrorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionErrorMessage}
        </div>
      ) : null}

      <Card className="overflow-hidden border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="space-y-0 p-0">
          <div className="border-b border-gray-100 p-8 dark:border-gray-700">
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    3Portals Inc.
                  </h3>
                  <p className="text-xs text-gray-500">Jakarta, Indonesia</p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Customer
                </p>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {detail.customer_identity.name}
                </h4>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {detail.customer_identity.address_lines.join("\n")}
                </p>
              </div>
              <div className="space-y-2 text-right">
                <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                  Invoice
                </h2>
                <p className="text-sm text-gray-500">
                  Number:{" "}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {detail.invoice_number}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Invoice Date:{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {detail.invoice_date}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Due Date:{" "}
                  <span className="font-medium text-red-500">
                    {detail.due_date}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <TableShell
            columns={columns}
            data={detail.detail_rows}
            getRowId={(row) => row.id}
            emptyState="Belum ada detail invoice."
            headerClassName="bg-gray-50 dark:bg-gray-800/50"
            headerRowClassName="border-b border-gray-100 dark:border-gray-700"
          />

          <div className="bg-gray-50/50 p-8 dark:bg-gray-800/20">
            <div className="ml-auto w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {detail.summary_totals.subtotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">VAT (11%)</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {detail.summary_totals.tax}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  Total Amount
                </span>
                <span className="text-xl font-black text-indigo-600">
                  {detail.summary_totals.total}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
