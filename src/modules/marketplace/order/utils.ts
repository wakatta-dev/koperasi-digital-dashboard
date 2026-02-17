/** @format */

import {
  normalizeMarketplaceOrderStatus,
  getMarketplaceCanonicalStatusLabel,
  mapMarketplaceStatusFilterToQuery,
} from "@/modules/marketplace/utils/status";
import type { MarketplaceOrderStatus } from "@/types/api/marketplace";

export type OrderStatusAction = {
  nextStatus: MarketplaceOrderStatus;
  label: string;
  icon: string;
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
type OrderBadge = {
  label: string;
  variant: BadgeVariant;
};

export function normalizeOrderStatus(status?: string) {
  return normalizeMarketplaceOrderStatus(status);
}

export type OrderStatusFilterValue = "all" | MarketplaceOrderStatus;

export function normalizeOrderStatusFilter(value?: string | null) {
  return mapMarketplaceStatusFilterToQuery(value);
}

export function getOrderStatusDisplayLabel(status?: string) {
  return getMarketplaceCanonicalStatusLabel(status);
}

export function getPaymentBadge(status?: string): OrderBadge {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "CANCELED") {
    return {
      label: "Dibatalkan",
      variant: "destructive",
    };
  }
  if (normalized === "PENDING_PAYMENT") {
    return {
      label: "Menunggu Pembayaran",
      variant: "secondary",
    };
  }
  if (normalized === "PAYMENT_VERIFICATION") {
    return {
      label: "Verifikasi Pembayaran",
      variant: "secondary",
    };
  }
  if (["PROCESSING", "IN_DELIVERY", "COMPLETED"].includes(normalized)) {
    return {
      label: "Lunas",
      variant: "default",
    };
  }
  return {
    label: "Menunggu Pembayaran",
    variant: "outline",
  };
}

export function getShippingBadge(status?: string): OrderBadge {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "CANCELED") {
    return {
      label: "Dibatalkan",
      variant: "destructive",
    };
  }
  if (normalized === "COMPLETED") {
    return {
      label: "Selesai",
      variant: "default",
    };
  }
  if (normalized === "IN_DELIVERY") {
    return {
      label: "Dalam Pengiriman",
      variant: "secondary",
    };
  }
  if (normalized === "PROCESSING") {
    return {
      label: "Diproses",
      variant: "secondary",
    };
  }
  return {
    label: "Belum Diproses",
    variant: "outline",
  };
}

export function getTimelineLabel(status?: string) {
  const normalized = normalizeOrderStatus(status);
  switch (normalized) {
    case "PENDING_PAYMENT":
      return "Pesanan Dibuat";
    case "PAYMENT_VERIFICATION":
      return "Pembayaran Diverifikasi";
    case "PROCESSING":
      return "Pesanan Diproses";
    case "IN_DELIVERY":
      return "Pesanan Dikirim";
    case "COMPLETED":
      return "Pesanan Selesai";
    case "CANCELED":
      return "Pesanan Dibatalkan";
    default:
      return "Status Diperbarui";
  }
}

export function getStatusAction(status?: string): OrderStatusAction | null {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "PENDING_PAYMENT") {
    return {
      nextStatus: "PAYMENT_VERIFICATION",
      label: "Verifikasi Pembayaran",
      icon: "payments",
    };
  }
  if (normalized === "PAYMENT_VERIFICATION") {
    return {
      nextStatus: "PROCESSING",
      label: "Proses Pesanan",
      icon: "play_circle",
    };
  }
  if (normalized === "PROCESSING") {
    return {
      nextStatus: "IN_DELIVERY",
      label: "Kirim Pesanan",
      icon: "local_shipping",
    };
  }
  if (normalized === "IN_DELIVERY") {
    return {
      nextStatus: "COMPLETED",
      label: "Selesaikan Pesanan",
      icon: "check_circle",
    };
  }
  return null;
}

export function canCancelOrder(status?: string) {
  const normalized = normalizeOrderStatus(status);
  return (
    normalized === "PENDING_PAYMENT" ||
    normalized === "PAYMENT_VERIFICATION" ||
    normalized === "PROCESSING" ||
    normalized === "IN_DELIVERY"
  );
}

export function formatOrderDate(timestamp?: number) {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatOrderDateTime(timestamp?: number) {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatOrderNumber(orderNumber?: string) {
  if (!orderNumber) return "-";
  if (orderNumber.startsWith("#")) return orderNumber;
  return `#${orderNumber}`;
}
