/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";
import {
  useMarketplaceOrderActions,
  useMarketplaceOrders,
} from "@/hooks/queries/marketplace-orders";
import { OrderInvoiceDialog } from "./order-invoice-dialog";
import {
  canCancelOrder,
  formatOrderDate,
  formatOrderNumber,
  getPaymentBadge,
  getShippingBadge,
  getStatusAction,
} from "../utils";
import type { MarketplaceOrderSummaryResponse } from "@/types/api/marketplace";

const PAGE_SIZE = 10;

export function OrderListPage() {
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [invoiceOrderId, setInvoiceOrderId] = useState<number | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    | {
        id: number;
        action: string;
      }
    | null
  >(null);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateFilter]);

  const statusParam = useMemo(() => {
    if (statusFilter === "pending") return "PENDING";
    if (statusFilter === "paid") return "PAID,PROCESSING,COMPLETED";
    if (statusFilter === "canceled") return "CANCELED";
    return undefined;
  }, [statusFilter]);

  const queryParams = useMemo(
    () => ({
      q: search || undefined,
      status: statusParam,
      from: dateFilter || undefined,
      to: dateFilter || undefined,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      sort: "newest",
    }),
    [search, statusParam, dateFilter, page]
  );

  const { data, isLoading, isError, error } = useMarketplaceOrders(queryParams);
  const { updateStatus } = useMarketplaceOrderActions();

  const orders = data?.items ?? [];
  const totalItems = data?.total ?? orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const pageNumbers = useMemo(() => {
    const maxPages = Math.min(3, totalPages);
    return Array.from({ length: maxPages }, (_, idx) => idx + 1);
  }, [totalPages]);

  const handleOpenInvoice = (orderId: number) => {
    setInvoiceOrderId(orderId);
    setInvoiceOpen(true);
  };

  const handleStatusUpdate = async (
    order: MarketplaceOrderSummaryResponse,
    nextStatus: string,
    actionKey: string,
    reason?: string
  ) => {
    setPendingAction({ id: order.id, action: actionKey });
    try {
      await updateStatus.mutateAsync({
        id: order.id,
        payload: { status: nextStatus, reason },
      });
    } finally {
      setPendingAction(null);
    }
  };

  const handleCancel = async (order: MarketplaceOrderSummaryResponse) => {
    const ok = await confirm({
      variant: "delete",
      title: "Batalkan pesanan?",
      description: `Pesanan ${formatOrderNumber(order.order_number)} akan dibatalkan.`,
      confirmText: "Batalkan",
    });
    if (!ok) return;
    await handleStatusUpdate(order, "CANCELED", "cancel", "Dibatalkan oleh admin");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#F9FAFB] text-[#111827] antialiased dark:bg-[#0f172a] dark:text-[#f8fafc] font-['Inter',_sans-serif]">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#0f172a]">
        <header className="flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-6 dark:border-[#334155] dark:bg-[#0f172a]">
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
                    className="text-sm font-medium text-[#4f46e5] hover:underline dark:text-indigo-400"
                    href="/bumdes/marketplace/order"
                  >
                    Manajemen Pesanan
                  </Link>
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
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
              Manajemen Pesanan
            </h1>
          </div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-icons-outlined text-gray-400">
                  search
                </span>
              </div>
              <input
                className="block w-full rounded-md border border-[#e5e7eb] bg-white py-2 pl-10 pr-3 text-sm leading-5 text-[#111827] placeholder-[#6b7280] transition-colors focus:border-[#4f46e5] focus:outline-none focus:ring-1 focus:ring-[#4f46e5] focus:placeholder-gray-400 dark:border-[#334155] dark:bg-[#1e293b] dark:text-white dark:placeholder-[#94a3b8]"
                placeholder="Cari ID Pesanan, nama pelanggan, atau produk..."
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="relative group">
              <button
                className="inline-flex items-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#6b7280] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-slate-700"
                type="button"
              >
                <span className="material-icons-outlined mr-2 text-lg">
                  filter_list
                </span>
                Filter
              </button>
              <div className="absolute right-0 top-12 z-20 hidden w-64 rounded-md border border-[#e5e7eb] bg-white shadow-lg dark:border-[#334155] dark:bg-[#1e293b] group-hover:block">
                <div className="space-y-4 p-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      Rentang Tanggal
                    </label>
                    <input
                      className="w-full rounded border-gray-300 bg-gray-50 text-xs dark:border-gray-600 dark:bg-slate-800"
                      type="date"
                      value={dateFilter}
                      onChange={(event) => setDateFilter(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#6b7280] dark:text-[#94a3b8]">
                      Status Pembayaran
                    </label>
                    <select
                      className="w-full rounded border-gray-300 bg-gray-50 text-xs dark:border-gray-600 dark:bg-slate-800"
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                    >
                      <option value="all">Semua</option>
                      <option value="pending">Menunggu</option>
                      <option value="paid">Lunas</option>
                      <option value="canceled">Dibatalkan</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e5e7eb] dark:divide-[#334155]">
                <thead className="bg-gray-50 dark:bg-slate-800/50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      ID Pesanan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Tanggal Pesanan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Nama Pelanggan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Total Pembayaran
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Status Pembayaran
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]"
                      scope="col"
                    >
                      Status Pengiriman
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#94a3b8]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb] bg-white dark:divide-[#334155] dark:bg-[#1e293b]">
                  {isLoading ? (
                    <tr>
                      <td
                        className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]"
                        colSpan={7}
                      >
                        Memuat pesanan...
                      </td>
                    </tr>
                  ) : null}
                  {isError ? (
                    <tr>
                      <td
                        className="px-6 py-4 text-sm text-red-600 dark:text-red-400"
                        colSpan={7}
                      >
                        {error instanceof Error
                          ? error.message
                          : "Gagal memuat pesanan."}
                      </td>
                    </tr>
                  ) : null}
                  {!isLoading && !isError && orders.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]"
                        colSpan={7}
                      >
                        Tidak ada pesanan ditemukan.
                      </td>
                    </tr>
                  ) : null}
                  {orders.map((order) => {
                    const payment = getPaymentBadge(order.status);
                    const shipping = getShippingBadge(order.status);
                    const action = getStatusAction(order.status);
                    const isRowLoading = pendingAction?.id === order.id;
                    const canCancel = canCancelOrder(order.status);

                    return (
                      <tr
                        key={order.id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#4f46e5] dark:text-indigo-400">
                          {formatOrderNumber(order.order_number)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                          {formatOrderDate(order.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                          {order.customer_name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[#111827] dark:text-white">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${payment.className}`}
                          >
                            {payment.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${shipping.className}`}
                          >
                            {shipping.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              className="rounded-full p-1 text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#111827] dark:text-[#94a3b8] dark:hover:bg-slate-700 dark:hover:text-white"
                              href={`/bumdes/marketplace/order/${order.id}`}
                              title="Lihat Detail"
                            >
                              <span className="material-icons-outlined text-[18px]">
                                visibility
                              </span>
                            </Link>
                            <button
                              className="rounded-full p-1 text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#111827] dark:text-[#94a3b8] dark:hover:bg-slate-700 dark:hover:text-white"
                              type="button"
                              onClick={() => handleOpenInvoice(order.id)}
                              title="Cetak Invoice"
                            >
                              <span className="material-icons-outlined text-[18px]">
                                print
                              </span>
                            </button>
                            <button
                              className="rounded-full p-1 text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#94a3b8] dark:hover:bg-slate-700 dark:hover:text-white"
                              type="button"
                              disabled={!action || isRowLoading}
                              onClick={() => {
                                if (!action) return;
                                void handleStatusUpdate(order, action.nextStatus, "status");
                              }}
                              title={action?.label ?? "Ubah Status"}
                            >
                              <span
                                className={`material-icons-outlined text-[18px] ${
                                  isRowLoading && pendingAction?.action === "status"
                                    ? "animate-spin"
                                    : ""
                                }`}
                              >
                                {isRowLoading && pendingAction?.action === "status"
                                  ? "autorenew"
                                  : action?.icon ?? "play_circle"}
                              </span>
                            </button>
                            <button
                              className="rounded-full p-1 text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#94a3b8] dark:hover:bg-slate-700"
                              type="button"
                              disabled={!canCancel || isRowLoading}
                              onClick={() => void handleCancel(order)}
                              title="Batalkan Pesanan"
                            >
                              <span
                                className={`material-icons-outlined text-[18px] ${
                                  isRowLoading && pendingAction?.action === "cancel"
                                    ? "animate-spin"
                                    : ""
                                }`}
                              >
                                {isRowLoading && pendingAction?.action === "cancel"
                                  ? "autorenew"
                                  : "cancel"}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end border-t border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-[#94a3b8] dark:hover:bg-slate-700"
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  <span className="material-icons-outlined mr-1 text-sm">
                    chevron_left
                  </span>
                  Previous
                </button>
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                      number === page
                        ? "border border-[#e5e7eb] bg-white text-[#4f46e5] dark:border-[#334155] dark:bg-[#1e293b] dark:text-indigo-400"
                        : "text-[#6b7280] hover:bg-gray-100 dark:text-[#94a3b8] dark:hover:bg-slate-700"
                    }`}
                    type="button"
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ))}
                {totalPages > 3 ? (
                  <span className="px-2 text-[#6b7280] dark:text-[#94a3b8]">
                    ...
                  </span>
                ) : null}
                <button
                  className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-[#6b7280] transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-[#94a3b8] dark:hover:bg-slate-700"
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                >
                  Next
                  <span className="material-icons-outlined ml-1 text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OrderInvoiceDialog
        open={invoiceOpen}
        onOpenChange={(open) => {
          setInvoiceOpen(open);
          if (!open) setInvoiceOrderId(null);
        }}
        orderId={invoiceOrderId ?? undefined}
      />
    </div>
  );
}
