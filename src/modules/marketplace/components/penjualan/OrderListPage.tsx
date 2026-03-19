/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";
import {
  useMarketplaceOrderActions,
  useMarketplaceOrders,
} from "@/hooks/queries/marketplace-orders";
import type {
  MarketplaceOrderStatusInput,
  MarketplaceOrderSummaryResponse,
} from "@/types/api/marketplace";
import { OrderInvoiceDialog } from "@/modules/marketplace/order/components/order-invoice-dialog";
import {
  canCancelOrder,
  formatOrderDate,
  formatOrderNumber,
  getStatusAction,
  normalizeOrderStatus,
  normalizeOrderStatusFilter,
} from "@/modules/marketplace/order/utils";
import type { OrderListItem } from "@/modules/marketplace/types";
import {
  getMarketplaceCanonicalStatusLabel,
  isMarketplaceTransitionAllowed,
  MARKETPLACE_ORDER_FILTER_OPTIONS,
} from "@/modules/marketplace/utils/status";
import { OrderListHeader } from "./OrderListHeader";
import { OrderTable } from "./OrderTable";

const PAGE_SIZE = 10;

export function OrderListPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const [uiState, setUiState] = useState({
    search: "",
    dateFilter: "",
    statusFilter: "all",
    pageState: {
      key: "",
      value: 1,
    },
    invoiceOrderId: undefined as number | undefined,
    invoiceOpen: false,
    pendingAction: null as { id: number; action: string } | null,
  });
  const { search, dateFilter, statusFilter, invoiceOrderId, invoiceOpen, pendingAction } =
    uiState;
  const pageKey = `${search}::${dateFilter}::${statusFilter}`;
  const pageState =
    uiState.pageState.key === ""
      ? { key: pageKey, value: 1 }
      : uiState.pageState;
  const page = pageState.key === pageKey ? pageState.value : 1;
  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };
  const setPage = (
    next: number | ((current: number) => number),
  ) => {
    const current = pageState.key === pageKey ? pageState.value : 1;
    const value = typeof next === "function" ? next(current) : next;
    patchUiState({
      pageState: { key: pageKey, value },
    });
  };

  const queryParams = useMemo(
    () => ({
      q: search || undefined,
      status: normalizeOrderStatusFilter(statusFilter),
      from: dateFilter || undefined,
      to: dateFilter || undefined,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      sort: "newest",
    }),
    [search, statusFilter, dateFilter, page],
  );

  const patchFilterState = (
    updates:
      | Partial<Pick<typeof uiState, "search" | "dateFilter" | "statusFilter">>
      | ((
          current: Pick<typeof uiState, "search" | "dateFilter" | "statusFilter">,
        ) => Pick<typeof uiState, "search" | "dateFilter" | "statusFilter">),
  ) => {
    patchUiState((current) => {
      const base = {
        search: current.search,
        dateFilter: current.dateFilter,
        statusFilter: current.statusFilter,
      };
      const next =
        typeof updates === "function" ? updates(base) : { ...base, ...updates };
      return {
        ...current,
        ...next,
      };
    });
  };

  const { data, isLoading, isError, error } = useMarketplaceOrders(queryParams);
  const { updateStatus } = useMarketplaceOrderActions();

  const orders = useMemo(() => data?.items ?? [], [data]);
  const totalItems = data?.total ?? orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const orderMap = useMemo(
    () => new Map(orders.map((order) => [String(order.id), order])),
    [orders],
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
        status: normalizeOrderStatus(order.status),
      })),
    [orders],
  );

  const handleOpenInvoice = (orderId: number) => {
    patchUiState({
      invoiceOrderId: orderId,
      invoiceOpen: true,
    });
  };

  const handleStatusUpdate = async (
    order: MarketplaceOrderSummaryResponse,
    nextStatus: MarketplaceOrderStatusInput,
    actionKey: string,
    reason?: string,
  ) => {
    if (!isMarketplaceTransitionAllowed(order.status, nextStatus)) {
      toast.error("Transisi status tidak valid untuk status saat ini.");
      return;
    }

    patchUiState({ pendingAction: { id: order.id, action: actionKey } });
    try {
      await updateStatus.mutateAsync({
        id: order.id,
        payload: { status: nextStatus, reason },
      });
    } finally {
      patchUiState({ pendingAction: null });
    }
  };

  const handleCancel = async (order: MarketplaceOrderSummaryResponse) => {
    if (!canCancelOrder(order.status)) {
      toast.error("Pesanan pada status ini tidak dapat dibatalkan.");
      return;
    }

    const ok = await confirm({
      variant: "delete",
      title: "Batalkan pesanan?",
      description: `Pesanan ${formatOrderNumber(order.order_number)} akan dibatalkan.`,
      confirmText: "Batalkan",
    });
    if (!ok) return;
    await handleStatusUpdate(
      order,
      "CANCELED",
      "cancel",
      "Dibatalkan oleh admin",
    );
  };

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div
      className="space-y-6"
      data-testid="marketplace-admin-order-page-root"
    >
      <OrderListHeader
        searchValue={search}
        dateValue={dateFilter}
        statusValue={statusFilter}
        statusOptions={MARKETPLACE_ORDER_FILTER_OPTIONS}
        onSearchChange={(value) => patchFilterState({ search: value })}
        onDateChange={(value) => patchFilterState({ dateFilter: value })}
        onStatusChange={(value) => patchFilterState({ statusFilter: value })}
      />

      <OrderTable
        orders={orderRows}
        onRowClick={(order) =>
          router.push(`/bumdes/marketplace/order/${order.id}`)
        }
        getActions={(row) => {
          const order = orderMap.get(row.id);
          if (!order) return [];
          const action = getStatusAction(order.status);
          const isRowLoading = pendingAction?.id === order.id;
          const canCancel = canCancelOrder(order.status);
          const isActionAllowed =
            !!action &&
            isMarketplaceTransitionAllowed(order.status, action.nextStatus);

          return [
            {
              label: "Lihat Detail",
              onSelect: () =>
                router.push(`/bumdes/marketplace/order/${order.id}`),
            },
            {
              label: "Cetak Invoice",
              onSelect: () => handleOpenInvoice(order.id),
            },
            {
              label: action?.label ?? "Update Status",
              onSelect: () => {
                if (!action || isRowLoading || !isActionAllowed) return;
                void handleStatusUpdate(order, action.nextStatus, "status");
              },
              disabled: !action || isRowLoading || !isActionAllowed,
            },
            {
              label: "Batalkan Pesanan",
              tone: "destructive" as const,
              onSelect: () => void handleCancel(order),
              disabled: !canCancel || isRowLoading,
            },
          ];
        }}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          totalItems,
          totalPages,
        }}
        paginationInfo={`Menampilkan ${rangeStart}-${rangeEnd} dari ${totalItems} hasil`}
        onPageChange={setPage}
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Memuat data pesanan...
        </p>
      ) : null}
      {isError ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "Gagal memuat pesanan."}
        </p>
      ) : null}

      {queryParams.status ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Filter status aktif: {getMarketplaceCanonicalStatusLabel(queryParams.status)}
        </p>
      ) : null}

      <OrderInvoiceDialog
        open={invoiceOpen}
        onOpenChange={(open) =>
          patchUiState({
            invoiceOpen: open,
            invoiceOrderId: open ? invoiceOrderId : undefined,
          })
        }
        orderId={invoiceOrderId}
      />
    </div>
  );
}
