/** @format */

export type OrderStatusAction = {
  nextStatus: string;
  label: string;
  icon: string;
};

export function normalizeOrderStatus(status?: string) {
  return (status ?? "").toUpperCase();
}

export function getPaymentBadge(status?: string) {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "CANCELED") {
    return {
      label: "Dibatalkan",
      className:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
  }
  if (normalized === "PENDING") {
    return {
      label: "Menunggu Pembayaran",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    };
  }
  if (["PAID", "PROCESSING", "COMPLETED"].includes(normalized)) {
    return {
      label: "Lunas",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    };
  }
  return {
    label: "Menunggu Pembayaran",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
}

export function getShippingBadge(status?: string) {
  const normalized = normalizeOrderStatus(status);
  if (normalized === "CANCELED") {
    return {
      label: "Dibatalkan",
      className:
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
  }
  if (normalized === "COMPLETED") {
    return {
      label: "Selesai",
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };
  }
  if (normalized === "PROCESSING") {
    return {
      label: "Dikirim",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };
  }
  if (normalized === "PAID") {
    return {
      label: "Diproses",
      className:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    };
  }
  return {
    label: "Baru",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
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
