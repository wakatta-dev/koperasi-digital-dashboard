/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
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

export function OrderDetailPage({ id }: OrderDetailPageProps) {
  const { data, isLoading, isError, error } = useMarketplaceOrder(id);
  const { updateStatus } = useMarketplaceOrderActions();
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<OrderStatus>("PENDING_PAYMENT");
  const [noteValue, setNoteValue] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");

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

    setNoteValue("");
    setNoteError(null);

    if (statusOptions.length > 0) {
      setStatusValue(statusOptions[0].value);
    } else {
      setStatusValue(detail.status);
    }

    setStatusOpen(true);
  };

  useEffect(() => {
    setInternalNotes(detail?.internalNotes ?? "");
  }, [detail?.internalNotes]);

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
      setNoteError("Alasan wajib diisi untuk transisi status ini.");
      toast.error("Alasan wajib diisi sebelum memperbarui status.");
      return;
    }

    await updateStatus.mutateAsync({
      id: data.id,
      payload: { status: statusValue, reason: reason || undefined },
    });
    setNoteError(null);
    setStatusOpen(false);
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
    <div className="space-y-6">
      <OrderDetailHeader
        orderNumber={detail.orderCode}
        status={detail.status}
        createdAt={detail.createdAt}
        onPrintInvoice={() => setInvoiceOpen(true)}
        onSendMessage={() => undefined}
        onUpdateStatus={handleOpenStatus}
      />

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
          <OrderNotesForm value={internalNotes} onChange={setInternalNotes} />
        </div>
      </div>

      <OrderStatusModal
        open={statusOpen}
        onOpenChange={setStatusOpen}
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
          setStatusValue(value as OrderStatus);
          setNoteError(null);
        }}
        onNoteChange={(value) => {
          setNoteValue(value);
          if (noteError) {
            setNoteError(null);
          }
        }}
        onSubmit={handleSubmitStatus}
      />

      <OrderInvoiceDialog
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
        orderId={detail.orderId}
      />
    </div>
  );
}
