/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
    <div className="flex h-full flex-col overflow-hidden bg-background text-foreground antialiased">
      <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
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
                    className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    href="/bumdes/marketplace/order"
                  >
                    Manajemen Pesanan
                  </Link>
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
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-foreground">Manajemen Pesanan</h1>
          </div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-icons-outlined text-muted-foreground">
                  search
                </span>
              </div>
              <Input
                placeholder="Cari ID Pesanan, nama pelanggan, atau produk..."
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative group">
              <button
                className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="button"
              >
                <span className="material-icons-outlined mr-2 text-lg">
                  filter_list
                </span>
                Filter
              </button>
              <div className="absolute right-0 top-12 z-20 hidden w-64 rounded-md border border-border bg-popover shadow-lg group-hover:block">
                <div className="space-y-4 p-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Rentang Tanggal
                    </label>
                    <Input
                      className="w-full text-xs"
                      type="date"
                      value={dateFilter}
                      onChange={(event) => setDateFilter(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Status Pembayaran
                    </label>
                    <select
                      className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
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
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/40">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      scope="col"
                    >
                      ID Pesanan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      scope="col"
                    >
                      Tanggal Pesanan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      scope="col"
                    >
                      Nama Pelanggan
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      scope="col"
                    >
                      Total Pembayaran
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      scope="col"
                    >
                      Status Pembayaran
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      scope="col"
                    >
                      Status Pengiriman
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {isLoading ? (
                    <tr>
                      <td
                        className="px-6 py-4 text-sm text-muted-foreground"
                        colSpan={7}
                      >
                        Memuat pesanan...
                      </td>
                    </tr>
                  ) : null}
                  {isError ? (
                    <tr>
                      <td
                        className="px-6 py-4 text-sm text-destructive"
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
                        className="px-6 py-4 text-sm text-muted-foreground"
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
                        className="transition-colors hover:bg-muted/40"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {formatOrderNumber(order.order_number)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                          {formatOrderDate(order.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                          {order.customer_name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Badge variant={payment.variant}>{payment.label}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Badge variant={shipping.variant}>{shipping.label}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              href={`/bumdes/marketplace/order/${order.id}`}
                              title="Lihat Detail"
                            >
                              <span className="material-icons-outlined text-[18px]">
                                visibility
                              </span>
                            </Link>
                            <button
                              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              type="button"
                              onClick={() => handleOpenInvoice(order.id)}
                              title="Cetak Invoice"
                            >
                              <span className="material-icons-outlined text-[18px]">
                                print
                              </span>
                            </button>
                            <button
                              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
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
                              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
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
            <div className="flex items-center justify-end border-t border-border px-6 py-4">
              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
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
                        ? "border border-border bg-card text-indigo-600 dark:text-indigo-400"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    type="button"
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ))}
                {totalPages > 3 ? (
                  <span className="px-2 text-muted-foreground">...</span>
                ) : null}
                <button
                  className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
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
