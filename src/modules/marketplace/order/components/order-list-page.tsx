/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/shared/inputs/input-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GenericTable,
  type GenericTableColumn,
} from "@/components/shared/data-display/GenericTable";
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
import type {
  MarketplaceOrderStatusInput,
  MarketplaceOrderSummaryResponse,
} from "@/types/api/marketplace";

const PAGE_SIZE = 10;

export function OrderListPage() {
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [invoiceOrderId, setInvoiceOrderId] = useState<number | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: number;
    action: string;
  } | null>(null);

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
    nextStatus: MarketplaceOrderStatusInput,
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
      description: `Pesanan ${formatOrderNumber(
        order.order_number
      )} akan dibatalkan.`,
      confirmText: "Batalkan",
    });
    if (!ok) return;
    await handleStatusUpdate(
      order,
      "CANCELED",
      "cancel",
      "Dibatalkan oleh admin"
    );
  };

  const rowsForTable = !isLoading && !isError ? orders : [];
  const emptyState = isError ? (
    <span className="text-destructive">
      {error instanceof Error ? error.message : "Gagal memuat pesanan."}
    </span>
  ) : (
    "Tidak ada pesanan ditemukan."
  );

  const columns: GenericTableColumn<MarketplaceOrderSummaryResponse>[] = [
    {
      id: "orderNumber",
      header: "ID Pesanan",
      cellClassName:
        "whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400",
      render: (order) => formatOrderNumber(order.order_number),
    },
    {
      id: "orderDate",
      header: "Tanggal Pesanan",
      cellClassName: "whitespace-nowrap text-sm text-muted-foreground",
      render: (order) => formatOrderDate(order.created_at),
    },
    {
      id: "customer",
      header: "Nama Pelanggan",
      cellClassName: "whitespace-nowrap text-sm text-foreground",
      render: (order) => order.customer_name,
    },
    {
      id: "total",
      header: "Total Pembayaran",
      cellClassName: "whitespace-nowrap text-sm text-foreground",
      render: (order) => formatCurrency(order.total),
    },
    {
      id: "payment",
      header: "Status Pembayaran",
      cellClassName: "whitespace-nowrap",
      render: (order) => {
        const payment = getPaymentBadge(order.status);
        return <Badge variant={payment.variant}>{payment.label}</Badge>;
      },
    },
    {
      id: "shipping",
      header: "Status Pengiriman",
      cellClassName: "whitespace-nowrap",
      render: (order) => {
        const shipping = getShippingBadge(order.status);
        return <Badge variant={shipping.variant}>{shipping.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      align: "right",
      cellClassName: "whitespace-nowrap text-right text-sm font-medium",
      render: (order) => {
        const action = getStatusAction(order.status);
        const isRowLoading = pendingAction?.id === order.id;
        const canCancel = canCancelOrder(order.status);

        return (
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
              <span className="material-icons-outlined text-[18px]">print</span>
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
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-6 text-foreground md:space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <InputField
            ariaLabel="Cari pesanan"
            startIcon={<span className="material-icons-outlined">search</span>}
            placeholder="Cari ID Pesanan, nama pelanggan, atau produk..."
            type="text"
            value={search}
            onValueChange={setSearch}
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full h-auto rounded border border-border bg-background px-2 py-1 text-xs text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-border bg-popover text-foreground">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="paid">Lunas</SelectItem>
                    <SelectItem value="canceled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GenericTable
        columns={columns}
        rows={rowsForTable}
        loading={isLoading}
        loadingState="Memuat pesanan..."
        emptyState={emptyState}
        getRowKey={(row) => String(row.id)}
        containerClassName="w-full max-w-full"
        bodyClassName="bg-card"
        footer={
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                <span className="material-icons-outlined mr-1 text-sm">
                  chevron_left
                </span>
                Previous
              </Button>
              {pageNumbers.map((number) => (
                <Button
                  key={number}
                  type="button"
                  variant="ghost"
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    number === page
                      ? "border border-border bg-card text-indigo-600 dark:text-indigo-400"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setPage(number)}
                >
                  {number}
                </Button>
              ))}
              {totalPages > 3 ? (
                <span className="px-2 text-muted-foreground">...</span>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                className="flex items-center rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Next
                <span className="material-icons-outlined ml-1 text-sm">
                  chevron_right
                </span>
              </Button>
            </div>
          </div>
        }
      />
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
