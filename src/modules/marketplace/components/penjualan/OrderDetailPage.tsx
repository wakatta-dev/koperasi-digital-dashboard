/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMarketplaceOrder, useMarketplaceOrderActions } from "@/hooks/queries/marketplace-orders";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderItemsTable } from "./OrderItemsTable";
import { OrderTotalsSummary } from "./OrderTotalsSummary";
import { OrderTransactionInfo } from "./OrderTransactionInfo";
import { OrderCustomerCard } from "./OrderCustomerCard";
import { OrderNotesForm } from "./OrderNotesForm";
import { OrderStatusModal } from "./OrderStatusModal";
import type { OrderDetail, OrderItem, OrderStatus } from "@/modules/marketplace/types";
import {
  formatOrderDateTime,
  getOrderStatusDisplayLabel,
  normalizeOrderStatus,
} from "@/modules/marketplace/order/utils";
import {
  getMarketplaceTransitionOptions,
  getMarketplaceManualPaymentStatusLabel,
  isMarketplaceTransitionAllowed,
  isMarketplaceTransitionReasonRequired,
} from "@/modules/marketplace/utils/status";
import { OrderInvoiceDialog } from "@/modules/marketplace/order/components/order-invoice-dialog";

export type OrderDetailPageProps = Readonly<{
  id: string;
}>;

const mapStatusLabel = (status?: string): OrderStatus => normalizeOrderStatus(status);

const toOrderItems = (items: any[] | undefined): OrderItem[] => {
  if (!items) return [];
  return items.map((item) => ({
    productName: item.product_name,
    sku: item.product_sku,
    unitPrice: item.price,
    qty: item.quantity,
    totalPrice: item.subtotal ?? item.price * item.quantity,
  }));
};

const resolvePaymentStatusLabel = (status?: string) => {
  const normalized = normalizeOrderStatus(status);

  if (normalized === "PENDING_PAYMENT") return "Pending";
  if (normalized === "PAYMENT_VERIFICATION") return "Verifikasi";
  if (normalized === "CANCELED") return "Gagal";
  return "Lunas";
};

const WORKSPACE_PAYMENT_BADGE_CLASS = {
  confirmed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900/50",
  waiting:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50",
  rejected:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50",
} as const;

function resolveWorkspacePaymentState(data: any) {
  const manualStatus = data?.manual_payment?.status;

  if (manualStatus === "CONFIRMED") {
    return {
      label: getMarketplaceManualPaymentStatusLabel(manualStatus),
      helper: "Pembayaran manual sudah diverifikasi dan aman untuk diproses lebih lanjut.",
      className: WORKSPACE_PAYMENT_BADGE_CLASS.confirmed,
    };
  }

  if (
    manualStatus === "MANUAL_PAYMENT_SUBMITTED" ||
    manualStatus === "WAITING_MANUAL_CONFIRMATION"
  ) {
    return {
      label: "Menunggu Verifikasi Pembayaran",
      helper: "Bukti pembayaran sudah diterima dan masih menunggu keputusan admin.",
      className: WORKSPACE_PAYMENT_BADGE_CLASS.pending,
    };
  }

  if (manualStatus === "REJECTED") {
    return {
      label: getMarketplaceManualPaymentStatusLabel(manualStatus),
      helper: "Pembayaran ditolak dan membutuhkan tindak lanjut sebelum order dapat berlanjut.",
      className: WORKSPACE_PAYMENT_BADGE_CLASS.rejected,
    };
  }

  if (data?.status === "PENDING_PAYMENT") {
    return {
      label: "Menunggu Pembayaran",
      helper: "Order belum memiliki pembayaran yang tervalidasi.",
      className: WORKSPACE_PAYMENT_BADGE_CLASS.waiting,
    };
  }

  if (data?.status === "PAYMENT_VERIFICATION") {
    return {
      label: "Menunggu Verifikasi Pembayaran",
      helper: "Order sudah berada pada tahap verifikasi pembayaran operasional.",
      className: WORKSPACE_PAYMENT_BADGE_CLASS.pending,
    };
  }

  if (data?.status === "CANCELED") {
    return {
      label: "Pembayaran Tidak Aktif",
      helper: "Order dibatalkan sehingga tidak ada pembayaran aktif yang perlu ditindaklanjuti.",
      className: WORKSPACE_PAYMENT_BADGE_CLASS.rejected,
    };
  }

  return {
    label: "Pembayaran Terkonfirmasi",
    helper: "Order sudah berada pada tahap operasional setelah pembayaran diputuskan.",
    className: WORKSPACE_PAYMENT_BADGE_CLASS.confirmed,
  };
}

function resolveMarketplaceAccountingState(data: any) {
  const readiness = data?.accounting_readiness;
  const readinessStatus = String(readiness?.status ?? "").trim().toLowerCase();
  if (readinessStatus === "problematic") {
    return {
      label: "Bermasalah",
      helper:
        readiness?.reason ||
        "Ada masalah pada pembayaran sehingga transaksi belum layak diteruskan ke accounting.",
      className: "border border-red-200 bg-red-50 text-red-700",
      reference: readiness?.reference || null,
    };
  }

  if (readinessStatus === "not_applicable") {
    return {
      label: "Tidak Perlu Posting",
      helper:
        readiness?.reason ||
        "Order dibatalkan sehingga tidak ada handoff accounting yang perlu dijalankan.",
      className: "border border-slate-200 bg-slate-50 text-slate-700",
      reference: readiness?.reference || null,
    };
  }

  if (readinessStatus === "not_ready") {
    return {
      label: "Belum Siap",
      helper:
        readiness?.reason ||
        "Accounting menunggu kepastian pembayaran dan status operasional dasar.",
      className: "border border-amber-200 bg-amber-50 text-amber-700",
      reference: readiness?.reference || null,
    };
  }

  if (readinessStatus === "ready") {
    return {
      label: "Siap Ditinjau",
      helper:
        readiness?.reason ||
        "Transaksi sudah memiliki dasar operasional untuk diteruskan ke proses accounting berikutnya.",
      className: "border border-indigo-200 bg-indigo-50 text-indigo-700",
      reference: readiness?.reference || null,
    };
  }

  const status = normalizeOrderStatus(data?.status);
  const manualStatus = (data?.manual_payment?.status ?? "").trim().toUpperCase();

  if (manualStatus === "REJECTED") {
    return {
      label: "Bermasalah",
      helper: "Ada masalah pada pembayaran sehingga transaksi belum layak diteruskan ke accounting.",
      className: "border border-red-200 bg-red-50 text-red-700",
      reference: null,
    };
  }

  if (status === "CANCELED") {
    return {
      label: "Tidak Perlu Posting",
      helper: "Order dibatalkan sehingga tidak ada handoff accounting yang perlu dijalankan.",
      className: "border border-slate-200 bg-slate-50 text-slate-700",
      reference: null,
    };
  }

  if (status === "PENDING_PAYMENT" || status === "PAYMENT_VERIFICATION") {
    return {
      label: "Belum Siap",
      helper: "Accounting menunggu kepastian pembayaran dan status operasional dasar.",
      className: "border border-amber-200 bg-amber-50 text-amber-700",
      reference: null,
    };
  }

  return {
    label: "Siap Ditinjau",
    helper: "Transaksi sudah memiliki dasar operasional untuk diteruskan ke proses accounting berikutnya.",
    className: "border border-indigo-200 bg-indigo-50 text-indigo-700",
    reference: null,
  };
}

function resolveSettlementModeLabel(mode?: string) {
  const normalized = String(mode ?? "").trim().toUpperCase();
  switch (normalized) {
    case "DIRECT_REVENUE":
      return "Pendapatan Langsung";
    case "MERCHANT_PAYOUT":
      return "Butuh Payout";
    default:
      return "Belum Diatur";
  }
}

function resolvePayoutStatusLabel(status?: string) {
  const normalized = String(status ?? "").trim().toUpperCase();
  switch (normalized) {
    case "NOT_APPLICABLE":
      return "Tidak Berlaku";
    case "PENDING_PAYOUT":
      return "Menunggu Payout";
    case "SCHEDULED":
      return "Payout Dijadwalkan";
    case "PAID":
      return "Payout Selesai";
    default:
      return "Belum Diatur";
  }
}

function resolveFinancialFlowTypeLabel(flowType?: string) {
  const normalized = String(flowType ?? "").trim().toUpperCase();
  switch (normalized) {
    case "REFUND":
      return "Refund";
    case "RETURN":
      return "Return";
    default:
      return "Belum Ada";
  }
}

function resolveFinancialDecisionStatusLabel(status?: string) {
  const normalized = String(status ?? "").trim().toUpperCase();
  switch (normalized) {
    case "APPROVED":
      return "Refund Disetujui";
    case "RECOGNIZED":
      return "Return Diakui";
    default:
      return "Belum Diputuskan";
  }
}

function resolveRefundStatusLabel(status?: string) {
  const normalized = String(status ?? "").trim().toUpperCase();
  switch (normalized) {
    case "NOT_APPLICABLE":
      return "Tidak Berlaku";
    case "PENDING_REFUND":
      return "Menunggu Refund";
    case "REFUND_PAID":
      return "Refund Selesai";
    default:
      return "Belum Diatur";
  }
}

function resolveAccountingConsequenceLabel(status?: string) {
  const normalized = String(status ?? "").trim().toUpperCase();
  switch (normalized) {
    case "PENDING_CONSEQUENCE":
      return "Konsekuensi Pending";
    case "CONSEQUENCE_RECORDED":
      return "Konsekuensi Tercatat";
    default:
      return "Belum Diatur";
  }
}

function resolveNextValidAction(detail: OrderDetail | null, data: any) {
  if (!detail || !data) return null;

  if (
    data.manual_payment &&
    ["MANUAL_PAYMENT_SUBMITTED", "WAITING_MANUAL_CONFIRMATION"].includes(
      data.manual_payment.status ?? "",
    )
  ) {
    return {
      label: "Tinjau Pembayaran Manual",
      helper:
        "Bukti pembayaran manual tersedia dan harus ditinjau sebelum proses order dilanjutkan.",
    };
  }

  const options = getMarketplaceTransitionOptions(detail.status);
  if (options.length > 0) {
    return {
      label: options[0]?.label ?? "Update Status",
      helper: "Ini adalah tindakan operasional berikutnya yang valid dari status order saat ini.",
    };
  }

  return {
    label: "Tidak Ada Aksi Lanjutan",
    helper: "Order sudah berada pada status terminal atau tidak memiliki langkah operasional berikutnya.",
  };
}

export function OrderDetailPage({ id }: OrderDetailPageProps) {
  const { data, isLoading, isError, error } = useMarketplaceOrder(id);
  const { updateStatus } = useMarketplaceOrderActions();
  const [uiState, setUiState] = useState({
    statusOpen: false,
    statusValue: "PENDING_PAYMENT" as OrderStatus,
    noteValue: "",
    noteError: null as string | null,
    invoiceOpen: false,
    internalNotes: "",
  });
  const {
    statusOpen,
    statusValue,
    noteValue,
    noteError,
    invoiceOpen,
    internalNotes,
  } = uiState;
  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };

  const detail: OrderDetail | null = useMemo(() => {
    if (!data) return null;
    const items = toOrderItems(data.items);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = Math.round(subtotal * 0.11);
    const shipping = 0;
    const total = data.total || subtotal + tax + shipping;

    return {
      orderId: String(data.id),
      orderCode: data.order_number ? `#${data.order_number}` : "-",
      status: mapStatusLabel(data.status),
      createdAt: formatOrderDateTime(data.created_at),
      items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: {
        id: data.payment_method ?? "-",
        type: "card",
        label: data.payment_method ?? "-",
        masked: data.payment_reference ?? "-",
        expiry: null,
        isDefault: true,
      },
      paymentStatus: resolvePaymentStatusLabel(data.status),
      shippingCourier: data.shipping_method ?? "JNE Regular",
      trackingNumber: data.shipping_tracking_number ?? null,
      guestTrackingEnabled: data.guest_tracking_enabled,
      trackingToken: data.tracking_token ?? null,
      reviewState: data.review_state,
      reviewSubmittedAt: data.review_submitted_at,
      manualPaymentProofUrl: data.manual_payment?.proof_url,
      manualPaymentNote: data.manual_payment?.note,
      manualPaymentBankName: data.manual_payment?.bank_name,
      manualPaymentAccountName: data.manual_payment?.account_name,
      manualPaymentTransferAmount: data.manual_payment?.transfer_amount,
      manualPaymentTransferDate: data.manual_payment?.transfer_date,
      statusHistory:
        data.status_history?.map((entry) => ({
          status: mapStatusLabel(entry.status),
          timestamp: formatOrderDateTime(entry.timestamp),
          reason: entry.reason ?? null,
        })) ?? [],
      customer: {
        name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone,
        orderCount: 0,
      },
      shippingAddress: {
        label: "Alamat Pengiriman",
        line1: data.customer_address ?? "-",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      },
      billingAddress: {
        label: "Alamat Penagihan",
        line1: "Sama dengan alamat pengiriman",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      },
      internalNotes: data.notes ?? "",
    };
  }, [data]);

  const statusOptions = useMemo(
    () =>
      getMarketplaceTransitionOptions(detail?.status).map((option) => ({
        value: option.value,
        label: option.label,
      })),
    [detail?.status],
  );

  const handleOpenStatus = () => {
    if (!detail) return;

    patchUiState({
      noteValue: "",
      noteError: null,
      statusValue:
        statusOptions.length > 0 ? statusOptions[0].value : detail.status,
      statusOpen: true,
    });
  };

  useEffect(() => {
    patchUiState({ internalNotes: detail?.internalNotes ?? "" });
  }, [detail?.internalNotes]);

  const workspacePaymentState = useMemo(() => resolveWorkspacePaymentState(data), [data]);
  const accountingWorkspaceState = useMemo(
    () => resolveMarketplaceAccountingState(data),
    [data],
  );

  const nextValidAction = useMemo(() => resolveNextValidAction(detail, data), [data, detail]);

  const reasonRequired = useMemo(
    () =>
      isMarketplaceTransitionReasonRequired(
        detail?.status,
        statusValue,
      ),
    [detail?.status, statusValue],
  );

  const handleSubmitStatus = async () => {
    if (!data) return;

    if (!isMarketplaceTransitionAllowed(data.status, statusValue)) {
      toast.error("Transisi status tidak valid untuk pesanan ini.");
      return;
    }

    const reason = noteValue.trim();
    if (
      isMarketplaceTransitionReasonRequired(data.status, statusValue) &&
      reason.length === 0
    ) {
      patchUiState({ noteError: "Alasan wajib diisi untuk transisi status ini." });
      toast.error("Alasan wajib diisi sebelum memperbarui status.");
      return;
    }

    await updateStatus.mutateAsync({
      id: data.id,
      payload: { status: statusValue, reason: reason || undefined },
    });
    patchUiState({ noteError: null, statusOpen: false });
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Memuat detail pesanan...</p>;
  }

  if (isError || !detail) {
    return (
      <p className="text-sm text-red-500">
        {error instanceof Error ? error.message : "Gagal memuat detail pesanan."}
      </p>
    );
  }

  return (
    <div className="space-y-6" data-testid="marketplace-admin-order-detail-page-root">
      <OrderDetailHeader
        orderNumber={detail.orderCode}
        status={detail.status}
        createdAt={detail.createdAt}
        onPrintInvoice={() => patchUiState({ invoiceOpen: true })}
        onSendMessage={() => undefined}
        onUpdateStatus={handleOpenStatus}
      />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Workspace Transaksi
            </p>
            <h3 className="mt-1 text-xl font-bold text-foreground">{detail.orderCode}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Terakhir diperbarui {formatOrderDateTime(data?.updated_at ?? data?.created_at)}
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
            {data?.fulfillment_method === "DELIVERY" ? "Fulfillment Pengiriman" : "Fulfillment Pickup"}
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status Operasional
            </p>
            <Badge className="mt-2">{getOrderStatusDisplayLabel(detail.status)}</Badge>
            <p className="mt-3 text-sm text-muted-foreground">
              Status operasional mengikuti lifecycle pemrosesan order marketplace.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status Pembayaran
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${workspacePaymentState.className}`}
            >
              {workspacePaymentState.label}
            </span>
            <p className="mt-3 text-sm text-muted-foreground">{workspacePaymentState.helper}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status Accounting
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${accountingWorkspaceState.className}`}
            >
              {accountingWorkspaceState.label}
            </span>
            <p className="mt-3 text-sm text-muted-foreground">
              {accountingWorkspaceState.helper}
            </p>
            {accountingWorkspaceState.reference ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Referensi Accounting:{" "}
                <span className="font-medium text-foreground">
                  {accountingWorkspaceState.reference}
                </span>
              </p>
            ) : null}
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tindakan Berikutnya
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {nextValidAction?.label ?? "Tidak Ada Aksi Lanjutan"}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{nextValidAction?.helper}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Settlement Finance
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {resolveSettlementModeLabel(data?.settlement?.settlement_mode)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Status payout: {resolvePayoutStatusLabel(data?.settlement?.payout_status)}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                Referensi Payout:{" "}
                <span className="font-medium text-foreground">
                  {data?.settlement?.payout_reference || "-"}
                </span>
              </p>
              <p className="mt-2">
                Status operasional tetap mengikuti lifecycle order dan tidak berubah oleh settlement.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Refund / Return Finance
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {resolveFinancialFlowTypeLabel(data?.financial_adjustment?.flow_type)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Keputusan:{" "}
                {resolveFinancialDecisionStatusLabel(
                  data?.financial_adjustment?.decision_status,
                )}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Status refund:{" "}
                {resolveRefundStatusLabel(data?.financial_adjustment?.refund_status)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Consequence accounting:{" "}
                {resolveAccountingConsequenceLabel(
                  data?.financial_adjustment?.accounting_consequence_status,
                )}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                Reference Tindak Lanjut:{" "}
                <span className="font-medium text-foreground">
                  {data?.financial_adjustment?.follow_up_reference || "-"}
                </span>
              </p>
              <p className="mt-2">
                Event Accounting:{" "}
                <span className="font-medium text-foreground">
                  {data?.financial_adjustment?.accounting_event_key || "-"}
                </span>
              </p>
              <p className="mt-2">
                Reference Accounting:{" "}
                <span className="font-medium text-foreground">
                  {data?.financial_adjustment?.accounting_reference || "-"}
                </span>
              </p>
              <p className="mt-2">
                {data?.financial_adjustment?.reason ||
                  "Belum ada alasan refund/return yang tercatat."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsTable
            items={detail.items}
            footer={
              <OrderTotalsSummary
                subtotal={detail.subtotal}
                tax={detail.tax}
                shipping={detail.shipping}
                total={detail.total}
              />
            }
          />
          <OrderTransactionInfo
            paymentBrand={detail.paymentMethod.label}
            paymentMasked={detail.paymentMethod.masked}
            paymentStatus={detail.paymentStatus}
            shippingCourier={detail.shippingCourier}
            trackingNumber={detail.trackingNumber}
            guestTrackingEnabled={detail.guestTrackingEnabled}
            trackingToken={detail.trackingToken}
            reviewState={detail.reviewState}
            reviewSubmittedAt={detail.reviewSubmittedAt}
            manualPaymentProofUrl={detail.manualPaymentProofUrl}
            manualPaymentNote={detail.manualPaymentNote}
            manualPaymentBankName={detail.manualPaymentBankName}
            manualPaymentAccountName={detail.manualPaymentAccountName}
            manualPaymentTransferAmount={detail.manualPaymentTransferAmount}
            manualPaymentTransferDate={detail.manualPaymentTransferDate}
          />
        </div>
        <div className="space-y-6">
          <OrderCustomerCard
            name={detail.customer.name}
            orderCount={detail.customer.orderCount}
            email={detail.customer.email}
            phone={detail.customer.phone}
            shippingAddress={detail.shippingAddress.line1}
            billingSameAsShipping
          />
          <OrderNotesForm
            value={internalNotes}
            onChange={(value) => patchUiState({ internalNotes: value })}
          />
          <div className="surface-card p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Riwayat Status</h3>
            <div className="mt-4 space-y-4">
              {detail.statusHistory.length > 0 ? (
                detail.statusHistory.map((entry, index) => (
                  <div
                    key={`${entry.status}-${entry.timestamp}-${entry.reason ?? "no-reason"}`}
                    className="rounded-lg border border-border bg-muted/20 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {getOrderStatusDisplayLabel(entry.status)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{entry.timestamp}</p>
                    {entry.reason ? (
                      <p className="mt-2 text-sm text-muted-foreground">Catatan: {entry.reason}</p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada riwayat status untuk transaksi ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <OrderStatusModal
        open={statusOpen}
        onOpenChange={(open) => patchUiState({ statusOpen: open })}
        orderNumber={detail.orderCode}
        currentStatusLabel={getOrderStatusDisplayLabel(detail.status)}
        status={statusValue}
        statusOptions={statusOptions}
        submitDisabled={statusOptions.length === 0 || updateStatus.isPending}
        isSubmitting={updateStatus.isPending}
        note={noteValue}
        reasonRequired={reasonRequired}
        noteError={noteError ?? undefined}
        onStatusChange={(value) => {
          patchUiState({
            statusValue: value as OrderStatus,
            noteError: null,
          });
        }}
        onNoteChange={(value) => {
          patchUiState((current) => ({
            ...current,
            noteValue: value,
            noteError: current.noteError ? null : current.noteError,
          }));
        }}
        onSubmit={handleSubmitStatus}
      />

      <OrderInvoiceDialog
        open={invoiceOpen}
        onOpenChange={(open) => patchUiState({ invoiceOpen: open })}
        orderId={detail.orderId}
      />
    </div>
  );
}
