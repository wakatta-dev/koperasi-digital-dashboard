/** @format */

export type OrderStatusAction = {
  nextStatus: string;
  label: string;
  icon: string;
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
type OrderBadge = {
  label: string;
  variant: BadgeVariant;
};

export function normalizeOrderStatus(status?: string) {
  const normalized = (status ?? "").toUpperCase();
  if (normalized === "SHIPPED") return "PAID";
  return normalized;
}

export function getPaymentBadge(status?: string): OrderBadge {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "CANCELED") {
    return {
      label: "Dibatalkan",
      variant: "destructive",
    };
  }
  if (normalized === "PENDING") {
    return {
      label: "Menunggu Pembayaran",
      variant: "secondary",
    };
  }
  if (["PAID", "PROCESSING", "COMPLETED"].includes(normalized)) {
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
  if (normalized === "PROCESSING") {
    return {
      label: "Dikirim",
      variant: "secondary",
    };
  }
  if (normalized === "PAID") {
    return {
      label: "Diproses",
      variant: "secondary",
    };
  }
  return {
    label: "Baru",
    variant: "outline",
  };
}

export function getTimelineLabel(status?: string) {
  const normalized = normalizeOrderStatus(status);
  switch (normalized) {
    case "PENDING":
      return "Pesanan Dibuat";
    case "PAID":
      return "Pembayaran Diterima";
    case "PROCESSING":
      return "Pesanan Diproses";
    case "COMPLETED":
      return "Pesanan Dikirim";
    case "CANCELED":
      return "Pesanan Dibatalkan";
    default:
      return "Status Diperbarui";
  }
}

export function getStatusAction(status?: string): OrderStatusAction | null {
  const normalized = normalizeOrderStatus(status);
  if (["PENDING", "PAID"].includes(normalized)) {
    return {
      nextStatus: "PROCESSING",
      label: "Proses Pesanan",
      icon: "play_circle",
    };
  }
  if (normalized === "PROCESSING") {
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
  return normalized !== "CANCELED";
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
