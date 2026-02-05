/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";
import {
  useMarketplaceOrderActions,
  useMarketplaceOrders,
} from "@/hooks/queries/marketplace-orders";
import type { MarketplaceOrderSummaryResponse } from "@/types/api/marketplace";
import { OrderInvoiceDialog } from "@/modules/marketplace/order/components/order-invoice-dialog";
import {
  canCancelOrder,
  formatOrderDate,
  formatOrderNumber,
  getStatusAction,
  normalizeOrderStatus,
} from "@/modules/marketplace/order/utils";
import type { OrderListItem, OrderStatus } from "@/modules/marketplace/types";
import { OrderListHeader } from "./OrderListHeader";
import { OrderTable } from "./OrderTable";
import { OrderPagination } from "./OrderPagination";

const PAGE_SIZE = 10;

const mapStatusLabel = (status?: string): OrderStatus => {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "COMPLETED") return "Completed";
  if (normalized === "PROCESSING") return "Processing";
  if (normalized === "PAID") return "Shipped";
  if (normalized === "CANCELED") return "Cancelled";
  return "Processing";
};

export function OrderListPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
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
  }, [search, dateFilter]);

  const queryParams = useMemo(
    () => ({
      q: search || undefined,
      from: dateFilter || undefined,
      to: dateFilter || undefined,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      sort: "newest",
    }),
    [search, dateFilter, page]
  );

  const { data, isLoading, isError, error } = useMarketplaceOrders(queryParams);
  const { updateStatus } = useMarketplaceOrderActions();

  const orders = data?.items ?? [];
  const totalItems = data?.total ?? orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const orderMap = useMemo(
    () => new Map(orders.map((order) => [String(order.id), order])),
    [orders]
  );

  const orderRows: OrderListItem[] = useMemo(
    () =>
      orders.map((order) => ({
        id: String(order.id),
        orderCode: formatOrderNumber(order.order_number),
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        date: formatOrderDate(order.created_at),
        total: order.total,
        status: mapStatusLabel(order.status),
      })),
    [orders]
  );

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

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div className="space-y-6">
      <OrderListHeader
        searchValue={search}
        dateValue={dateFilter}
        onSearchChange={setSearch}
        onDateChange={setDateFilter}
      />

      <OrderTable
        orders={orderRows}
        onRowClick={(order) => router.push(`/bumdes/marketplace/order/${order.id}`)}
        getActions={(row) => {
          const order = orderMap.get(row.id);
          if (!order) return [];
          const action = getStatusAction(order.status);
          const isRowLoading = pendingAction?.id === order.id;
          const canCancel = canCancelOrder(order.status);

          return [
            {
              label: "Lihat Detail",
              onSelect: () => router.push(`/bumdes/marketplace/order/${order.id}`),
            },
            {
              label: "Cetak Invoice",
              onSelect: () => handleOpenInvoice(order.id),
            },
            {
              label: action?.label ?? "Update Status",
              onSelect: () => {
                if (!action || isRowLoading) return;
                void handleStatusUpdate(order, action.nextStatus, "status");
              },
              disabled: !action || isRowLoading,
            },
            {
              label: "Batalkan Pesanan",
              tone: "destructive" as const,
              onSelect: () => void handleCancel(order),
              disabled: !canCancel || isRowLoading,
            },
          ];
        }}
      />

      <OrderPagination
        page={page}
        totalPages={totalPages}
        from={rangeStart}
        to={rangeEnd}
        total={totalItems}
        onPageChange={setPage}
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data pesanan...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "Gagal memuat pesanan."}
        </p>
      ) : null}

      <OrderInvoiceDialog
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
        orderId={invoiceOrderId}
      />
    </div>
  );
}
