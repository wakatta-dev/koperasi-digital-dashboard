/** @format */

"use client";

import { Mail, Printer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusBadgeClass } from "@/modules/marketplace/utils/status";
import type { OrderStatus } from "@/modules/marketplace/types";

export type OrderDetailHeaderProps = Readonly<{
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  onPrintInvoice?: () => void;
  onSendMessage?: () => void;
  onUpdateStatus?: () => void;
}>;

export function OrderDetailHeader({
  orderNumber,
  status,
  createdAt,
  onPrintInvoice,
  onSendMessage,
  onUpdateStatus,
}: OrderDetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pesanan {orderNumber}
          </h2>
          <Badge
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusBadgeClass(
              status
            )}`}
          >
            {status}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Dibuat pada {createdAt}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrintInvoice}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Printer className="h-4 w-4" />
          <span>Cetak Invoice</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSendMessage}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Mail className="h-4 w-4" />
          <span>Kirim Pesan</span>
        </Button>
        <Button
          type="button"
          onClick={onUpdateStatus}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Update Status</span>
        </Button>
      </div>
    </div>
  );
}
