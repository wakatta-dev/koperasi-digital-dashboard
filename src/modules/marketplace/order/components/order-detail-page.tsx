/** @format */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";
import {
  useMarketplaceOrder,
  useMarketplaceOrderActions,
} from "@/hooks/queries/marketplace-orders";
import { OrderInvoiceDialog } from "./order-invoice-dialog";
import { OrderReturDialog } from "./order-retur-dialog";
import {
  canCancelOrder,
  formatOrderDate,
  formatOrderDateTime,
  formatOrderNumber,
  getPaymentBadge,
  getShippingBadge,
  getStatusAction,
  getTimelineLabel,
} from "../utils";
import type { MarketplaceOrderItemResponse } from "@/types/api/marketplace";
const DEFAULT_PAYMENT_METHOD = "-";

type OrderDetailPageProps = {
  id: string;
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

export function OrderDetailPage({ id }: OrderDetailPageProps) {
  const confirm = useConfirm();
  const { data, isLoading, isError, error } = useMarketplaceOrder(id);
  const { updateStatus } = useMarketplaceOrderActions();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [returOpen, setReturOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const order = data;

  const itemsSubtotal = useMemo(() => {
    if (!order?.items?.length) return 0;
    return order.items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);
  }, [order?.items]);

  const shippingCost = 0;
  const discountValue = 0;
  const totalPayment = order?.total ?? itemsSubtotal + shippingCost - discountValue;

  const paymentBadge = getPaymentBadge(order?.status);
  const shippingBadge = getShippingBadge(order?.status);
  const statusAction = getStatusAction(order?.status);
  const canCancel = canCancelOrder(order?.status);

  const statusHistory = useMemo(() => {
    if (!order?.status_history?.length) return [];
    return [...order.status_history].sort(
      (a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)
    );
  }, [order?.status_history]);

  const handleStatusUpdate = async (
    nextStatus: string,
    actionKey: string,
    reason?: string
  ) => {
    if (!order) return;
    setPendingAction(actionKey);
    try {
      await updateStatus.mutateAsync({
        id: order.id,
        payload: { status: nextStatus, reason },
      });
    } finally {
      setPendingAction(null);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    const ok = await confirm({
      variant: "delete",
      title: "Batalkan pesanan?",
      description: `Pesanan ${formatOrderNumber(order.order_number)} akan dibatalkan.`,
      confirmText: "Batalkan",
    });
    if (!ok) return;
    await handleStatusUpdate("CANCELED", "cancel", "Dibatalkan oleh admin");
  };

  const shippingMethod =
    order?.shipping_method ??
    (order?.fulfillment_method === "DELIVERY" ? "Pengiriman" : "Pickup");

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background text-foreground antialiased">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
          <div className="flex items-center">
            <button
              className="mr-4 text-muted-foreground hover:text-foreground md:hidden"
              type="button"
            >
              <span className="material-icons-outlined">menu</span>
            </button>
            <button
              className="mr-4 hidden text-muted-foreground hover:text-foreground md:block"
              type="button"
            >
              <span className="material-icons-outlined">menu_open</span>
            </button>
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    className="text-sm font-medium text-muted-foreground hover:text-indigo-500"
                    href="/bumdes/marketplace/order"
                  >
                    Manajemen Pesanan
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground">/</span>
                </li>
                <li>
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Detail Pesanan
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          <button
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            type="button"
          >
            <span className="material-icons-outlined dark:hidden">dark_mode</span>
            <span className="material-icons-outlined hidden dark:block">
              light_mode
            </span>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-6">
            <Link
              className="group mb-4 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500"
              href="/bumdes/marketplace/order"
            >
              <span className="material-icons-outlined mr-1 text-base transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              Kembali ke Manajemen Pesanan
            </Link>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-bold text-foreground">
                Detail Pesanan{" "}
                <span className="ml-2 text-xl font-normal text-muted-foreground">
                  {formatOrderNumber(order?.order_number)}
                </span>
              </h1>
              <div className="flex gap-2">
                <Link
                  className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`/bumdes/marketplace/order/${id}/manual-payment`}
                >
                  <span className="material-icons-outlined mr-2 text-lg">
                    payments
                  </span>
                  Konfirmasi Pembayaran
                </Link>
                <button
                  className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  type="button"
                  onClick={() => setInvoiceOpen(true)}
                >
                  <span className="material-icons-outlined mr-2 text-lg">
                    print
                  </span>
                  Cetak Invoice
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Memuat detail pesanan...
            </div>
          ) : null}
          {isError ? (
            <div className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : "Gagal memuat detail pesanan."}
            </div>
          ) : null}

          {order ? (
            <>
              <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      ID Pesanan
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {formatOrderNumber(order.order_number)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Tanggal Pesanan
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {formatOrderDate(order.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status Pembayaran
                    </p>
                    <Badge variant={paymentBadge.variant}>
                      {paymentBadge.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status Pengiriman
                    </p>
                    <Badge variant={shippingBadge.variant}>
                      {shippingBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-6 py-4">
                      <h2 className="text-lg font-medium text-foreground">
                        Daftar Barang
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <Table className="min-w-full divide-y divide-border">
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              scope="col"
                            >
                              Produk
                            </TableHead>
                            <TableHead
                              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              scope="col"
                            >
                              Jumlah
                            </TableHead>
                            <TableHead
                              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              scope="col"
                            >
                              Harga Satuan
                            </TableHead>
                            <TableHead
                              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground"
                              scope="col"
                            >
                              Subtotal
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border">
                          {order.items.map((item) => {
                            const variantLabel = formatVariantLabel(item);
                            const imageSrc =
                              item.variant_image_url || item.product_photo;
                            return (
                              <TableRow
                                key={`${item.product_id}-${item.variant_option_id ?? item.product_sku}`}
                                className="transition-colors hover:bg-muted/40"
                              >
                                <TableCell className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-border">
                                      {imageSrc ? (
                                        <img
                                          alt={item.product_name}
                                          src={imageSrc}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                          <span className="material-icons-outlined text-lg">
                                            image
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-foreground">
                                        {item.product_name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        SKU: {item.product_sku}
                                      </div>
                                      {variantLabel ? (
                                        <div className="text-xs text-muted-foreground">
                                          {variantLabel}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right text-sm text-foreground">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right text-sm text-foreground">
                                  {formatCurrency(item.price)}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right text-sm font-medium text-foreground">
                                  {formatCurrency(item.subtotal)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-6 py-4">
                      <h2 className="text-lg font-medium text-foreground">
                        Detail Pembayaran &amp; Keuangan
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row">
                        <div>
                          <p className="mb-1 text-sm text-muted-foreground">
                            Metode Pembayaran
                          </p>
                          <div className="flex items-center">
                            <span className="material-icons-outlined mr-2 text-muted-foreground">
                              account_balance
                            </span>
                            <span className="font-medium text-foreground">
                              {order.payment_method || DEFAULT_PAYMENT_METHOD}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-muted-foreground">
                            ID Transaksi Pembayaran
                          </p>
                          <span className="rounded bg-muted px-2 py-1 font-mono text-sm text-foreground">
                            {order.payment_reference || "-"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Subtotal Barang
                          </span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(itemsSubtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Biaya Pengiriman
                          </span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(shippingCost)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Diskon
                          </span>
                          <span className="font-medium text-emerald-500">
                            -{formatCurrency(discountValue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-3">
                          <span className="text-base font-bold text-foreground">
                            Total Pembayaran
                          </span>
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {formatCurrency(totalPayment)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Aksi Pesanan
                    </h3>
                    <div className="space-y-3">
                      <button
                        className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
                        type="button"
                        disabled={!statusAction || pendingAction !== null}
                        onClick={() => {
                          if (!statusAction) return;
                          void handleStatusUpdate(
                            statusAction.nextStatus,
                            "status"
                          );
                        }}
                        title={statusAction?.label ?? "Ubah Status Pengiriman"}
                      >
                        <span className="material-icons-outlined mr-2">
                          local_shipping
                        </span>
                        Ubah Status Pengiriman
                      </button>
                      <button
                        className="flex w-full items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        type="button"
                        onClick={() => setInvoiceOpen(true)}
                      >
                        <span className="material-icons-outlined mr-2">
                          receipt
                        </span>
                        Cetak Invoice
                      </button>
                      <button
                        className="flex w-full items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        type="button"
                        onClick={() => setReturOpen(true)}
                      >
                        <span className="material-icons-outlined mr-2">
                          money_off
                        </span>
                        Ajukan Pengembalian Dana
                      </button>
                      <button
                        className="flex w-full items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
                        type="button"
                        disabled={!canCancel || pendingAction !== null}
                        onClick={() => void handleCancel()}
                      >
                        <span className="material-icons-outlined mr-2">
                          cancel
                        </span>
                        Batalkan Pesanan
                      </button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-6 py-4">
                      <h2 className="text-lg font-medium text-foreground">
                        Informasi Pelanggan
                      </h2>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="flex items-start">
                        <span className="material-icons-outlined mr-3 mt-0.5 text-muted-foreground">
                          person
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Customer
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-icons-outlined mr-3 mt-0.5 text-muted-foreground">
                          email
                        </span>
                        <div>
                          <p className="text-sm text-foreground">
                            {order.customer_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-icons-outlined mr-3 mt-0.5 text-muted-foreground">
                          phone
                        </span>
                        <div>
                          <p className="text-sm text-foreground">
                            {order.customer_phone}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-border pt-4">
                        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Alamat Pengiriman
                        </h4>
                        <div className="flex items-start">
                          <span className="material-icons-outlined mr-3 mt-0.5 text-muted-foreground">
                            place
                          </span>
                          <p className="text-sm leading-relaxed text-foreground">
                            {order.customer_address || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-border pt-4">
                        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Metode Pengiriman
                        </h4>
                        <div className="flex items-center">
                          <span className="material-icons-outlined mr-3 text-muted-foreground">
                            local_shipping
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {shippingMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-6 py-4">
                      <h2 className="text-lg font-medium text-foreground">
                        Riwayat Status
                      </h2>
                    </div>
                    <div className="p-6">
                      <ul className="relative ml-3 space-y-6 border-l-2 border-border pl-6">
                        {statusHistory.length === 0 ? (
                          <li className="relative">
                            <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-background bg-muted"></span>
                            <p className="text-sm font-medium text-foreground">
                              Status belum tersedia
                            </p>
                          </li>
                        ) : (
                          statusHistory.map((entry, index) => (
                            <li className="relative" key={`${entry.status}-${index}`}>
                              <span
                                className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-background ${
                                  index === 0 ? "bg-indigo-500" : "bg-muted"
                                }`}
                              ></span>
                              <p className="text-sm font-medium text-foreground">
                                {getTimelineLabel(entry.status)}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {formatOrderDateTime(entry.timestamp)}
                              </p>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <OrderInvoiceDialog
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
        order={order}
      />
      <OrderReturDialog
        open={returOpen}
        onOpenChange={setReturOpen}
        order={order}
      />
    </div>
  );
}
