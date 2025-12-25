/** @format */

"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { useMarketplaceOrder } from "@/hooks/queries/marketplace-orders";
import {
  formatOrderDate,
  formatOrderDateTime,
  formatOrderNumber,
  getPaymentBadge,
} from "../utils";
import type {
  MarketplaceOrderDetailResponse,
  MarketplaceOrderItemResponse,
} from "@/types/api/marketplace";

export type OrderInvoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: number | string;
  order?: MarketplaceOrderDetailResponse;
};

const formatVariantLabel = (item: MarketplaceOrderItemResponse) => {
  const group = item.variant_group_name?.trim();
  const attributes = item.variant_attributes ?? {};
  const size = attributes.size;
  const attributeLabels = Object.entries(attributes)
    .filter(([key]) => key !== "size")
    .map(([key, value]) => {
      const label = key.replace(/_/g, " ").trim();
      const title = label ? label[0].toUpperCase() + label.slice(1) : "";
      return title ? `${title} ${value}`.trim() : value;
    })
    .filter(Boolean)
    .join(" / ");
  const optionLabel = size || attributeLabels || item.variant_sku;
  if (group && optionLabel) return `${group} / ${optionLabel}`;
  return group || optionLabel || "";
};

export function OrderInvoiceDialog({
  open,
  onOpenChange,
  orderId,
  order,
}: OrderInvoiceDialogProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.dataset.invoicePrint = "true";
      return () => {
        delete document.body.dataset.invoicePrint;
      };
    }
    delete document.body.dataset.invoicePrint;
  }, [open]);

  const { data, isLoading } = useMarketplaceOrder(orderId, {
    enabled: open && Boolean(orderId) && !order,
  });

  const activeOrder = order ?? data;
  const items = activeOrder?.items ?? [];
  const itemsSubtotal = items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);
  const shippingCost = 0;
  const discountValue = 0;
  const totalPayment = activeOrder?.total ?? itemsSubtotal + shippingCost;
  const paymentBadge = getPaymentBadge(activeOrder?.status);
  const shippingMethod =
    activeOrder?.shipping_method ??
    (activeOrder?.fulfillment_method === "DELIVERY" ? "Pengiriman" : "Pickup");
  const invoiceDate =
    activeOrder?.updated_at ?? activeOrder?.created_at ?? undefined;
  const printDate = formatOrderDateTime(Math.floor(Date.now() / 1000));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <style jsx global>{`
        @media print {
          body[data-invoice-print="true"] * {
            visibility: hidden;
          }
          body[data-invoice-print="true"] #invoice-modal-content,
          body[data-invoice-print="true"] #invoice-modal-content * {
            visibility: visible;
          }
          body[data-invoice-print="true"] #invoice-modal-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
            max-width: none;
            border-radius: 0;
          }
        }
      `}</style>
      <DialogContent
        className="!flex !flex-col !gap-0 !p-0 w-full max-w-[90vw] sm:!max-w-4xl border border-border shadow-2xl bg-popover text-foreground max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:absolute print:top-0 print:left-0 print:w-full print:m-0 print:max-w-none print:translate-x-0 print:translate-y-0 print:rounded-none print:bg-white print:text-gray-900"
        id="invoice-modal-content"
        showCloseButton={false}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-muted/40 px-6 py-4 print:hidden">
          <DialogTitle className="flex items-center text-lg font-semibold leading-6 text-foreground">
            <span className="material-symbols-outlined mr-2 text-indigo-600 dark:text-indigo-400">
              print
            </span>
            Cetak Invoice
          </DialogTitle>
          <DialogClose asChild>
            <button
              className="rounded-md bg-transparent text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
              type="button"
            >
              <span className="sr-only">Close</span>
              <span className="material-symbols-outlined">close</span>
            </button>
          </DialogClose>
        </div>
        <div
          className="overflow-y-auto bg-card p-8 text-foreground print:overflow-visible print:p-0 print:bg-white print:text-gray-900 sm:p-10"
          id="invoice-printable"
        >
          {isLoading && !activeOrder ? (
            <div className="text-sm text-muted-foreground">Memuat invoice...</div>
          ) : null}
          {activeOrder ? (
            <>
              <div className="mb-8 flex flex-col items-start justify-between border-b border-border pb-8 md:flex-row">
                <div className="mb-6 md:mb-0">
                  <div className="mb-4 flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm print:shadow-none">
                      <span className="material-symbols-outlined text-2xl">
                        storefront
                      </span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-foreground print:text-gray-900">
                        3Portals BUMDes
                      </h1>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground print:text-gray-500">
                        Unit Perdagangan Desa
                      </p>
                    </div>
                  </div>
                  <div className="text-sm leading-relaxed text-muted-foreground print:text-gray-600">
                    <p>Jl. Raya Desa No. 123, Sukamaju</p>
                    <p>Kecamatan Megamendung, Bogor 16770</p>
                    <p>Jawa Barat, Indonesia</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="flex items-center">
                        <span className="material-symbols-outlined mr-1 text-[16px] text-muted-foreground print:text-gray-400">
                          call
                        </span>
                        +62 812-3456-7890
                      </span>
                      <span className="flex items-center">
                        <span className="material-symbols-outlined mr-1 text-[16px] text-muted-foreground print:text-gray-400">
                          mail
                        </span>
                        info@3portals.id
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full text-left md:w-auto md:text-right">
                  <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 print:text-indigo-600">
                    INVOICE
                  </h2>
                  <p className="mb-4 text-lg font-semibold text-foreground print:text-gray-700">
                    {formatOrderNumber(activeOrder.order_number)}
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between gap-8 md:justify-end">
                      <span className="text-muted-foreground print:text-gray-500">
                        Tanggal Invoice:
                      </span>
                      <span className="font-medium text-foreground print:text-gray-900">
                        {formatOrderDate(invoiceDate)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-8 md:justify-end">
                      <span className="text-muted-foreground print:text-gray-500">
                        Tanggal Pesanan:
                      </span>
                      <span className="font-medium text-foreground print:text-gray-900">
                        {formatOrderDate(activeOrder.created_at)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-8 pt-2 md:justify-end">
                      <span className="text-muted-foreground print:text-gray-500">
                        Status Pembayaran:
                      </span>
                      <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground print:border-0 print:bg-green-100 print:text-green-800">
                        {paymentBadge.label.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8 grid grid-cols-1 gap-8 border-b border-border pb-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-400">
                    <span className="material-symbols-outlined mr-1 text-[16px]">
                      person
                    </span>
                    Kepada (Bill To)
                  </h3>
                  <div className="text-sm text-muted-foreground print:text-gray-600">
                    <p className="mb-1 text-base font-bold text-foreground print:text-gray-900">
                      {activeOrder.customer_name}
                    </p>
                    <p className="mb-1">{activeOrder.customer_email}</p>
                    <p>{activeOrder.customer_phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-400 md:justify-end">
                    <span className="material-symbols-outlined mr-1 text-[16px]">
                      local_shipping
                    </span>
                    Kirim Ke (Ship To)
                  </h3>
                  <div className="text-sm text-muted-foreground print:text-gray-600 md:text-right">
                    <p className="mb-1 text-base font-bold text-foreground print:text-gray-900">
                      {activeOrder.customer_name}
                    </p>
                    <p className="mb-2 leading-relaxed">
                      {activeOrder.customer_address || "-"}
                    </p>
                    <p className="inline-block rounded border border-border bg-muted/40 px-2 py-1 text-xs print:border-0 print:bg-transparent print:p-0">
                      <span className="font-semibold">Metode:</span> {shippingMethod}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-400">
                  Daftar Barang
                </h3>
                <div className="overflow-hidden rounded-lg border border-border print:rounded-none print:border-0">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/40 print:bg-gray-100">
                      <tr>
                        <th
                          className="w-12 px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-500"
                          scope="col"
                        >
                          No.
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-500"
                          scope="col"
                        >
                          Produk
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-500"
                          scope="col"
                        >
                          Harga Satuan
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-500"
                          scope="col"
                        >
                          Jumlah
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-500"
                          scope="col"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card print:bg-white">
                      {items.map((item, index) => {
                        const variantLabel = formatVariantLabel(item);
                        return (
                          <tr
                            key={`${item.product_id}-${item.variant_option_id ?? index}`}
                          >
                            <td className="px-6 py-4 text-sm text-muted-foreground print:text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground print:text-gray-900">
                              {item.product_name}
                              <span className="block text-xs font-normal text-muted-foreground print:text-gray-400">
                                SKU: {item.product_sku}
                              </span>
                              {variantLabel ? (
                                <span className="block text-xs font-normal text-muted-foreground print:text-gray-400">
                                  {variantLabel}
                                </span>
                              ) : null}
                            </td>
                            <td className="px-6 py-4 text-right text-sm text-muted-foreground print:text-gray-500">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-6 py-4 text-right text-sm text-muted-foreground print:text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-semibold text-foreground print:text-gray-900">
                              {formatCurrency(item.subtotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-8 md:flex-row">
                <div className="w-full md:w-5/12">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-400">
                    Informasi Pembayaran
                  </h3>
                  <div className="rounded-lg border border-border bg-muted/40 p-5 print:border-gray-300 print:bg-transparent">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground print:text-gray-500">
                        Metode
                      </span>
                      <span className="flex items-center text-sm font-semibold text-foreground print:text-gray-900">
                        <span className="material-symbols-outlined mr-1 text-[18px] text-muted-foreground print:text-gray-400">
                          account_balance
                        </span>
                        {activeOrder.payment_method || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="text-sm text-muted-foreground print:text-gray-500">
                        ID Transaksi
                      </span>
                      <span className="rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground print:border-0 print:bg-transparent print:p-0 print:text-sm print:text-gray-700">
                        {activeOrder.payment_reference || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-400">
                      Catatan
                    </h3>
                    <p className="text-xs italic leading-relaxed text-muted-foreground print:text-gray-500">
                      {activeOrder.notes ||
                        "Terima kasih atas kepercayaan Anda berbelanja di BUMDes Sejahtera."}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-5/12">
                  <div className="rounded-lg bg-muted/40 p-6 print:bg-transparent print:p-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground print:text-gray-600">
                          Subtotal Barang
                        </span>
                        <span className="font-medium text-foreground print:text-gray-900">
                          {formatCurrency(itemsSubtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground print:text-gray-600">
                          Biaya Pengiriman
                        </span>
                        <span className="font-medium text-foreground print:text-gray-900">
                          {formatCurrency(shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground print:text-gray-600">
                          Diskon
                        </span>
                        <span className="font-medium text-emerald-500 print:text-green-600">
                          -{formatCurrency(discountValue)}
                        </span>
                      </div>
                      <div className="my-3 border-t border-border"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-foreground print:text-gray-800">
                          Total Pembayaran
                        </span>
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 print:text-indigo-600">
                          {formatCurrency(totalPayment)}
                        </span>
                      </div>
                      <div className="mt-1 text-right text-xs text-muted-foreground print:text-gray-400">
                        Termasuk PPN jika berlaku
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-16 hidden items-end justify-between border-t border-border pt-8 print:flex">
                <div className="text-[10px] text-muted-foreground print:text-gray-400">
                  Dicetak pada: <span id="print-date">{printDate}</span>
                  <br />
                  System: 3Portals Business Manager
                </div>
                <div className="w-40 text-center">
                  <div className="mb-2 h-20 border-b border-border print:border-gray-300"></div>
                  <p className="text-xs font-medium text-muted-foreground print:text-gray-500">
                    Authorized Signature
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3 border-t border-border bg-muted/40 px-6 py-4 print:hidden sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <button
              className="inline-flex w-full items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
              type="button"
            >
              Kembali
            </button>
          </DialogClose>
          <button
            className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.print();
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 text-lg">
              print
            </span>
            Cetak Sekarang
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
