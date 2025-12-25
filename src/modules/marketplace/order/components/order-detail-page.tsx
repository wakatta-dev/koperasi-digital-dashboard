/** @format */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
    <div className="flex h-full flex-col overflow-hidden bg-[#F9FAFB] text-[#111827] antialiased dark:bg-[#0f172a] dark:text-[#f8fafc] font-['Inter',_sans-serif]">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#0f172a]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-6 dark:border-[#334155] dark:bg-[#0f172a]">
          <div className="flex items-center">
            <button
              className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
              type="button"
            >
              <span className="material-icons-outlined">menu</span>
            </button>
            <button
              className="mr-4 hidden text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 md:block"
              type="button"
            >
              <span className="material-icons-outlined">menu_open</span>
            </button>
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    className="text-sm font-medium text-[#6b7280] hover:text-[#4f46e5] dark:text-[#94a3b8] dark:hover:text-indigo-400"
                    href="/bumdes/marketplace/order"
                  >
                    Manajemen Pesanan
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400 dark:text-gray-600">/</span>
                </li>
                <li>
                  <span className="text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                    Detail Pesanan
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          <button
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-gray-200"
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
              className="group mb-4 inline-flex items-center text-sm font-medium text-[#6b7280] transition-colors hover:text-[#4f46e5] dark:text-[#94a3b8] dark:hover:text-indigo-400"
              href="/bumdes/marketplace/order"
            >
              <span className="material-icons-outlined mr-1 text-base transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              Kembali ke Manajemen Pesanan
            </Link>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
                Detail Pesanan{" "}
                <span className="ml-2 text-xl font-normal text-[#6b7280] dark:text-[#94a3b8]">
                  {formatOrderNumber(order?.order_number)}
                </span>
              </h1>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:hover:bg-slate-700"
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
            <div className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
              Memuat detail pesanan...
            </div>
          ) : null}
          {isError ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error instanceof Error
                ? error.message
                : "Gagal memuat detail pesanan."}
            </div>
          ) : null}

          {order ? (
            <>
              <div className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                      ID Pesanan
                    </p>
                    <p className="text-lg font-bold text-[#111827] dark:text-white">
                      {formatOrderNumber(order.order_number)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                      Tanggal Pesanan
                    </p>
                    <p className="text-lg font-bold text-[#111827] dark:text-white">
                      {formatOrderDate(order.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                      Status Pembayaran
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentBadge.className}`}
                    >
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      {paymentBadge.label}
                    </span>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                      Status Pengiriman
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${shippingBadge.className}`}
                    >
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      {shippingBadge.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                    <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
                      <h2 className="text-lg font-medium text-[#111827] dark:text-white">
                        Daftar Barang
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#e5e7eb] dark:divide-[#334155]">
                        <thead className="bg-gray-50 dark:bg-slate-800/50">
                          <tr>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                              scope="col"
                            >
                              Produk
                            </th>
                            <th
                              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                              scope="col"
                            >
                              Jumlah
                            </th>
                            <th
                              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                              scope="col"
                            >
                              Harga Satuan
                            </th>
                            <th
                              className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                              scope="col"
                            >
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#334155]">
                          {order.items.map((item) => {
                            const variantLabel = formatVariantLabel(item);
                            const imageSrc =
                              item.variant_image_url || item.product_photo;
                            return (
                              <tr
                                key={`${item.product_id}-${item.variant_option_id ?? item.product_sku}`}
                                className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                      {imageSrc ? (
                                        <img
                                          alt={item.product_name}
                                          src={imageSrc}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700">
                                          <span className="material-icons-outlined text-lg">
                                            image
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-[#111827] dark:text-white">
                                        {item.product_name}
                                      </div>
                                      <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                                        SKU: {item.product_sku}
                                      </div>
                                      {variantLabel ? (
                                        <div className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                                          {variantLabel}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </td>
                              <td className="px-6 py-4 text-right text-sm text-[#111827] dark:text-white">
                                {item.quantity}
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-[#111827] dark:text-white">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="px-6 py-4 text-right text-sm font-medium text-[#111827] dark:text-white">
                                {formatCurrency(item.subtotal)}
                              </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                    <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
                      <h2 className="text-lg font-medium text-[#111827] dark:text-white">
                        Detail Pembayaran &amp; Keuangan
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800 md:flex-row">
                        <div>
                          <p className="mb-1 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                            Metode Pembayaran
                          </p>
                          <div className="flex items-center">
                            <span className="material-icons-outlined mr-2 text-gray-400">
                              account_balance
                            </span>
                            <span className="font-medium text-[#111827] dark:text-white">
                              {order.payment_method || DEFAULT_PAYMENT_METHOD}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                            ID Transaksi Pembayaran
                          </p>
                          <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-[#111827] dark:bg-slate-700 dark:text-white">
                            {order.payment_reference || "-"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6b7280] dark:text-[#94a3b8]">
                            Subtotal Barang
                          </span>
                          <span className="font-medium text-[#111827] dark:text-white">
                            {formatCurrency(itemsSubtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6b7280] dark:text-[#94a3b8]">
                            Biaya Pengiriman
                          </span>
                          <span className="font-medium text-[#111827] dark:text-white">
                            {formatCurrency(shippingCost)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6b7280] dark:text-[#94a3b8]">
                            Diskon
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            -{formatCurrency(discountValue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                          <span className="text-base font-bold text-[#111827] dark:text-white">
                            Total Pembayaran
                          </span>
                          <span className="text-xl font-bold text-[#4f46e5] dark:text-indigo-400">
                            {formatCurrency(totalPayment)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                    <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                      Aksi Pesanan
                    </h3>
                    <div className="space-y-3">
                      <button
                        className="flex w-full items-center justify-center rounded-md bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 disabled:opacity-60"
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
                        className="flex w-full items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-50 focus:outline-none dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-slate-700"
                        type="button"
                        onClick={() => setInvoiceOpen(true)}
                      >
                        <span className="material-icons-outlined mr-2">
                          receipt
                        </span>
                        Cetak Invoice
                      </button>
                      <button
                        className="flex w-full items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-50 focus:outline-none dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-slate-700"
                        type="button"
                        onClick={() => setReturOpen(true)}
                      >
                        <span className="material-icons-outlined mr-2">
                          money_off
                        </span>
                        Ajukan Pengembalian Dana
                      </button>
                      <button
                        className="flex w-full items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none disabled:opacity-60 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
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
                  <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                    <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
                      <h2 className="text-lg font-medium text-[#111827] dark:text-white">
                        Informasi Pelanggan
                      </h2>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="flex items-start">
                        <span className="material-icons-outlined mr-3 mt-0.5 text-gray-400">
                          person
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#111827] dark:text-white">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                            Customer
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-icons-outlined mr-3 mt-0.5 text-gray-400">
                          email
                        </span>
                        <div>
                          <p className="text-sm text-[#111827] dark:text-white">
                            {order.customer_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-icons-outlined mr-3 mt-0.5 text-gray-400">
                          phone
                        </span>
                        <div>
                          <p className="text-sm text-[#111827] dark:text-white">
                            {order.customer_phone}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                          Alamat Pengiriman
                        </h4>
                        <div className="flex items-start">
                          <span className="material-icons-outlined mr-3 mt-0.5 text-gray-400">
                            place
                          </span>
                          <p className="text-sm leading-relaxed text-[#111827] dark:text-white">
                            {order.customer_address || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                        <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                          Metode Pengiriman
                        </h4>
                        <div className="flex items-center">
                          <span className="material-icons-outlined mr-3 text-gray-400">
                            local_shipping
                          </span>
                          <span className="text-sm font-medium text-[#111827] dark:text-white">
                            {shippingMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
                    <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
                      <h2 className="text-lg font-medium text-[#111827] dark:text-white">
                        Riwayat Status
                      </h2>
                    </div>
                    <div className="p-6">
                      <ul className="relative ml-3 space-y-6 border-l-2 border-gray-200 pl-6 dark:border-gray-700">
                        {statusHistory.length === 0 ? (
                          <li className="relative">
                            <span className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white bg-gray-300 dark:border-[#1e293b] dark:bg-gray-600"></span>
                            <p className="text-sm font-medium text-[#111827] dark:text-white">
                              Status belum tersedia
                            </p>
                          </li>
                        ) : (
                          statusHistory.map((entry, index) => (
                            <li className="relative" key={`${entry.status}-${index}`}>
                              <span
                                className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white dark:border-[#1e293b] ${
                                  index === 0
                                    ? "bg-blue-500"
                                    : "bg-gray-300 dark:bg-gray-600"
                                }`}
                              ></span>
                              <p className="text-sm font-medium text-[#111827] dark:text-white">
                                {getTimelineLabel(entry.status)}
                              </p>
                              <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#94a3b8]">
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
